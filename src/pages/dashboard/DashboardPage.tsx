import "./styles.css";
import "react-tiles-dnd/esm/index.css";
import {TilesContainer, RenderTileFunction} from "react-tiles-dnd";
import useWindowDimensions from "../../hooks/WindowDimensionsHook.tsx";
import  {ReactNode, useEffect, useState} from "react";
import {Header} from "../../components/Header.tsx";
import {getTransactionsFilterOrderBy} from "../../utils/transaction.ts"
import {getCurrentBalance} from "../../utils/transaction_utils.ts";
import {getUserPrefs, UserPrefs} from "../../utils/user_prefs.ts";
import {readTransactions} from "./GraphUtils.ts";
import {auth} from "../../utils/firebase.ts";
import {orderBy} from "firebase/firestore";
import { User } from "firebase/auth";
import {FullscreenCenter} from "../../components/FullscreenCenter.tsx";
import {Button} from "react-bootstrap";
import {CSVUpload} from "../../components/transactions/CSVUpload.tsx";
import {InputTransaction} from "../../components/transactions/InputTransaction.tsx";
import Graphs from "./Graphs.tsx"
import test from "./test.tsx"

type transactionPoint = { date: string; amount: number }
type tsxContents = ReactNode;

class TileElement {
    private graph?: transactionPoint[];
    private TSX?: () => tsxContents;

    constructor(graph: transactionPoint[] | undefined, TSX: (() => tsxContents) | undefined) {
        this.graph = graph;
        this.TSX = TSX;
    }

    static newGraph(graph: transactionPoint[]): TileElement {
        return new TileElement(graph, undefined);
    }
    static newTSX(TSX: () => tsxContents): TileElement {
        return new TileElement(undefined, TSX);
    }

    isGraph(): boolean {
        return typeof this.graph !== "undefined";
    }

    forceGetGraph(): transactionPoint[] {
        return this.graph!;
    }
    forceGetTSX(): () => tsxContents {
        return this.TSX!;
    }
}

export default function Dashboard() {
    const [balance, setBalance] = useState(0);
    const [transactionPoints, setPoints] = useState<transactionPoint[][]>([[]]);
    const [userResolved, setUserResolved] = useState(false);
    const [authResolved, setAuthResolved] = useState(false);
    const [fetchResolved, setFetchResolved] = useState(false);
    const [showCSVModal, setShowCSVModal] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);

    const fetchTransactions = async (user: User, goal: number) => {
        try {
            const transactions = await getTransactionsFilterOrderBy(user, orderBy("dateTime", "asc"))
            console.log("Check 0", transactions)
            await readTransactions(transactions, goal).then((t) => {
                console.log("Check 1", t)
                setPoints(t)
            })
            setFetchResolved(true);
        } catch (error) { console.error("Error in fetchTransactions", error) }
    }
    const fetchUserPrefs = async (user: User): Promise<UserPrefs | undefined> => {
        try {
            const u = await getUserPrefs(user);
            setUserResolved(true);
            return u
        } catch (error) { console.error("Error in fetchUserPrefs", error) }
    }

    const {width} = useWindowDimensions();
    const columns = Math.max(Math.floor(width / 200), 1);

    // Transaction Loading and Handling
    useEffect(() => {
        if (auth.currentUser !== null) {
            getCurrentBalance(auth.currentUser).then((b) => setBalance(b));
            fetchUserPrefs(auth.currentUser).then((u) => {
                console.log("Fetched UserPrefs", u)
                if (u) {
                    fetchTransactions(auth.currentUser!, u!.goal).then(() => {
                        console.log("Fetched Transactions", transactionPoints)
                    });
                }
            })

        }
    },[auth.currentUser])

    // Forces user to wait till everything has loaded
    if (!authResolved) {
        auth.authStateReady().then(() => setAuthResolved(true));
        return <>
            <FullscreenCenter>
                <div className="text-center">
                    <h1>Waiting for Authentication</h1>
                </div>
            </FullscreenCenter>
        </>;
    }
    if (!userResolved) {
        return <>
            <FullscreenCenter>
                <div className="text-center">
                    <h1>Fetching User Data</h1>
                </div>
            </FullscreenCenter>
        </>;
    }
    if (!fetchResolved) {
        return <>
            <FullscreenCenter>
                <div className="text-center">
                    <h1>Fetching User Transactions</h1>
                </div>
            </FullscreenCenter>
        </>;
    }

    // Tiles
    const tileSize = (tile: typeof transactionTiles[0]) => ({
        colSpan: tile.cols,
        rowSpan: tile.rows
    });
    const transactionTiles = [
        {d: TileElement.newGraph(transactionPoints[0]), cols:5, rows:2},
        {d: TileElement.newGraph(transactionPoints[1]), cols:5, rows:2},
        {d: TileElement.newGraph(transactionPoints[2]), cols:5, rows:2},
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