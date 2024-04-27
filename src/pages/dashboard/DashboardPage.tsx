import "./styles.css";
import "react-tiles-dnd/esm/index.css";
import { TilesContainer, RenderTileFunction } from "react-tiles-dnd";
import useWindowDimensions from "../../hooks/WindowDimensionsHook.tsx";
import {Header} from "../../components/Header.tsx";
import {useEffect, useState} from "react";
import {Transaction, getTransactionsFilterOrderBy } from "../../utils/transaction.ts"
import {auth} from "../../utils/firebase.ts";
import {orderBy} from "firebase/firestore";
import { User } from "firebase/auth";
import {FullscreenCenter} from "../../components/FullscreenCenter.tsx";
import Graphs from "./Graphs.tsx"
import {getTileSize, TileElement} from "./TileUtils.ts";
import {finalGraphData, readTransactions} from "./GraphUtils.ts";
import {signInWithGoogle} from "../../utils/authentication.ts";
import totalTile from "./Tiles.tsx";

export default function Dashboard() {
    // const [balance, setBalance] = useState(0);
    const [transactionPoints, setPoints] = useState<finalGraphData | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [authResolved, setAuthResolved] = useState(false);
    // const [showCSVModal, setShowCSVModal] = useState(false);
    // const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [update, setUpdate] = useState(0)

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
            fetchTransactions(auth.currentUser).then();
        }
    },[auth.currentUser])

    if (!authResolved) {
        auth.authStateReady().then(() => setAuthResolved(true));
        return <>
            <Header/>
            <FullscreenCenter>
                <div className="text-center">
                    <h1>Waiting for Auth</h1>
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

    if (!transactionPoints) {
        return <>
            <Header/>
            <FullscreenCenter>
                <div className="text-center">
                    <h1>Fetching</h1>
                </div>
            </FullscreenCenter>
        </>;
    }

    const transactionTiles: TileElement[] = [
        TileElement.newTSX(() => totalTile(transactions), 2, 1, columns),
        TileElement.newGraph(transactionPoints.raw, 3, 2, columns),
        TileElement.newGraph(transactionPoints.in, 3, 2, columns),
        TileElement.newGraph(transactionPoints.out, 3, 2, columns),
    ];

    const renderTile: RenderTileFunction<typeof transactionTiles[0]> = ({ data, isDragging }) => (
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
            {/*<div>*/}
            {/*    <Button variant="primary" onClick={() => setShowCSVModal(true)}>Upload CSV</Button>*/}
            {/*    <CSVUpload show={showCSVModal} setShow={setShowCSVModal}/>*/}

            {/*    <Button variant="primary" onClick={() => setShowTransactionModal(true)}>Add Transaction</Button>*/}
            {/*    <InputTransaction show={showTransactionModal} setShow={setShowTransactionModal}/>*/}
            {/*</div>*/}
            <div className="App ps-5 pe-5 mt-3">
                {/*<button onClick={() => {*/}
                {/*    console.log(transactionPoints)*/}
                {/*}}>Console Log Transactions*/}
                {/*</button>*/}
                {/*{balance}*/}
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