import {Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {graphData} from "./GraphUtils.ts";

interface Props {
    data: graphData;
    index: number
}

const customDot = () => {
    return null;
};

export default function Graphs({data, index}: Props) {
    const referenceData = data.points[index]
    return (
        <>
            {data.title}
            <ResponsiveContainer width={"100%"} height={"100%"}>
                <LineChart data={referenceData}
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
                                    [   { x: referenceData[0].date, y: referenceData[0].amount },
                                        { x: referenceData[referenceData.length-1].date, y: referenceData[referenceData.length-1].goal }
                                    ]}
                    />
                </LineChart>
            </ResponsiveContainer>
        </>
    );
}