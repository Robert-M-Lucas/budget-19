import "./styles.css";
import "react-tiles-dnd/esm/index.css";
import { TilesContainer, RenderTileFunction } from "react-tiles-dnd";
import useWindowDimensions from "../../hooks/WindowDimensionsHook.tsx";
import {Header} from "../../components/Header.tsx";
import React, {ReactNode, useEffect, useState} from "react";
import { getTransactionsFilterOrderBy, Transaction } from "../../utils/transaction.ts"
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
    const [authResolved, setAuthResolved] = useState(false);
    const [showCSVModal, setShowCSVModal] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);

    const tileSize = (tile: typeof transactionTiles[0]) => ({
        colSpan: tile.cols,
        rowSpan: tile.rows
    });
    const cumulateTransactions = (points: transactionPoint[]): transactionPoint[] => {
        let total = 0;
        return points.map(value => {
            total += value.amount;
            return {date: value.date, amount: total};
        })
    }
    const getDateString = (timestamp: number): string => {
        const date = new Date(timestamp)
        const day = date.getDate().toString().padStart(2, '0'); // Ensures two digits
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed, add 1
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    const splitTransactions = (data: transactionPoint[]): void => {
        const moneyIn: transactionPoint[] = []
        const moneyOut: transactionPoint[] = []
        data.forEach(t => {
            if (t.amount > 0) {
                moneyIn.push(t)
            } else {
                moneyOut.push(t)
            }
        })
        setPoints([cumulateTransactions(data), cumulateTransactions(moneyIn), cumulateTransactions(moneyOut)])
        console.log(transactionPoints)
    }
    const readTransactions = (data: Transaction[]): void => {
        const result: transactionPoint[] = []
        data.forEach(t => {
            result.push({amount: t.amount, date: getDateString(t.dateTime)})
        })
        splitTransactions(result)
    }
    const fetchTransactions = async (user: User) => {
        try {
            const transactions = await getTransactionsFilterOrderBy(user, orderBy("dateTime", "desc"))
            readTransactions(transactions)
        } catch (error) {}
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
                {console.log(data.d)}
                {data.d.isGraph() ? <Graphs data={data.d.forceGetGraph()}/> : data.d.forceGetTSX()()}
            </div>
        </div>
    );

    return (
        <div className="vh-100 d-flex flex-column">
            <Header user="testUser"/>
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