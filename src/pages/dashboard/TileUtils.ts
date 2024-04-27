import {ReactNode} from "react";
import {transactionPoint} from "./GraphUtils.ts";

type tsxContents = ReactNode;

export class TileElement {
    private readonly graph?: transactionPoint[];
    private readonly TSX?: () => tsxContents;

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