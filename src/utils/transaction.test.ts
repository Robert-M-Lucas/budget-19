import {
    deleteTransaction,
    getTransactions,
    getTransactionsByDocName,
    getTransactionsFilterOrderBy, overwriteTransaction, overwriteTransactionsBatched,
    Transaction, TransactionCategories,
    writeNewTransaction,
    writeNewTransactionsBatched
} from "./transaction.ts";
import {faker, fakerEN_GB} from "@faker-js/faker";
import _ from "lodash";
import { describe, expect, test } from "vitest";
import {where} from "firebase/firestore";
import {emojis} from "../components/transactions/Transaction.ts";
import {getTestEnv} from "./firestore.test.ts";
import {setTestDBContext} from "./firebase.ts";

function fakeTransaction(uid: string, name?: string): Transaction {
    return new Transaction(
        fakerEN_GB.location.streetAddress() + ", " + fakerEN_GB.location.city() + ", " + fakerEN_GB.location.zipCode(),
        parseFloat(faker.finance.amount({min: -1000, max: 1000})),
        faker.word.noun(),
        faker.finance.currency().code,
        faker.date.past().valueOf(),
        faker.string.numeric(100),
        faker.internet.emoji(),
        name ? name : faker.word.noun(),
        faker.lorem.sentence(),
        uid
    );
}

describe("Firestore Transaction Tests", () => {
    test("Category Integrity Test", () => {
        expect(_.isEqual(new Set(Object.keys(emojis)), TransactionCategories),  "Emoji keys do not match transaction categories").toBeTruthy();
    });
    test("Write/Read Test", async () => {
        const t = await getTestEnv();
        const user = {uid: "sample_user"};
        const context = t.authenticatedContext(user.uid);
        setTestDBContext(context.firestore());
        
        const new_transaction = fakeTransaction(user.uid);

        expect(new_transaction.getDocName(), "New transaction has docName").toBe(undefined);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const written_transaction = await writeNewTransaction(user, new_transaction);

        expect(written_transaction.getDocName(), "Written transaction has no docName").toBeDefined();

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const fetched_transaction = await getTransactionsByDocName(user, written_transaction.forceGetDocName());

        expect(fetched_transaction, "Written transaction can't be fetched").toBeDefined();

        expect(_.isEqual(written_transaction, fetched_transaction), "Fetched transaction doesn't match written transaction").toBeTruthy();

        await t.cleanup();
    });

    test("Write/Read Batch Test", async () => {
        const t = await getTestEnv();
        const user = {uid: "sample_user"};
        const context = t.authenticatedContext(user.uid);
        setTestDBContext(context.firestore());

        const transaction_name = faker.string.alphanumeric(20);

        const transactions = [];

        for (let i = 0; i < 2123; i++) {
            transactions.push(fakeTransaction(user.uid, transaction_name));
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        await writeNewTransactionsBatched(user, transactions);


        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const fetched_transaction = await getTransactionsFilterOrderBy(user, where("name", "==", transaction_name));

        fetched_transaction.forEach((t) => expect(t.getDocName()).toBeDefined())


        const sorted_fetched_transactions = fetched_transaction
            .sort((a, b) => parseInt(a.description) - parseInt(b.description));

        const sorted_transactions = transactions
            .sort((a, b) => parseInt(a.description) - parseInt(b.description));
        sorted_transactions.forEach((t, i) => t.setDocName(sorted_fetched_transactions[i].forceGetDocName()));

        expect(_.isEqual(sorted_transactions, sorted_fetched_transactions), "Written transactions not fetched").toBeTruthy();

        await t.cleanup();
    }, 20_000);

    test("Read All Test", async () => {
        const t = await getTestEnv();
        const user = {uid: "sample_user"};
        const context = t.authenticatedContext(user.uid);
        setTestDBContext(context.firestore());

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        await writeNewTransaction(user, fakeTransaction(user.uid));

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const new_transaction = await writeNewTransaction(user, fakeTransaction(user.uid));

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        await writeNewTransaction(user, fakeTransaction(user.uid));

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const updated_transactions = await getTransactions(user);

        expect(
            updated_transactions.reduce((curr, el) => curr || _.isEqual(el, new_transaction), false)
        , "Written transaction not fetched").toBeTruthy();
        await t.cleanup();
    }, 20_000);

    test("Delete Test", async () => {
        const t = await getTestEnv();
        const user = {uid: "sample_user"};
        const context = t.authenticatedContext(user.uid);
        setTestDBContext(context.firestore());

        const transaction_name = faker.string.alphanumeric(20);
        
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const transaction = await writeNewTransaction(user, fakeTransaction(user.uid, transaction_name));
        
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        expect((await getTransactionsFilterOrderBy(user, where("name", "==", transaction_name))).length
        , "New transaction not present").toBe(1);
        
        await deleteTransaction(transaction.forceGetDocName());

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        expect((await getTransactionsFilterOrderBy(user, where("name", "==", transaction_name))).length
        , "Transaction not deleted").toBe(0);

        await t.cleanup();
    });
    
    test("Overwrite Batch Test", async () => {
        const t = await getTestEnv();
        const user = {uid: "sample_user"};
        const context = t.authenticatedContext(user.uid);
        setTestDBContext(context.firestore());

        const transactions = [];
        
        const transaction_name = faker.string.alphanumeric(20);
        
        for (let i = 0; i < 2123; i++) {
            transactions.push(fakeTransaction(user.uid, transaction_name));
        }
        
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        await writeNewTransactionsBatched(user, transactions);
        
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const transactions_with_doc = await getTransactionsFilterOrderBy(user, where("name", "==", transaction_name));
        
        expect(transactions_with_doc.length, "Transactions not written").toBe(transactions.length);
        
        const new_transaction_name = faker.string.alphanumeric(20);
        
        transactions_with_doc.forEach((t) => { t.name = new_transaction_name; });
        
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        await overwriteTransactionsBatched(user, transactions_with_doc.map((t) => t.forceGetDocName()), transactions_with_doc);
        
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const overwritten_transactions = await getTransactionsFilterOrderBy(user, where("name", "==", new_transaction_name));

        expect(overwritten_transactions.reduce((curr, t) => curr && (t.name == new_transaction_name), true)).toBeTruthy();

        await t.cleanup();
    }, 40_000);

    test("Overwrite Test", async () => {
        const t = await getTestEnv();
        const user = {uid: "sample_user"};
        const context = t.authenticatedContext(user.uid);
        setTestDBContext(context.firestore());

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const transaction = await writeNewTransaction(user, fakeTransaction(user.uid, faker.string.alphanumeric(20)));

        const new_name = faker.string.alphanumeric(20);

        transaction.name = new_name;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const overwritten_transaction = await overwriteTransaction(user, transaction.forceGetDocName(), transaction);

        expect(overwritten_transaction.getDocName(), "Overwritten transaction doesn't have the same docName").toBe(transaction.forceGetDocName());

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const read_transaction = await getTransactionsByDocName(user, transaction.forceGetDocName());

        expect(read_transaction, "Overwritten transaction doesn't exist").toBeDefined();

        expect(read_transaction!.name, "Overwritten changes aren't present").toBe(new_name);

        await t.cleanup();
    });
});