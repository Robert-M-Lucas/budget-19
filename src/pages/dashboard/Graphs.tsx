import {Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {transactionPoint} from "./GraphUtils.ts";

interface Props {
    data: transactionPoint[];
}

const customDot = () => {
    return null;
};

export default function Graphs({data}: Props) {
    return (
        <ResponsiveContainer width={"100%"} height={"100%"}>
            <LineChart data={data}
                       margin={{ top: 30, right: 50, left: 20, bottom: 5 }}
            >
                <XAxis dataKey="date"/>
                <YAxis/>
                <Tooltip/>
                <Line type="monotone" dataKey="amount" stroke="#8884d8" dot={<customDot/>}/>
                {/*<Line type="monotone" dataKey="goal" stroke="#000000" dot={<customDot/>}/>*/}
                <ReferenceLine label="Goal"
                               stroke="black"
                               strokeDasharray="3 3"
                               segment={
                                [   { x: data[0].date, y: data[0].amount },
                                    { x: data[data.length-1].date, y: data[data.length-1].goal }
                                ]}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}