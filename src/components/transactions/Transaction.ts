import {Transaction as TransactionDocument, TransactionCategories} from "../../utils/transaction.ts";
import strftime from "strftime";

export const emojis: { [index: string]: string } = {
    "Income": "💸",
    "Transfers": "🏦",
    "Shopping": "🛍️",
    "Groceries": "🍏",
    "Entertainment": "🎨",
    "Bills": "💵",
    "Personal care": "💊",
    "Eating out": "🍽️",
    "Gifts": "🎁",
    "Family": "👪",
    "Holidays": "☀️",
    "Charity": "🤝",
    "Expenses": "💰",
    "Finances": "💳",
    "Savings": "💎",
    "Transport": "🚌",
    "General": "🎒"
}


export class Transaction {
    isValid: boolean;
    invalidField?: string;

    date?: string;
    time?: string;
    name?: string;
    emoji?: string | null;
    category?: string; 
    amount?: number;
    currency?: string;
    notes?: string | null;
    address?: string | null;
    description?: string | null;

    constructor() {
        this.isValid = true;
    }
    
    fromRow(row: string[]) {
        this.setDate(row[1])
            .setTime(row[2])
            .setName(row[4])
            .setEmoji(row[5])
            .setCategory(row[6])
            .setAmount(row[7])
            .setCurrency(row[8])
            .setNotes(row[11])
            .setAddress(row[12])
            .setDescription(row[14]);
        
        return this;
    }

    setDate(date?: string) {
        const [day, month, year] = (date || "").split("/").map((n) => Number(n));
        
        this.date = `${year}-${month}-${day}`;
        
        if (isNaN(Date.parse(this.date)) || isNaN(day) || isNaN(month) || isNaN(year) || day < 1 || day > 31 || month < 1 || month > 12) {
            this.isValid = false;
            this.invalidField = "date";
        }
        
        return this;
    }

    setTime(time?: string) {
        const [hour, minute, second] = (time || "").split(":").map((n) => Number(n));

        if (isNaN(hour) || isNaN(minute) || isNaN(second) || hour < 0 || minute < 0 || second < 0 || hour > 24 || minute > 60 || second > 60) {
            this.isValid = false;
            this.invalidField = "time";
        } else {
            this.time = time;
        }

        return this;
    }

    setName(name?: string) {
        if (!this.isNotEmpty(name)) {
            this.isValid = false;
            this.invalidField = "name";
        } else {
            this.name = name;
        }

        return this;
    }

    setEmoji(emoji?: string) {
        this.emoji = this.isNotEmpty(emoji) ? emoji : null;

        return this;
    }

    setCategory(category?: string) {
        if (!this.isNotEmpty(category) || !TransactionCategories.has(category)) {
            this.isValid = false;
            this.invalidField = "category";
        } else {
            this.category = category;
        }

        return this;
    }

    setAmount(amount?: string) {
        this.amount = Number(amount);

        if (isNaN(this.amount) || !this.isNotEmpty(amount)) {
            this.isValid = false;
            this.invalidField = "amount";
        }

        return this;
    }

    setCurrency(currency?: string) {
        if (!this.isNotEmpty(currency)) {
            this.isValid = false;
            this.invalidField = "name";
        } else {
            this.currency = currency;
        }

        return this;
    }

    setNotes(notes?: string) {
        this.notes = this.isNotEmpty(notes) ? notes : null;

        return this;
    }

    setAddress(address?: string) {
        this.address = this.isNotEmpty(address) ? address : null;

        return this;
    }

    setDescription(description?: string) {
        this.description = this.isNotEmpty(description) ? description : null;

        return this;
    }

    toDocument(uid: string): TransactionDocument {
        return new TransactionDocument(
            this.address as string,
            this.amount as number,
            this.category as string,
            this.currency as string,
            new Date((this.date as string) + " " + (this.time as string)).getTime(),
            this.description as string,
            this.emoji as string,
            this.name as string,
            this.notes as string,
            uid
        );
    }

    isNotEmpty(val?: string): val is string {
        return !!val && val.trim() !== "";
    }
}

// utility functions for transactions

export function formatDate(date: Date):string {
    return strftime("%d/%m/%Y", date);
}

export function formatTime(date: Date):string {
    return strftime("%H:%M:%S", date);
}