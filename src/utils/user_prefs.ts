import {collection, doc, DocumentSnapshot, getDoc, setDoc, SnapshotOptions} from "firebase/firestore";
import {User} from "firebase/auth";
import {db} from "./firebase.ts";
import {round} from "lodash";

export type goalCategories = "Needs" | "Wants" | "Savings" | "Income";

export const Categories: { [index: string]: goalCategories } = {
    "Income": "Income",
    "Transfers": "Wants",
    "Shopping": "Wants",
    "Groceries": "Needs",
    "Entertainment": "Wants",
    "Bills": "Needs",
    "Personal care": "Wants",
    "Eating out": "Wants",
    "Gifts": "Needs",
    "Family": "Needs",
    "Holidays": "Wants",
    "Charity": "Wants",
    "Expenses": "Needs",
    "Finances": "Needs",
    "Savings": "Savings",
    "Transport": "Needs",
    "General": "Wants"
};

export class UserPrefs {
    private readonly needsBudget: number;
    private readonly wantsBudget: number;

    private constructor(needsBudget: number, wantsBudget: number) {
        if (needsBudget > 1) {
            needsBudget = 1;
        }

        if (needsBudget + wantsBudget > 1) {
            wantsBudget = 1 - needsBudget;
        }

        this.needsBudget = round(needsBudget, 2);
        this.wantsBudget = round(wantsBudget, 2);
    }

    static newChecked(needsBudget: number, wantsBudget: number): UserPrefs {
        if (needsBudget > 1) {
            throw new Error("needsBudget > 1!");
        }

        if (needsBudget + wantsBudget > 1) {
            throw new Error("needsBudget + wantsBudget > 1!");
        }

        return new UserPrefs(needsBudget, wantsBudget);
    }

    static default(): UserPrefs {
        return new UserPrefs(0.5, 0.3);
    }

    getNeedsBudget(): number {
        return this.needsBudget;
    }

    getWantsBudget(): number {
        return this.wantsBudget;
    }

    getSavingsBudget(): number {
        return round(1 - this.wantsBudget - this.needsBudget, 2);
    }

    // Utility method for creating `Transactions`
    static fromFirestore(snapshot: DocumentSnapshot, options: SnapshotOptions): UserPrefs {
        const data = snapshot.data(options);
        if (!data) {
            throw Error("No data returned for snapshot!");
        }

        return new UserPrefs(round(data.needsBudget, 2), round(data.wantsBudget, 2));
    }

    toSendObject(): object {
        const {...transObject} = this;
        return transObject;
    }
}

export async function getUserPrefs(user: User): Promise<UserPrefs> {
    const docRef = doc(collection(db, "UserPrefs"), user.uid);

    return await getDoc(docRef).then((ds) =>
        UserPrefs.fromFirestore(ds, {})
    ).catch(() => UserPrefs.default());
}

export async function setUserPrefs(user: User, prefs: UserPrefs): Promise<void> {
    const docRef = doc(collection(db, "UserPrefs"), user.uid);
    await setDoc(docRef, prefs.toSendObject());
}
