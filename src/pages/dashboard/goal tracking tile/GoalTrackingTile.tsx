import {Transaction} from "../../../utils/transaction.ts";
import {ReactNode} from "react";
import {max} from "lodash";
import {UserPrefs} from "../../../utils/user_prefs.ts";
import {nanDisplay, roundFix} from "../../../utils/numbers.ts";

export default function goalTracking(transactions: Transaction[], userPrefs: UserPrefs): ReactNode {
    const balance = transactions.reduce((prev, curr): number => prev + curr.amount, 0);
    const income = transactions.reduce((prev, curr): number => prev + max([curr.amount, 0])!, 0);
    const needs = transactions.reduce((prev, curr): number => {
        if (curr.getCategoryCategory() === "Needs" && curr.amount < 0) {
            return prev - curr.amount;
        }
        return prev;
    }, 0);
    const wants = transactions.reduce((prev, curr): number => {
        if (curr.getCategoryCategory() === "Wants" && curr.amount < 0) {
            return prev - curr.amount;
        }
        return prev;
    }, 0);
    const savings = transactions.reduce((prev, curr): number => {
        if (curr.getCategoryCategory() === "Savings" && curr.amount < 0) {
            return prev - curr.amount;
        }
        return prev;
    }, 0);

    const needsTarget = income * userPrefs.getNeedsBudget();
    const wantsTarget = income * userPrefs.getWantsBudget();
    const savingsTarget = income * userPrefs.getSavingsBudget();

    const needsOffsetPercentage = Math.round((needs - needsTarget) / income * 100);
    const wantsOffsetPercentage = Math.round((wants - wantsTarget) / income * 100);
    const savingsBalanceOffsetPercentage = Math.round(((savings + balance) - savingsTarget) / income * 100);

    return <table className="table h-100 mt-4 mb-4">
        <thead style={{height: "10px!important"}}>
            <tr>
                <th scope="col" className={"p-0"}>Category</th>
                <th scope="col" className={"p-0"}>Actual</th>
                <th scope="col" className={"p-0"}>Target</th>
                <th scope="col" className={"p-0"}>Difference</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td className={"text-center"} scope="row">Needs</td>
                {needsOffsetPercentage > 0 ?
                    <td className={"text-center"} style={{color: "#ca0f0f"}}>£{roundFix(needs)}</td> :
                    <td className={"text-center"} style={{color: "green"}}>£{roundFix(needs)}</td>
                }
                <td className={"text-center"}>£{roundFix(needsTarget)}</td>
                {needsOffsetPercentage > 0 ?
                    <td className={"text-center"} style={{color: "#ca0f0f"}}>{nanDisplay(needsOffsetPercentage)}%</td> :
                    <td className={"text-center"} style={{color: "green"}}>{nanDisplay(needsOffsetPercentage)}%</td>
                }
            </tr>
            <tr>
                <td className={"text-center"} scope="row">Wants</td>
                {wantsOffsetPercentage > 0 ?
                    <td className={"text-center"} style={{color: "#ca0f0f"}}>£{roundFix(wants)}</td> :
                    <td className={"text-center"} style={{color: "green"}}>£{roundFix(wants)}</td>
                }
                <td className={"text-center"}>£{roundFix(wantsTarget)}</td>
                {wantsOffsetPercentage > 0 ?
                    <td className={"text-center"} style={{color: "#ca0f0f"}}>{nanDisplay(wantsOffsetPercentage)}%</td> :
                    <td className={"text-center"} style={{color: "green"}}>{nanDisplay(wantsOffsetPercentage)}%</td>
                }
            </tr>
            <tr style={{borderBottom: "rgba(0, 0, 0, 0)"}}>
                <td className={"text-center"} scope="row">Savings + Balance</td>
                {savingsBalanceOffsetPercentage < 0 ?
                    <td className={"text-center"} style={{color: "#ca0f0f"}}>£{roundFix(savings + balance)}</td> :
                    <td className={"text-center"} style={{color: "green"}}>£{roundFix(savings + balance)}</td>
                }
                <td className={"text-center"}>£{roundFix(savingsTarget)}</td>
                {savingsBalanceOffsetPercentage < 0 ?
                    <td className={"text-center"} style={{color: "#ca0f0f"}}>{nanDisplay(savingsBalanceOffsetPercentage)}%</td> :
                    <td className={"text-center"} style={{color: "green"}}>{nanDisplay(savingsBalanceOffsetPercentage)}%</td>
                }
            </tr>
        </tbody>
    </table>;
}