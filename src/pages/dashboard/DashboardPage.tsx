import "./styles.css";
import "react-tiles-dnd/esm/index.css";
import useWindowDimensions from "../../hooks/WindowDimensionsHook.tsx";
import {Header} from "../../components/Header.tsx";
import {useEffect, useState} from "react";
import {Transaction, getTransactionsFilterOrderBy } from "../../utils/transaction.ts"
import {auth} from "../../utils/firebase.ts";
import {orderBy} from "firebase/firestore";
import {FullscreenCenter} from "../../components/FullscreenCenter.tsx";
import Graphs from "./graphs/Graphs.tsx"
import {getTileSize, TileElement} from "./TileUtils.ts";
import {finalGraphData, readTransactions} from "./graphs/GraphUtils.ts";
import {signInWithGoogle} from "../../utils/authentication.ts";
import totalTile from "./total tile/TotalTile.tsx";
import {getUserPrefs, UserPrefs} from "../../utils/user_prefs.ts";
import {User} from "firebase/auth";
import goalSettingTile from "./goal setting tile/GoalSettingTile.tsx";
import {RenderTileFunction, TilesContainer} from "react-tiles-dnd";
import goalTracking from "./goal tracking tile/GoalTrackingTile.tsx";
import motivationTile from "./motivation tile/MotivationTile.tsx";
import AddTransactionTile from "./add transaction tile/AddTransactionTile.tsx";

export default function Dashboard() {
    // const [balance, setBalance] = useState(0);
    const [transactionPoints, setPoints] = useState<finalGraphData | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [authResolved, setAuthResolved] = useState(false);
    const [userPrefs, setUserPrefs] = useState<UserPrefs | null>(null);
    // const draggable = useRef(true);
    // const [showCSVModal, setShowCSVModal] = useState(false);
    // const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [update, setUpdate] = useState(0)

    const forceUpdatePrefs = () => {
        setUpdate(update + 1);
        setUserPrefs(null);
    };

    const forceUpdateTransactions = () => {
        setUpdate(update + 1);
        setPoints(null);
        setTransactions([]);
    };

    const fetchTransactions = async (user: User) => {
        const transactions = await getTransactionsFilterOrderBy(user, orderBy("dateTime", "desc"));
        setTransactions(transactions);
        setPoints(readTransactions(transactions));
    }

    const {width} = useWindowDimensions();
    const columns = Math.max(Math.floor(width / 180), 1);

    // Transaction Loading and Handling
    useEffect(() => {
        if (auth.currentUser !== null) {
            if (transactionPoints === null) {
                fetchTransactions(auth.currentUser).then();
            }
            if (userPrefs === null) {
                getUserPrefs(auth.currentUser).then((prefs) => setUserPrefs(prefs));
            }
        }
        // eslint-disable-next-line
    },[update]);

    if (!authResolved) {
        auth.authStateReady().then(() => setAuthResolved(true));
        return <>
            <Header/>
            <FullscreenCenter>
                <div className="text-center">
                    <h1>Waiting for Authentication</h1>
                </div>
            </FullscreenCenter>
        </>;
    }

    if (auth.currentUser === null) {
        auth.onAuthStateChanged(() => {
            setUpdate(update + 1);
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

    if (!transactionPoints || !userPrefs) {
        return <>
            <Header/>
            <FullscreenCenter>
                <div className="text-center">
                    <h1>Fetching {transactionPoints ? "" : "transactions"}{!transactionPoints && !userPrefs ? "," : ""} {userPrefs ? "" : "goals"}</h1>
                </div>
            </FullscreenCenter>
        </>;
    }

    const transactionTiles: TileElement[] = [
        TileElement.newTSX(() => totalTile(transactions), 2, 1, columns),
        TileElement.newTSX(() => (goalSettingTile(userPrefs, forceUpdatePrefs)), 2, 2, columns),
        TileElement.newTSX(() => goalTracking(transactions, userPrefs), 3, 1, columns),
        TileElement.newTSX(() => motivationTile(transactions, userPrefs), 1, 1, columns),
        TileElement.newTSX(() => AddTransactionTile(forceUpdateTransactions), 1, 1, columns),
        TileElement.newGraph(transactionPoints.raw, 3, 2, columns),
        TileElement.newGraph(transactionPoints.in, 3, 2, columns),
        TileElement.newGraph(transactionPoints.out, 3, 2, columns),
    ];

    const renderTile: RenderTileFunction<TileElement> = ({ data, isDragging }) => (
        <div style={{padding: ".75rem", width: "100%"}}>
            <div className={`tile card ${isDragging ? "dragging" : ""}`}
                 style={{width: "100%", height: "100%"}}>
                {data.isGraph() ? <Graphs data={data.forceGetGraph()}/> : data.forceGetTSX()()}
            </div>
        </div>
    );

    return (
        <div className="vh-100 d-flex flex-column">
            <Header/>
            <div className="App ps-5 pe-5 mt-3">
                <TilesContainer
                    data={transactionTiles}
                    renderTile={renderTile}
                    tileSize={getTileSize}
                    ratio={1}
                    columns={columns}
                ></TilesContainer>
            </div>
        </div>
    );
}