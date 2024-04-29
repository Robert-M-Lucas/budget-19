import {Transaction} from "../../../utils/transaction.ts";
import {ReactNode} from "react";
import {max} from "lodash";
import {UserPrefs} from "../../../utils/user_prefs.ts";
import {nanDisplay} from "../../../utils/numbers.ts";

export default function motivationTile(transactions: Transaction[], userPrefs: UserPrefs): ReactNode {
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

    const finalOffsetPercentage = (-needsOffsetPercentage) + (-wantsOffsetPercentage) + savingsBalanceOffsetPercentage;

    return <>
        <div style={{height: "5%"}}></div>
        <div className={"w-100 text-center d-flex align-items-center justify-content-center"} style={{height: "20%"}}>
            <span>Your score is:</span>
        </div>
        <div className={"w-100 text-center d-flex align-items-center justify-content-center"}
             style={{height: "50%", lineHeight: "100%"}}>
            {finalOffsetPercentage < 0 ?
                <span style={{fontSize: "60px", color: "#ca0f0f"}}>{nanDisplay(finalOffsetPercentage)}</span> :
                <span style={{fontSize: "60px", color: "green"}}>{nanDisplay(finalOffsetPercentage)}</span>
            }
        </div>
        <div className={"w-100 text-center d-flex align-items-center justify-content-center"} style={{height: "20%"}}>
            {finalOffsetPercentage < 0 ?
                <span>Keep Trying!</span> :
                <span>Good Job!</span>
            }
        </div>
        <div style={{height: "5%"}}></div>
    </>;
}