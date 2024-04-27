import {ReactNode} from "react";
import { Transaction } from "../../utils/transaction";

export default function totalTile(transactions: Transaction[]): ReactNode {
    return <>
        <p>Total: {transactions.reduce((prev, curr): number => prev + curr.amount, 0).toFixed(2)}</p>
    </>;
}