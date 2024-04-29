import {FullscreenCenter} from "../../components/FullscreenCenter.tsx";
import {auth} from "../../utils/firebase.ts";
import {useState} from "react";
import {
    deleteTransaction,
    getTransactionsFilterOrderBy,
    overwriteTransaction,
    Transaction,
    writeNewTransaction
} from "../../utils/transaction.ts";
import {faker, fakerEN_GB} from "@faker-js/faker";
import {getCurrentBalance} from "../../utils/transaction_utils.ts";
import {signInWithGoogle} from "../../utils/authentication.ts";
import {Header} from "../../components/Header.tsx";
import { orderBy } from "firebase/firestore";
import {User} from "firebase/auth";
import {getUserPrefs, setUserPrefs, UserPrefs} from "../../utils/user_prefs.ts";
import {round} from "lodash";

function writeSampleData() {
    if (auth.currentUser === null) {
        console.log("No User");
        return;
    }

    console.log("Adding sample data");
    const t = new Transaction(
        fakerEN_GB.location.streetAddress() + ", " + fakerEN_GB.location.city() + ", " + fakerEN_GB.location.zipCode(),
        parseFloat(faker.finance.amount({min: -1000, max: 1000})),
        faker.word.noun(),
        faker.finance.currency().code,
        faker.date.past().valueOf(),
        faker.lorem.sentence(),
        faker.internet.emoji(),
        faker.word.noun(),
        faker.lorem.sentence(),
        auth.currentUser.uid
    );

    writeNewTransaction(auth.currentUser, t).then((t) => {console.log("Added sample data:"); console.log(t);})
}


export function TestFirestorePage() {
    const [authResolved, setAuthResolved] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [balance, setBalance] = useState(0);
    const [update ,setUpdate] = useState(0);
    const [user, setUser] = useState<string | undefined>(undefined);
    const [userPrefs, _setUserPrefs] = useState<UserPrefs | null>(null);

    if (!authResolved) {
        auth.authStateReady().then(() => setAuthResolved(true));
        return <>
            <FullscreenCenter>
                <div className="text-center">
                    <h1>Waiting for Auth</h1>
                </div>
            </FullscreenCenter>
        </>;
    }

    if (auth.currentUser === null) {
        auth.onAuthStateChanged((new_user: User | null) => {
            if (new_user !== null && new_user.uid !== user) {
                setUser(new_user.uid)
            }
        });
        return <>
                <Header/>
                <FullscreenCenter>
                    <div className="text-center">
                        <h1>Not Logged In</h1>
                        <button type="button" className="login-with-google-btn" onClick={signInWithGoogle}>
                            Sign in with Google
                        </button>
                    </div>
                </FullscreenCenter>
        </>;
    }

    getTransactionsFilterOrderBy(auth.currentUser, orderBy("dateTime", "desc")).then((t) => setTransactions(t));
    getCurrentBalance(auth.currentUser).then((b) => setBalance(b));
    getUserPrefs(auth.currentUser).then((up) => _setUserPrefs(up));

    return (
        <>
            <Header/>
            <div className="text-center">
                <h1>Logged In - {auth.currentUser.uid} - {auth.currentUser.displayName}</h1>
                <button type="button" className="login-with-google-btn" onClick={signInWithGoogle}>
                    Sign in with Google
                </button>
            </div>
            <div>
                <h4>UserPrefs</h4>
                {
                    userPrefs ? <>
                    <p>Goal: {userPrefs.getNeedsBudget()} | {userPrefs.getWantsBudget()} | {userPrefs.getSavingsBudget()}</p>
                    <button className="mb-4" onClick={() => {
                        const needs = round(faker.number.float({min: 0, max: 0.5}), 2);
                        const wants = round(faker.number.float({min: 0, max: 0.5}), 2);
                        setUserPrefs(auth.currentUser!, UserPrefs.newChecked(needs, wants)).then(() => setUpdate(update + 1));
                    }}>Randomise
                    </button>
                </> : <p>Loading</p>
                }
            </div>
            <h1>
                Transactions
            </h1>
            <p>
                Balance: {balance}
            </p>
            <button className="mb-4" onClick={() => {
                writeSampleData();
                setUpdate(update + 1);
            }}>Add Sample Transaction
            </button>
            {
                transactions.map((t) => <div className="mb-4" key={t.forceGetDocName()}>
                        <p className="m-0">{new Date(t.dateTime).toISOString()}</p>
                        <textarea readOnly={true} style={{width: "100%", height: "320px"}}
                                  value={JSON.stringify(t, null, 4)}/>
                        <button onClick={() => {
                            deleteTransaction(t.forceGetDocName()).then(() => setUpdate(update + 1))
                        }}>Delete
                        </button>
                        <button onClick={() => {
                            if (auth.currentUser != null) {
                                t.dateTime = new Date(Date.now()).valueOf();
                                overwriteTransaction(auth.currentUser, t.forceGetDocName(), t).then(() => setUpdate(update + 1));
                            }
                        }}>Set Time To Now
                        </button>
                    </div>
                )}
        </>
    )
}
