import "./styles.css";
import "react-tiles-dnd/esm/index.css";
import { TilesContainer, RenderTileFunction } from "react-tiles-dnd";
import useWindowDimensions from "../../hooks/WindowDimensionsHook.tsx";
import {Header} from "../../components/Header.tsx";
import {useEffect, useState} from "react";
import { getTransactionsFilterOrderBy } from "../../utils/transaction.ts"
import {auth} from "../../utils/firebase.ts";
import {orderBy} from "firebase/firestore";
import {getCurrentBalance} from "../../utils/transaction_utils.ts";
import { User } from "firebase/auth";
import {FullscreenCenter} from "../../components/FullscreenCenter.tsx";
import {Button} from "react-bootstrap";
import {CSVUpload} from "../../components/transactions/CSVUpload.tsx";
import {InputTransaction} from "../../components/transactions/InputTransaction.tsx";
import Graphs from "./Graphs.tsx"
import test from "./test.tsx"
import {TileElement } from "./TileUtils.ts";
import {finalGraphData, readTransactions} from "./GraphUtils.ts";

export default function Dashboard() {
    const [balance, setBalance] = useState(0);
    const [transactionPoints, setPoints] = useState<finalGraphData | null>(null);
    const [authResolved, setAuthResolved] = useState(false);
    const [showCSVModal, setShowCSVModal] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);

    const tileSize = (tile: typeof transactionTiles[0]) => ({
        colSpan: tile.cols,
        rowSpan: tile.rows
    });

    const fetchTransactions = async (user: User) => {
        const transactions = await getTransactionsFilterOrderBy(user, orderBy("dateTime", "desc"))
        setPoints(readTransactions(transactions));
    }

    const {width} = useWindowDimensions();
    const columns = Math.max(Math.floor(width / 200), 1);

    // Transaction Loading and Handling
    useEffect(() => {
        if (auth.currentUser !== null) {
            getCurrentBalance(auth.currentUser).then((b) => setBalance(b));
            fetchTransactions(auth.currentUser).then(() => console.log("Fetched Transactions", transactionPoints));
        }
    },[auth.currentUser])


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

    if (!transactionPoints) {
        return <>
            <FullscreenCenter>
                <div className="text-center">
                    <h1>Fetching</h1>
                </div>
            </FullscreenCenter>
        </>;
    }

    const transactionTiles = [
        {d: TileElement.newGraph(transactionPoints.raw), cols:5, rows:2},
        {d: TileElement.newGraph(transactionPoints.in), cols:5, rows:2},
        {d: TileElement.newGraph(transactionPoints.out), cols:5, rows:2},
        {d: TileElement.newTSX(test), cols:1, rows:1}
    ];

    const renderFirebase: RenderTileFunction<typeof transactionTiles[0]> = ({ data, isDragging }) => (
        <div style={{padding: ".75rem", width: "100%"}}>
            <div className={`tile card ${isDragging ? "dragging" : ""}`}
                 style={{width: "100%", height: "100%"}}>
                {data.d.isGraph() ? <Graphs data={data.d.forceGetGraph()}/> : data.d.forceGetTSX()()}
            </div>
        </div>
    );

    return (
        <div className="vh-100 d-flex flex-column">
            <Header/>
            <div>
                <Button variant="primary" onClick={() => setShowCSVModal(true)}>Upload CSV</Button>
                <CSVUpload show={showCSVModal} setShow={setShowCSVModal}/>

                <Button variant="primary" onClick={() => setShowTransactionModal(true)}>Add Transaction</Button>
                <InputTransaction show={showTransactionModal} setShow={setShowTransactionModal}/>
            </div>
            <div className="App ps-5 pe-5 mt-3">
                <button onClick={() => {
                    console.log(transactionPoints)
                }}>Console Log Transactions
                </button>
                {balance}
                <TilesContainer
                    data={transactionTiles}
                    renderTile={renderFirebase}
                    tileSize={tileSize}
                    ratio={1}
                    columns={columns}
                ></TilesContainer>
            </div>
        </div>
    );
}