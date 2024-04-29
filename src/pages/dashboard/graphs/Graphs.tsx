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
        return (
            <ReferenceLine label="Goal"
                           stroke="black"
                           strokeDasharray="3 3"
                           ifOverflow="extendDomain"
                           segment={
                               [
                                   {
                                       x: referencedData[0].date,
                                       y: referencedData[0].amount
                                   },
                                   {
                                       x: referencedData[referencedData.length-1].date,
                                       y: -(referencedData[referencedData.length-1].goal)
                                   }
                               ]
                           }
            />
        );
    }
}

export default function Graphs({data, index}: Props) {
    let referenceData = data.points[index]

    if (data.title === "Expenses") {
        const map = new Map()
        referenceData.forEach((value) => map.set(value.date, value.amount))
        referenceData = []
        map.forEach((val, key) => referenceData.push({ date: key, amount: val, goal: 800 }))
    }

    return (
        <>
            {data.title}
            <ResponsiveContainer width={"100%"} height={"100%"}>
                <LineChart
                    data={referenceData}
                    margin={{top: 30, right: 50, left: 20, bottom: 5}}
                >
                    <XAxis dataKey="date" type="category" />
                    <YAxis/>
                    <Tooltip/>
                    <Line type="monotone" dataKey="amount" stroke="#8884d8" dot={<customDot/>}/>
                    {referenceData && goalLine(data, referenceData)}
                </LineChart>
            </ResponsiveContainer>
        </>
    );
}