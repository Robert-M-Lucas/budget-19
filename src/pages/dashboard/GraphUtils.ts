import {Transaction} from "../../utils/transaction.ts";
import strftime from "strftime";

export type transactionPoint = { date: string; amount: number }
export type finalGraphData = {raw: transactionPoint[], in: transactionPoint[], out: transactionPoint[]};

function cumulateTransactions(points: transactionPoint[]): transactionPoint[] {
    let total = 0;
    return points.map(value => {
        total += value.amount;
        value.amount = total;
        return value;
    })
}

function getDateString(timestamp: number): string  {
    return strftime("%d/%m/%y", new Date(timestamp))
}

function splitTransactions (data: transactionPoint[]): finalGraphData {
    const moneyIn: transactionPoint[] = []
    const moneyOut: transactionPoint[] = []
    data.forEach(t => {
        if (t.amount > 0) {
            moneyIn.push(t)
        } else {
            moneyOut.push(t)
        }
    })
    return {raw: cumulateTransactions(data), in: cumulateTransactions(moneyIn), out: cumulateTransactions(moneyOut)};
}

export function readTransactions(data: Transaction[]): finalGraphData {
    return splitTransactions(
        data.map((t) => {
            return {date: getDateString(t.dateTime), amount: t.amount}
        })
    );
}