import {FullscreenCenter} from "../../components/FullscreenCenter.tsx";
import {auth} from "../../utils/firebase.ts";
import {useState} from "react";
import {
    deleteTransaction,
    getTransactionsFilterOrderBy,
    overwriteTransaction,
    Transaction,
    writeNewTransaction
} from "../../utils/firestore.ts";
import {faker, fakerEN_GB} from "@faker-js/faker";
import {getCurrentBalance} from "../../utils/transaction_utils.ts";
import {signInWithGoogle} from "../../utils/authentication.ts";
import {Header} from "../../components/Header.tsx";
import { orderBy } from "firebase/firestore";

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

    return (
        <>
            <Header/>
            <div className="text-center">
                <h1>Logged In - {auth.currentUser.uid} - {auth.currentUser.displayName}</h1>
                <button type="button" className="login-with-google-btn" onClick={signInWithGoogle}>
                    Sign in with Google
                </button>
            </div>
            <button onClick={() => {
                writeSampleData();
                setUpdate(update + 1);
            }}>Add Sample Transaction
            </button>
            <p>
                Balance: {balance}
            </p>
            <p>
                Transactions: <br/>
            </p>
            {
                transactions.map((t) => <div className="mb-4" key={t.forceGetDocName()}>
                    <p className="m-0">{new Date(t.dateTime).toISOString()}</p>
                    <textarea readOnly={true} style={{width: "100%", height: "320px"}} value={JSON.stringify(t, null, 4)}/>
                    <button onClick={() => {deleteTransaction(t.forceGetDocName()).then(() => setUpdate(update + 1))}}>Delete</button>
                    <button onClick={() => {
                        if (auth.currentUser != null) {
                            t.dateTime = new Date(Date.now()).valueOf();
                            overwriteTransaction(auth.currentUser, t.forceGetDocName(), t).then(() => setUpdate(update + 1));
                        }
                    }}>Set Time To Now</button>
                </div>
            )}
        </>
    )
}
