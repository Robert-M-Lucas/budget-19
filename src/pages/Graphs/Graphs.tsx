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
    const [data, setData] = useState<dataPoint[][]>([[]]);
    const [index, setIndex] = useState(0);
    const dataKeys = ["moneyIn", "moneyOut", "sum"];
    const [balance, setBalance] = useState(0);
    const [transactionPoints, setPoints] = useState<transactionPoint[][]>([[]]);

    const tiles = [
        {d: data[0], cols: 3, rows: 2},
        {d: data[1], cols: 3, rows: 2},
        {d: data[2], cols: 2, rows: 2}
    ];

    const tileSize = (tile: typeof tiles[0]) => ({
        colSpan: tile.cols,
        rowSpan: tile.rows
    });
    const render: RenderTileFunction<typeof tiles[0]> = ({data, isDragging}) => (
        <div style={{padding: ".75rem", width: "100%"}}>
            <div className={`tile card ${isDragging ? "dragging" : ""}`}
                 style={{width: "100%", height: "100%"}}>
                <ResponsiveContainer width={"100%"} height={"100%"}>
                    <LineChart data={data.d}>
                        <XAxis dataKey="date"/>
                        <YAxis/>
                        <Tooltip/>
                        <Line type="monotone" dataKey={dataKeys[index]} stroke="#8884d8"/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    const cumulate = (data: number[]): number[] => {
        let total = 0;
        return data.map(value => {
            total += value;
            return total;
        });
    }
    const splitByMonth = (data: dataPoint[]) => {
        const result: dataPoint[][] = [];
        let currMonth: string = "";
        let currArr: dataPoint[] = [];

        data.forEach((item: dataPoint) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [_day, month, year] = item.date.split('/').map(Number);
            const dateKey = `${month}/${year}`;

            console.log(dateKey);
            if (dateKey !== currMonth) {
                if (currArr.length) {
                    console.log("Push");
                    result.push(currArr);
                }
                currMonth = dateKey;
                currArr = [];
            }
            currArr.push(item)
        });

        if (currArr.length) {
            result.push(currArr);
        }
        return result;
    }
    const finalParsing = (data: dataPoint[]): dataPoint[][] => {
        const result: dataPoint[][] = [];
        const data_split = splitByMonth(data);

        data_split.forEach(arr => {
            const moneyInData = arr.map(item => item.moneyIn);
            const moneyOutData = arr.map(item => item.moneyOut);

            const cumulativeMoneyIn = cumulate(moneyInData);
            const cumulativeMoneyOut = cumulate(moneyOutData);

            const updatedData = arr.map((item, index) => ({
                ...item,
                moneyIn: cumulativeMoneyIn[index],
                moneyOut: cumulativeMoneyOut[index],
                sum: cumulativeMoneyIn[index] + cumulativeMoneyOut[index]
            }));

            result.push(updatedData);
        });

        return (result);
    }

    const getDateString = (timestamp: number): string => {
        const date = new Date(timestamp)
        const day = date.getDate().toString().padStart(2, '0'); // Ensures two digits
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed, add 1
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    const splitTransactions = (data: transactionPoint[]): void => {
        let moneyIn: transactionPoint[] = []
        let moneyOut: transactionPoint[] = []
        data.forEach(t => {
            if (t.amount > 0) {
                moneyIn.push(t)
            } else {
                moneyOut.push(t)
            }
        })
        setPoints([data, moneyIn, moneyOut])
        console.log(transactionPoints)
    }
    const readTransactions = (data: Transaction[]): void => {
        let result: transactionPoint[] = []
        data.forEach(t => {
            result.push({amount: t.getAmount(), date: getDateString(t.getDateTime())})
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
        {p: transactionPoints[0], cols:3, rows:2},
        {p: transactionPoints[1], cols:3, rows:2},
        {p: transactionPoints[2], cols:3, rows:2}
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const file = e.target.files[0];
        if (file) {
            Papa.parse(file, {
                complete: (results) => {
                    const parsedData: dataPoint[] = results.data.map((row) => ({
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        moneyIn: row['Money In'] ? parseFloat(row['Money In']) : 0,
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        moneyOut: row['Money Out'] ? parseFloat(row['Money Out']) : 0,
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        date: String(row['Date'])
                    }));
                    setData(finalParsing(parsedData));
                },
                header: true,
                skipEmptyLines: true,
            });
        }
    };
    const handleIndexChange = () => {
        setIndex((index + 1) % 3)
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

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (!user) {
                console.log("User is not logged in");
                return <>
                    <FullscreenCenter>
                        <div className="text-center">
                            <h1>Waiting for Auth</h1>
                        </div>
                    </FullscreenCenter>
                </>;
            }
        });
    }, []);

    return (
        <div className="vh-100 d-flex flex-column">
            <Header user="testUser"/>
            <Sidebar>
                <div className="App ps-5 pe-5 mt-3">
                    <h1>Testing Graph Tiles</h1>
                    <input type="file" accept=".csv" onChange={handleFileChange}/>
                    <button onClick={handleIndexChange}>Click to Change Type</button>
                    <h1>{dataKeys[index]}</h1>
                    <TilesContainer
                        data={tiles}
                        renderTile={render}
                        tileSize={tileSize}
                        ratio={1}
                        columns={columns}
                    ></TilesContainer>
                </div>
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