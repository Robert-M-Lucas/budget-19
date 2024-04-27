import {User} from "firebase/auth";
import {getTransactions, getTransactionsFilterOrderBy, Transaction} from "./transaction.ts";
import {limit, orderBy, startAfter, where} from "firebase/firestore";

export async function getCurrentBalance(user: User): Promise<number> {
    const transactions = await getTransactions(user);
    const balance = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
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

// Returns `pageSize` transactions for the given `user` with the `docName` attribute set
export async function getTransactionsPage(user: User, pageSize: number, page: number): Promise<Transaction[]> {
    return await getTransactionsFilterOrderBy(user, orderBy("dateTime", "desc"), startAfter(page * pageSize), limit(pageSize));
}