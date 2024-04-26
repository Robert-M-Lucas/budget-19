import "./styles.css";
import "react-tiles-dnd/esm/index.css";
import { TilesContainer, RenderTileFunction } from "react-tiles-dnd";
import useWindowDimensions from "../../hooks/WindowDimensionsHook.tsx";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import React, {useEffect, useState} from "react";
import Papa from "papaparse";
import {Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import { getTransactionsFilterOrderBy, Transaction } from "../../utils/firestore.ts"
import {auth} from "../../utils/firebase.ts";
import {orderBy} from "firebase/firestore";
import {getCurrentBalance} from "../../utils/transaction_utils.ts";
import { User } from "firebase/auth";
import {FullscreenCenter} from "../../components/FullscreenCenter.tsx";

type dataPoint = { date: string; moneyIn: number; moneyOut: number };
type transactionPoint = { date: string; amount: number }

export default function GraphDashboard() {
    const [balance, setBalance] = useState(0);
    const [transactionPoints, setPoints] = useState<transactionPoint[][]>([[]]);
    const [authResolved, setAuthResolved] = useState(false);

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

    const transactionTiles = [
        {p: transactionPoints[0], cols:5, rows:2},
        {p: transactionPoints[1], cols:5, rows:2},
        {p: transactionPoints[2], cols:5, rows:2}
    ];

    const renderFirebase: RenderTileFunction<typeof transactionTiles[0]> = ({ data, isDragging }) => (
        <div style={{padding: ".75rem", width: "100%"}}>
            <div className={`tile card ${isDragging ? "dragging" : ""}`}
                 style={{width: "100%", height: "100%"}}>
                {/*<button onClick={() => {console.log(data.p)}}>Click me!</button>*/}
                <ResponsiveContainer width={"100%"} height={"100%"}>
                    <LineChart data={data.p}>
                        <XAxis dataKey="date"/>
                        <YAxis/>
                        <Tooltip/>
                        <Line type="monotone" dataKey="amount" stroke="#8884d8"/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

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

    return (
        <div className="vh-100 d-flex flex-column">
            <Header user="testUser"/>
            <Sidebar>
                <div className="App ps-5 pe-5 mt-3">
                    <h1>Testing Graph Tiles with Firebase</h1>
                    <button onClick={() => {console.log(transactionPoints)}}>Console Log Transactions</button>
                    {balance}
                    <TilesContainer
                        data={transactionTiles}
                        renderTile={renderFirebase}
                        tileSize={tileSize}
                        ratio={1}
                        columns={columns}
                    ></TilesContainer>
                </div>
            </Sidebar>
        </div>
    );
}