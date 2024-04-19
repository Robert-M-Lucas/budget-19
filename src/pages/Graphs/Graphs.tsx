import "./styles.css";
import "react-tiles-dnd/esm/index.css";
import { TilesContainer, RenderTileFunction } from "react-tiles-dnd";
import useWindowDimensions from "../../hooks/WindowDimensionsHook.tsx";
import {Link} from "react-router-dom";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import React, {useState} from "react";
import Papa from "papaparse";
import {Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

export default function Dashboard(){

    const [data, setData] = useState([[]]);
    const [index, setIndex] = useState(0);
    const dataKeys = ["moneyIn", "moneyOut", "sum"];

    const tiles = [
        {d: data[0], cols:3, rows: 1},
        {d: data[1], cols:3, rows: 1},
        {d: data[2], cols:3, rows: 1}
    ];
    const tileSize = (tile: typeof tiles[0]) => ({
        colSpan: tile.cols,
        rowSpan: tile.rows
    });
    const render: RenderTileFunction<typeof tiles[0]> = ({ data }) => (
        <div style={{ padding: ".75rem", width: "100%" }}>
            <div className={`tile card : ""}`} style={{ width: "100%", height: "100%" }}>
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

    const cumulate = (data) => {
        let total = 0;
        return data.map(value => {
            total += value;
            return total;
        });
    }
    const splitByMonth = (data) => {
        const result = [];
        let currMonth = null;
        let currArr = [];

        data.forEach( item => {
            const [day, month, year] = item.date.split('/').map(Number);
            const dateKey = `${month}/${year}`;

            if (dateKey !== currMonth) {
                if (currArr.length) {
                    result.push(currArr);
                }
                currMonth = dateKey;
                currArr = [];
            }
            currArr.push(item)
        });
        if (result.length) {
            result.push(currArr);
        }
        return result;
    }
    const finalParsing = (data) => {
        const result = [];
        data = splitByMonth(data)
        data.forEach( arr => {
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
        })
        return(result);
    }
    const handleFileChange = (e: Event) => {
        // @ts-ignore
        const file = e.target.files[0];
        if (file) {
            Papa.parse(file, {
                complete: (results) => {
                    const parsedData = results.data.map((row) => ({
                        moneyIn: row['Money In'] ? parseFloat(row['Money In']) : 0,
                        moneyOut: row['Money Out'] ? parseFloat(row['Money Out']) : 0,
                        date: String(row['Date'])
                    }));
                    setData(finalParsing(parsedData));
                },
                header: true,
                skipEmptyLines: true,
            });
        }
    };
    const handleIndexChange = (e) => {
        setIndex((index + 1) % 3)
    }

    const {width} = useWindowDimensions();
    const columns = Math.max(Math.floor(width / 400), 1);

    return (
        <div className="vh-100 d-flex flex-column">
            <Header user="testUser"/>
            <Sidebar>
                <div className="App ps-5 pe-5 mt-3">
                    <h1>Testing Graph Tiles</h1>
                    <input type="file" accept=".csv" onChange={handleFileChange}/>
                    <button onClick={handleIndexChange}>Click to Change Type</button>
                    <p><Link to={"/"}>Go back</Link></p>
                    <h1>{dataKeys[index]}</h1>
                    <TilesContainer
                        data={tiles}
                        renderTile={render}
                        tileSize={tileSize}
                        ratio={1}
                        columns={columns}
                    ></TilesContainer>
                </div>
                {/*<div>*/}
                {/*    <h2>Data:</h2>*/}
                {/*    <pre>{JSON.stringify(data, null, 2)}</pre>*/}
                {/*</div>*/}
            </Sidebar>
        </div>
    );
}