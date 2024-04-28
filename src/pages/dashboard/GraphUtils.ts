import {Transaction} from "../../utils/transaction.ts";
import strftime from "strftime";

export type transactionPoint = { date: string; amount: number; goal: number }
export type graphData = {points: transactionPoint[][], title: string}
export type finalGraphData = {raw: graphData, in: graphData, out: graphData};

const splitCumulateByMonth = (points: transactionPoint[]): transactionPoint[][] => {
    const result: transactionPoint[][] = [];
    let currMonth: string = "";
    let currArr: transactionPoint[] = [];

    // Split
    points.forEach( p => {
        const [day,month, year] = p.date.split('/').map(Number);
        const dateKey = `${month}/${year}`;

        if (dateKey !== currMonth) {
            if (currArr.length) {
                result.push(currArr);
            }
            currMonth = dateKey;
            currArr = [];
        }
        currArr.push(p)
    });
    if (result.length) {
        result.push(currArr);
    }

    // Cumulate
    result.forEach(month => { cumulateTransactions(month) })
    return result;
}

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

    return {raw: {points: splitCumulateByMonth(data), title: "Raw"},
            in: {points: splitCumulateByMonth(moneyIn), title: "Income"},
            out: {points: splitCumulateByMonth(moneyOut), title: "Expenses"}};
}

export function readTransactions(data: Transaction[]): finalGraphData {
    return splitTransactions(
        data.map((t) => {
            return {date: getDateString(t.dateTime), amount: t.amount, goal: 800};
        })
    );
}