import "./styles.css";
import "react-tiles-dnd/esm/index.css";
import { TilesContainer, RenderTileFunction } from "react-tiles-dnd";
import useWindowDimensions from "../../hooks/WindowDimensionsHook.tsx";
import {Link} from "react-router-dom";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

// ? Lot of code obtained from here for testing: https://codesandbox.io/p/sandbox/react-tiles-dnd-responsive-bd0ly?file=%2Fsrc%2Findex.tsx

interface Props {
    tiles: Array<{ text: string; rows: number; cols: number }>
}

const data2 = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];
const render: RenderTileFunction<{ text: string; rows: number; cols: number }> = ({ data, isDragging }) => (
    <div style={{ padding: ".75rem", width: "100%" }}>
        <div className={`tile card ${isDragging ? "dragging" : ""}`}
                style={{ width: "100%", height: "100%" }}>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={500}
                    height={300}
                    data={data2}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>

        </div>
    </div>
);
const tileSize = (tile: { text: string; rows: number; cols: number }) => ({
    colSpan: tile.cols,
    rowSpan: tile.rows
});

export default function Dashboard(props: Props) {
    const {width} = useWindowDimensions();
    const columns = Math.max(Math.floor(width / 200), 1);
    return <>
        <div className="vh-100 d-flex flex-column">
            <Header user="testUser"/>
            <Sidebar>
                <div className="App ps-5 pe-5 mt-3">
                    <h1>Testing Tiles</h1>
                    <p><Link to={"/"}>Go back</Link></p>
                    <TilesContainer
                        data={props.tiles}
                        renderTile={render}
                        tileSize={tileSize}
                        ratio={1}
                        columns={columns}
                    ></TilesContainer>
                </div>
            </Sidebar>
        </div>
    </>
}