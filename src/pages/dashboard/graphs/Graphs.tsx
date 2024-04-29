import {Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {graphData, transactionPoint} from "./GraphUtils.ts";

interface Props {
    data: graphData;
    index: number
}

const customDot = () => {
    return null;
};

const goalLine = (data: graphData, referencedData: transactionPoint[]) => {
    const name = data.title;
    if (name === "Expenses") {
        console.log(referencedData[0].date, referencedData[0].amount)
        console.log(referencedData[referencedData.length-1].date, -(referencedData[referencedData.length-1].goal))
        return (
            <ReferenceLine label="Goal"
                           stroke="black"
                           strokeDasharray="3 3"
                           segment={
                               [
                                   {
                                       x: referencedData[0].date,
                                       y: 0
                                   },
                                   {
                                       x: referencedData[referencedData.length-1].date,
                                       y: -(referencedData[referencedData.length-1].goal)
                                   }
                               ]
                           }
            />
        );
    } else if (name === "Income") {
        return (
            <ReferenceLine label="Goal"
                           stroke="black"
                           strokeDasharray="3 3"
                           segment={
                               [
                                   {
                                       x: referencedData[0].date,
                                       y: referencedData[0].amount
                                   },
                                   {
                                       x: referencedData[referencedData.length-1].date,
                                       y: referencedData[referencedData.length-1].goal
                                   }
                               ]
                           }
            />
        );
    } else {
        return (
            <ReferenceLine label="Goal"
                           stroke="black"
                           strokeDasharray="3 3"
                           segment={
                               [
                                   {
                                       x: referencedData[0].date,
                                       y: referencedData[0].amount
                                   },
                                   {
                                       x: referencedData[referencedData.length-1].date,
                                       y: referencedData[referencedData.length-1].goal
                                   }
                               ]
                           }
            />
        );
    }
}

export default function Graphs({data, index}: Props) {
    const referenceData = data.points[index]
    return (
        <>
            {data.title}
            <ResponsiveContainer width={"100%"} height={"100%"}>
                <LineChart
                    data={referenceData}
                    margin={{top: 30, right: 50, left: 20, bottom: 5}}
                >
                    <XAxis dataKey="date"/>
                    <YAxis/>
                    <Tooltip/>
                    <Line type="monotone" dataKey="amount" stroke="#8884d8" dot={<customDot/>}/>
                    {referenceData && goalLine(data, referenceData)}
                </LineChart>
            </ResponsiveContainer>
        </>
    );
}