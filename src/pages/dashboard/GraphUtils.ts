import {Transaction} from "../../utils/transaction.ts";

type transactionPoint = { date: string; amount: number; goal: number }

export const cumulateTransactions = (points: transactionPoint[]): transactionPoint[] => {
    let total = 0;
    return points.map(value => {
        total += value.amount;
        return {date: value.date, amount: total, goal: value.goal};
    })
}
const getDateString = (timestamp: number): string => {
    const date = new Date(timestamp)
    const day = date.getDate().toString().padStart(2, '0'); // Ensures two digits
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed, add 1
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
export const readTransactions = async (data: Transaction[], goal: number): Promise<transactionPoint[][]> => {
    const result: transactionPoint[] = []
    data.forEach(t => {
        result.push({amount: t.amount, date: getDateString(t.dateTime), goal: 0})
    })
    // Change the last bit of data to set the goal
    const lastElem = result[result.length - 1]
    result[result.length - 1] = {amount: lastElem.amount, date: lastElem.date, goal: goal}

    return splitTransactions(result)
}
export const splitTransactions = (data: transactionPoint[]): transactionPoint[][] => {
    const moneyIn: transactionPoint[] = []
    const moneyOut: transactionPoint[] = []
    data.forEach(t => {
        if (t.amount > 0) {
            moneyIn.push(t)
        } else {
            moneyOut.push(t)
        }
    })
    return ([cumulateTransactions(data), cumulateTransactions(moneyIn), cumulateTransactions(moneyOut)])
}