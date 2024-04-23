import {User} from "firebase/auth";
import {getTransactions, getTransactionsFilterOrderBy, Transaction} from "./firestore.ts";
import {where} from "firebase/firestore";

export async function getCurrentBalance(user: User): Promise<number> {
    const transactions = await getTransactions(user);
    let balance = 0;
    transactions.forEach(transaction => {balance += transaction.amount;});
    return Math.round(balance * 100) / 100;
}

const MONTH_MILLIS = 2.628e+9;

export async function getLastMonthTransaction(user: User): Promise<Transaction[]> {
    return await getTransactionsFilterOrderBy(user, where("dateTime", ">", Date.now() - MONTH_MILLIS));
}

const WEEK_MILLIS = 6.048e+8;

export async function getLastWeekTransaction(user: User): Promise<Transaction[]> {
    return await getTransactionsFilterOrderBy(user, where("dateTime", ">", Date.now() - WEEK_MILLIS));
}

const DAY_MILLIS = 8.64e+7;

export async function getLastDayTransaction(user: User): Promise<Transaction[]> {
    return await getTransactionsFilterOrderBy(user, where("dateTime", ">", Date.now() - DAY_MILLIS));
}