import {Transaction} from "../../utils/transaction.ts";
import strftime from "strftime";

export type transactionPoint = { date: string; amount: number; goal: number }
export type graphData = {points: transactionPoint[][], title: string}
export type finalGraphData = {raw: graphData, in: graphData, out: graphData};

const splitByMonth = (points: transactionPoint[]): transactionPoint[][] => {
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
    // // Cumulate
    // if (doCumulate) { result.forEach(month => { cumulateTransactions(month) }); console.log("DO CUMULATE",result); return result;}
    // console.log("DONOT CUMULATE",result)
    return result;
}

function cumulateTransactions(points: transactionPoint[][]): transactionPoint[][] {
    points.map(month => {
        let total = 0;
        return month.map(t => {
            total += t.amount;
            return {
                date: t.date,
                amount: total,
                goal: t.goal
            };
        })
    })
    return points
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
    // Splitting the points
    const splitedData: transactionPoint[][][] = [splitByMonth(data), splitByMonth(moneyIn), splitByMonth(moneyOut)]
    const cumulatedSData: transactionPoint[][][] = [cumulateTransactions(splitedData[0]),
                                                    cumulateTransactions(splitedData[1]),
                                                    cumulateTransactions(splitedData[2])
                                                ]
    console.log(splitedData)
    console.log(cumulatedSData)
    return {raw: {points: cumulatedSData[0], title: "Balance"},
            in: {points: cumulatedSData[1], title: "Income"},
            out: {points: cumulatedSData[2], title: "Expenses"}};
}

export function readTransactions(data: Transaction[]): finalGraphData {
    return splitTransactions(
        data.map((t) => {
            return {date: getDateString(t.dateTime), amount: t.amount, goal: 800};
        })
    );
}