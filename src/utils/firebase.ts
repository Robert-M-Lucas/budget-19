// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, User } from "firebase/auth";
import {collection, doc, DocumentSnapshot, getDocs, getFirestore, query, setDoc, SnapshotOptions, where} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD70wqk2KYojBO_fAEiWEhDbiz4lo8vw2s",
    authDomain: "budget-19.firebaseapp.com",
    projectId: "budget-19",
    storageBucket: "budget-19.appspot.com",
    messagingSenderId: "208067569050",
    appId: "1:208067569050:web:eca0ff615592577d6fc623",
    measurementId: "G-QF0Z0VGCJ0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app); // Initialize Firebase Authentication

export const db = getFirestore(app);

class Transaction {
    public readonly address: string;
    public readonly amount: number;
    public readonly category: string;
    public readonly currency: string;
    public readonly date: string;
    public readonly description: string;
    public readonly emoji: string;
    public readonly name: string;
    public readonly notes: string;
    public readonly time: string;
    public readonly uid: string;

    constructor (address: string, amount: number, category: string, currency: string, date: string, description: string, emoji: string, name: string, notes: string, time: string, uid: string) {
        this.address = address;
        this.amount = amount;
        this.category = category;
        this.currency = currency;
        this.date = date;
        this.description = description;
        this.emoji = emoji;
        this.name = name;
        this.notes = notes;
        this.time = time;
        this.uid = uid;
    }

    static fromFirestore(snapshot: DocumentSnapshot, options: SnapshotOptions): Transaction {
        const data = snapshot.data(options);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return new Transaction(data.address, data.amount, data.category, data.currency, data.date, data.description, data.emoji, data.name, data.notes, data.time);
    }

    async writeToUser(user: User): Promise<void> {
        if (user.uid != this.uid) {
            throw Error(`Current user is '${user.uid}' however transaction is '${this.uid}'`);
        }
        const newTransactionRef = doc(collection(db, "Transactions"));
        const {...transObject} = this;
        await setDoc(newTransactionRef, transObject);
    }
}


async function getTransactions(user: User): Promise<Transaction[]> {
    const q = query(collection(db, "Transactions"), where("uid", "==", user.uid));
    const ts: Transaction[] = [];
    await getDocs(q).then((qs) =>
        qs.forEach((q) => ts.push(Transaction.fromFirestore(q, {})))
    );
    return ts;
}

auth.onAuthStateChanged(() => {
    if (auth.currentUser != null) {
        // Get transactions (and log them)
        getTransactions(auth.currentUser).then((t) => console.log(t));

        const t = new Transaction("addr",
            12,
            "cat",
            "GBP",
            "00/00/00",
            "desc",
            "e",
            "name",
            "notes",
            "00:00",
            auth.currentUser.uid
        );
        // Create new transaction
        t.writeToUser(auth.currentUser).then(() => console.log("Created entry"));
    } else {
        console.log(null);
    }
});



