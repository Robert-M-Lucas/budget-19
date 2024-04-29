import {Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {Transaction} from "../../../utils/transaction.ts";
import strftime from "strftime";
import {round} from "lodash";

export default function incomeGraphTile(transactions: Transaction[]) {
    const data: {
        date: string,
        amount: number,
    }[] = [];

    let currentIncome = 0;

    if (transactions.length == 0) {
        return <p>No Data</p>;
    }

    const revTransactions = transactions.slice().reverse();

    let currentDate = revTransactions[0].dateTime;

    for (const transaction of revTransactions) {
        const transDate = strftime("%d/%m/%y", new Date(transaction.dateTime));

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const date = strftime("%d/%m/%y", new Date(currentDate));
            if (date === transDate) {
                break;
            }
            if (date === data[data.length - 1].date) {
                currentDate += 8.64e7;
                continue;
            }
            data.push(
                {
                    date: date,
                    amount: round(currentIncome, 2),
                }
            )
            currentDate += 8.64e7;
        }

        if (transaction.amount > 0) {
            currentIncome += transaction.amount;
        }

        const val = {
            date: transDate,
            amount: round(currentIncome, 2),
        };

        if (data.length > 0 && data[data.length - 1].date === transDate) {
            data[data.length - 1] = val;
        }
        else {
            data.push(val)
        }
    }

    return <>
        <p>Income</p>
        <ResponsiveContainer width={"100%"} height={"100%"}>
            <LineChart data={data} margin={{top: 0, left: 0, right: 25, bottom: 0}}>
                <XAxis dataKey="date"/>
                <YAxis/>
                <Tooltip/>
                <Line type="monotone" dataKey="amount" stroke="green" dot={false}/>
            </LineChart>
        </ResponsiveContainer>
    </>;
}