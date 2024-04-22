import { User } from "firebase/auth";
import {getTransactions} from "./firestore.ts";

export async function getCurrentBalance(user: User): Promise<number> {
    const transactions = await getTransactions(user);
    let balance = 0;
    transactions.forEach(transaction => {balance += transaction.amount;});
    return Math.round(balance * 100) / 100;
}