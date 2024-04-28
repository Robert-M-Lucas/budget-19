import {ReactNode} from "react";
import { Transaction } from "../../../utils/transaction.ts";
import {max, min} from "lodash";
import {roundFix} from "../../../utils/numbers.ts";

export default function totalTile(transactions: Transaction[]): ReactNode {
    const balance = transactions.reduce((prev, curr): number => prev + curr.amount, 0);
    const income = transactions.reduce((prev, curr): number => prev + max([curr.amount, 0])!, 0);
    const expenses = transactions.reduce((prev, curr): number => prev + min([curr.amount, 0])!, 0);

    return <ul className="list-group list-group-flush w-100 h-100">
            <li className="list-group-item" style={{height: "33%"}}>
                <div className="row h-100">
                    <div className="col d-flex justify-content-center align-items-center">Balance:</div>
                    {balance > 0 ? <>
                        <div className="col d-flex justify-content-center align-items-center" style={{color: "green"}}>£</div>
                        <div className="col d-flex justify-content-center align-items-center" style={{color: "green"}}>{roundFix(balance)}</div>
                    </> : <>
                        <div className="col d-flex justify-content-center align-items-center" style={{color: "#ca0f0f"}}>£</div>
                        <div className="col d-flex justify-content-center align-items-center" style={{color: "#ca0f0f"}}>{roundFix(balance)}</div>
                    </>}
                </div>
            </li>
        <li className="list-group-item" style={{height: "33%"}}>
            <div className="row h-100">
                <div className="col d-flex justify-content-center align-items-center">Income:</div>
                <div className="col d-flex justify-content-center align-items-center" style={{color: "green"}}>£</div>
                <div className="col d-flex justify-content-center align-items-center" style={{color: "green"}}>{roundFix(income)}</div>
            </div>
        </li>
        <li className="list-group-item" style={{height: "33%"}}>
            <div className="row h-100">
                <div className="col d-flex justify-content-center align-items-center">Expenses:</div>
                <div className="col d-flex justify-content-center align-items-center" style={{color: "#ca0f0f"}}>£</div>
                <div className="col d-flex justify-content-center align-items-center" style={{color: "#ca0f0f"}}>{roundFix(expenses)}</div>
            </div>
        </li>
    </ul>;
}