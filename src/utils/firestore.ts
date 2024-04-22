import {collection,
    deleteDoc, doc, DocumentSnapshot, getDocs, limit, query, QueryFieldFilterConstraint, setDoc, SnapshotOptions,
    startAfter, where, writeBatch} from "firebase/firestore";
import {User} from "firebase/auth";
import {db} from "./firebase.ts";

export class Transaction {
    private docName?: string;
    public address: string;
    public amount: number;
    public category: string;
    public currency: string;
    public dateTime: string;
    public description: string;
    public emoji: string;
    public name: string;
    public notes: string;
    public readonly uid: string;

    constructor (address: string, amount: number, category: string, currency: string, dateTime: string, description: string, emoji: string, name: string, notes: string, uid: string) {
        this.address = address;
        this.amount = amount;
        this.category = category;
        this.currency = currency;
        this.dateTime = dateTime;
        this.description = description;
        this.emoji = emoji;
        this.name = name;
        this.notes = notes;
        this.uid = uid;
    }

    setDocName(docName: string) {
        this.docName = docName;
    }

    /*
    Returns the Firestore document name if set. If not returns `undefined`.

    Document name will be set if the transaction originated from Firebase.
     */
    getDocName(): string | undefined {
        return this.docName;
    }

    /*
    Returns the Firestore document name if set. Throws an error if not set!

    Document name will be set if the transaction originated from Firebase.
     */
    forceGetDocName(): string {
        if (!this.docName) {
            throw Error("Doc name is not set!");
        }
        return this.docName;
    }

    // Utility method for creating `Transactions`
    static fromFirestore(snapshot: DocumentSnapshot, options: SnapshotOptions): Transaction {
        const data = snapshot.data(options);
        if (!data) {
            throw Error("No data returned for snapshot!");
        }
        const t = new Transaction(data.address, data.amount, data.category, data.currency, data.dateTime, data.description, data.emoji, data.name, data.notes, data.uid);
        t.docName = snapshot.id;
        return t;
    }

    toSendObject(): object {
        const {...transObject} = this;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        delete transObject.docName;
        return transObject;
    }
}


const BATCH_SIZE = 500;

// Returns all transactions for the given `user` with the `docName` attribute set
export async function getTransactions(user: User): Promise<Transaction[]> {
    const q = query(collection(db, "Transactions"), where("uid", "==", user.uid));
    const ts: Transaction[] = [];
    await getDocs(q).then((qs) =>
        qs.forEach((q) => ts.push(Transaction.fromFirestore(q, {})))
    );
    return ts;
}

// Returns `pageSize` transactions for the given `user` with the `docName` attribute set
export async function getTransactionsPage(user: User, pageSize: number, page: number): Promise<Transaction[]> {
    const q = query(collection(db, "Transactions"), where("uid", "==", user.uid), startAfter(page * pageSize), limit(pageSize));
    const ts: Transaction[] = [];
    await getDocs(q).then((qs) =>
        qs.forEach((q) => ts.push(Transaction.fromFirestore(q, {})))
    );
    return ts;
}

/*
Returns the given document if it exists with the `docName` attribute set

Note: Will not return document if it exists for a different user
 */
export async function getTransactionsByDocName(user: User, docName: string): Promise<Transaction | undefined> {
    const q = query(collection(db, "Transactions", docName), where("uid", "==", user.uid));
    const ts: Transaction[] = [];
    await getDocs(q).then((qs) =>
        qs.forEach((q) => ts.push(Transaction.fromFirestore(q, {})))
    );

    if (ts.length === 0) {
        return undefined;
    }
    else {
        if (ts.length > 1) {
            console.warn(`Multiple docs found with name ${docName}!`)
        }
        return ts[0]
    }
}

// Returns all transactions for the given `user` with the `filters` applied
export async function getTransactionsFilterOrderBy(user: User, ...filters: QueryFieldFilterConstraint[]): Promise<Transaction[]> {
    const q = query(collection(db, "Transactions"), where("uid", "==", user.uid), ...filters);
    const ts: Transaction[] = [];
    await getDocs(q).then((qs) =>
        qs.forEach((q) => ts.push(Transaction.fromFirestore(q, {})))
    );
    return ts;
}

