import {LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip} from 'recharts';
import React from "react";

interface Props {
    data: Array<{ moneyIn: number; moneyOut: number; date: string}>;
    key: string;
}

const LineCht: React.FC<Props> = ({ data,key }) => {
    return (
        <div>
            <p>Money</p>
            <ResponsiveContainer width={"100%"} height={"100%"}>
                <LineChart data={data}>
                    <XAxis dataKey="date"/>
                    <YAxis/>
                    <Tooltip/>
                    <Line type="monotone" dataKey="moneyIn" stroke="#8884d8"/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
export default LineCht;
