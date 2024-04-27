import {Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {transactionPoint} from "./GraphUtils.ts";

interface Props {
    data: transactionPoint[];
}

export default function Graphs({data}: Props) {
    return (
        <ResponsiveContainer width={"100%"} height={"100%"}>
            <LineChart data={data}>
                <XAxis dataKey="date"/>
                <YAxis/>
                <Tooltip/>
                <Line type="monotone" dataKey="amount" stroke="#8884d8"/>
            </LineChart>
        </ResponsiveContainer>
    );
}