/*
 Writes a new transaction to Firestore

 Returns the same transaction with `docName` set.
 */
export async function writeNewTransaction(user: User, transaction: Transaction): Promise<Transaction> {
    if (user.uid != transaction.uid) {
        throw Error(`Current user is '${user.uid}' however transaction is '${transaction.uid}'`);
    }
    const newTransactionRef = doc(collection(db, "Transactions"));
    await setDoc(newTransactionRef, transaction.toSendObject());
    transaction.setDocName(newTransactionRef.id);
    return transaction;
}

// Deletes a transaction
export async function deleteTransaction(docName: string): Promise<void> {
    await deleteDoc(doc(collection(db, "Transactions"), docName));
}

/*
 Overwrites an existing transaction in Firestore

 Returns the same transaction with `docName` set.
 */
export async function overwriteTransaction(user: User, docName: string, transaction: Transaction): Promise<Transaction> {
    if (user.uid != transaction.uid) {
        throw Error(`Current user is '${user.uid}' however transaction is '${transaction.uid}'`);
    }
    const newTransactionRef = doc(collection(db, "Transactions"), docName);
    await setDoc(newTransactionRef, transaction.toSendObject());
    transaction.setDocName(newTransactionRef.id);
    return transaction;
}

//  Writes a batch of transactions to Firestore
export async function writeNewTransactionsBatched(user: User, transactions: Transaction[]): Promise<void> {
    for (let i = 0; i < transactions.length; i+=500) {
        const batch = writeBatch(db);
        const chunk = transactions.slice(i, i + BATCH_SIZE);
        chunk.forEach((transaction) => {
            if (user.uid == transaction.uid) {
                throw Error(`Current user is '${user.uid}' however transaction is '${transaction.uid}'`);
            }
            const newTransactionRef = doc(collection(db, "Transactions"));
            batch.set(newTransactionRef, transaction.toSendObject());
        });

        await batch.commit();
    }
}

//  Overwrites a batch of existing transactions in Firestore
export async function overwriteTransactionsBatched(user: User, docName: string[], transactions: Transaction[]): Promise<void> {
    for (let i = 0; i < transactions.length; i += 500) {
        const batch = writeBatch(db);
        const chunk = transactions.slice(i, i + BATCH_SIZE);
        chunk.forEach((transaction) => {
            if (user.uid == transaction.uid) {
                throw Error(`Current user is '${user.uid}' however transaction is '${transaction.uid}'`);
            }
            const newTransactionRef = doc(collection(db, "Transactions"), docName[i]);
            batch.set(newTransactionRef, transaction.toSendObject());
        });

        await batch.commit();
    }
}


/*
function examples() {
    if (auth.currentUser != null) {
        const user = auth.currentUser;
        console.log("Logged in as: " + user.uid)

        // Get transactions (and log them)
        getTransactions(user).then((t) => {
            console.log(t);
        });

        // Get transactions with cost < 26 (and log them)
        getTransactionsFilter(auth.currentUser, where("amount", "<", 26)).then((t) => {
            console.log("< 26:");
            console.log(t);
        });

        // Create new transaction
        // IMPORTANT: Transaction doesn't have docName set here
        const t = new Transaction(
            fakerEN_GB.location.streetAddress() + "\n" + fakerEN_GB.location.city() + "\n" + fakerEN_GB.location.zipCode(),
            parseFloat(faker.finance.amount({min: 0.5, max: 1000})),
            faker.word.noun(),
            faker.finance.currency().code,
            faker.date.past(),
            faker.lorem.sentence(),
            faker.internet.emoji(),
            faker.word.noun(),
            faker.lorem.sentence(),
            user.uid
        );

        // Write new transaction
        // IMPORTANT: This returns the same Transaction with docName set as it now has a reference on the server
        writeNewTransaction(user, t).then((t) => {
            console.log("Created entry");

            t.amount *= 4;
            // Overwrite created transaction
            // IMPORTANT: Not possible without a known docName
            overwriteTransaction(user, t.forceGetDocName(), t).then(() => console.log("Overwrote entry"));
        });
    } else {
        console.log("Not logged in");
    }
}
*/