import "./styles.css";
import "react-tiles-dnd/esm/index.css";
import { TilesContainer, RenderTileFunction } from "react-tiles-dnd";
import useWindowDimensions from "../../hooks/WindowDimensionsHook.tsx";
import {Link} from "react-router-dom";
import {Header} from "../../components/Header.tsx";
import {Sidebar} from "../../components/Sidebar.tsx";
import { Button } from "react-bootstrap";
import { CSVUpload } from "../../components/transactions/CSVUpload.tsx";
import { InputTransaction } from "../../components/transactions/InputTransaction.tsx";
import { useState } from "react";

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
    
    const [showCSVModal, setShowCSVModal] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);

    return <>
        <div className="vh-100 d-flex flex-column">
            <Header/> 

            {/* TODO: MOVE TO CORRECT POSITION ON DASHBOARD */}
            <div> 
                <Button variant="primary" onClick={() => setShowCSVModal(true)}>Upload CSV</Button>
                <CSVUpload show={showCSVModal} setShow={setShowCSVModal} />

                <Button variant="primary" onClick={() => setShowTransactionModal(true)}>Add Transaction</Button>
                <InputTransaction show={showTransactionModal} setShow={setShowTransactionModal} />
            </div>
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
                    />
                </div>
            </Sidebar>
        </div> 
    </>
}