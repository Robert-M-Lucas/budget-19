import "./styles.css";
import "react-tiles-dnd/esm/index.css";
import { TilesContainer, RenderTileFunction } from "react-tiles-dnd";
import useWindowDimensions from "../../hooks/WindowHooks.tsx";
import {Link} from "react-router-dom";
import {Footer} from "../../components/Footer.tsx";

// ? Lot of code obtained from here for testing: https://codesandbox.io/p/sandbox/react-tiles-dnd-responsive-bd0ly?file=%2Fsrc%2Findex.tsx

interface Props {
    tiles: Array<{ text: string; rows: number; cols: number }>
}

const render: RenderTileFunction<{ text: string; rows: number; cols: number }> = ({ data, isDragging }) => (
    <div style={{ padding: ".75rem", width: "100%" }}>
        <div className={`tile card ${isDragging ? "dragging" : ""}`}
             style={{ width: "100%", height: "100%" }} >
            {data.text} {isDragging ? "DRAGGING" : null}
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
        <div className="App ps-5 pe-5">
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
        <Footer/>
    </>;
}