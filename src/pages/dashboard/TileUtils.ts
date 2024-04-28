import {ReactNode} from "react";
import {graphData} from "./GraphUtils.ts";
import {min} from "lodash";

type tsxContents = ReactNode;

export class TileElement {
    private readonly graph?: graphData;
    private readonly TSX?: () => tsxContents;
    public readonly cols: number;
    public readonly rows: number;

    private constructor(graph: graphData | undefined, TSX: (() => tsxContents) | undefined, cols: number, rows: number) {
        this.graph = graph;
        this.TSX = TSX;
        this.cols = cols;
        this.rows = rows;
    }

    static newGraph(graph: graphData, cols: number, rows: number, maxCol: number): TileElement {
        return new TileElement(graph, undefined, min([cols, maxCol])!, rows);
    }
    static newTSX(TSX: () => tsxContents, cols: number, rows: number, maxCol: number): TileElement {
        return new TileElement(undefined, TSX, min([cols, maxCol])!, rows);
    }

    isGraph(): boolean {
        return typeof this.graph !== "undefined";
    }

    forceGetGraph(): graphData {
        return this.graph!;
    }
    forceGetTSX(): () => tsxContents {
        return this.TSX!;
    }
}

export type tileData = { d: TileElement; rows: number; cols: number };

export function getTileSize (tile: TileElement)  {
    return {colSpan: tile.cols, rowSpan: tile.rows};
}