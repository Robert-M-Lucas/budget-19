import {Line, LineChart, ResponsiveContainer, XAxis, YAxis} from "recharts";

type transactionPoint = { date: string; amount: number; goal: number }

interface Props {
    data: transactionPoint[];
}

export default function Graphs({data}: Props) {
    return (
        <ResponsiveContainer width={"100%"} height={"100%"}>
            <LineChart data={data}>
                <XAxis dataKey="date"/>
                <YAxis/>
                <Line type="monotone" dataKey="amount" stroke="#8884d8"/>
                <Line type="monotone" dataKey="goal" stroke="#000000"/>
            </LineChart>
        </ResponsiveContainer>
    );
}