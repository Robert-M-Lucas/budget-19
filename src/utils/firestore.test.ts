import {initializeTestEnvironment, RulesTestEnvironment} from "@firebase/rules-unit-testing";
import fs from "node:fs";
import {describe, expect, test} from "vitest";
import {faker, fakerEN_GB} from "@faker-js/faker";
import {setTestDBContext} from "./firebase.ts";
import {getUserPrefs, setUserPrefs, UserPrefs} from "./user_prefs.ts";
import _ from "lodash";
import {collection, deleteDoc, doc} from "firebase/firestore";
import {getTransactionsByDocName, Transaction, writeNewTransaction} from "./transaction.ts";

export async function getTestEnv(): Promise<RulesTestEnvironment> {
    return await initializeTestEnvironment({
        projectId: "budget-19",
        firestore: {
            rules: fs.readFileSync("firestore.rules", "utf8"),
            host: "127.0.0.1",
            port: 8080
        },
    });
}

describe("Firestore Rules Tests", () => {
    test("Read/Update/Delete/Create UserPrefs Unauthenticated", async () => {
        const t = await getTestEnv();
        const user = { uid: faker.string.alphanumeric(20) }
        const context = t.authenticatedContext(user.uid);
        setTestDBContext(context.firestore());

        const prefs = UserPrefs.newChecked(0.2, 0.4);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        await setUserPrefs(user, prefs);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const written_prefs = await getUserPrefs(user);

        expect(_.isEqual(prefs, written_prefs), "Prefs not written").toBeTruthy();

        const no_auth_context = t.unauthenticatedContext();
        setTestDBContext(no_auth_context.firestore());

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const read_pref = await getUserPrefs(user);
        expect(_.isEqual(prefs, read_pref), "Unauthorised read").toBeFalsy();

        await expect(async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            await setUserPrefs(user, UserPrefs.default());
        }, "Unauthorised write").rejects.toThrowError();

        await expect(async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            await setUserPrefs({ uid: faker.string.alphanumeric(20) }, UserPrefs.default());
        }, "Unauthorised create").rejects.toThrowError();

        await expect(async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            await deleteDoc(collection(context.firestore(), "UserPrefs"), user.uid);
        }, "Unauthorised delete").rejects.toThrowError();

        await t.cleanup();
    });

    test("Read/Update/Delete/Create Transaction Unauthenticated", async () => {
        const t = await getTestEnv();
        const user = { uid: faker.string.alphanumeric(20) }
        const context = t.authenticatedContext(user.uid);
        setTestDBContext(context.firestore());

        const transaction = new Transaction(
            fakerEN_GB.location.streetAddress() + ", " + fakerEN_GB.location.city() + ", " + fakerEN_GB.location.zipCode(),
            parseFloat(faker.finance.amount({min: -1000, max: 1000})),
            faker.word.noun(),
            faker.finance.currency().code,
            faker.date.past().valueOf(),
            faker.lorem.sentence(),
            faker.internet.emoji(),
            faker.word.noun(),
            faker.lorem.sentence(),
            user.uid
        );

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const written_transaction = await writeNewTransaction(user, transaction);

        const no_auth_context = t.unauthenticatedContext();
        setTestDBContext(no_auth_context.firestore());

        await expect(async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            await getTransactionsByDocName(user, written_transaction.forceGetDocName());
        }, "Unauthorised read").rejects.toThrowError();

        await expect(async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            await setUserPrefs(user, UserPrefs.default());
        }, "Unauthorised write").rejects.toThrowError();

        await expect(async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            await setUserPrefs({ uid: faker.string.alphanumeric(20) }, UserPrefs.default());
        }, "Unauthorised create").rejects.toThrowError();

        await expect(async () => {
            await deleteDoc(doc(collection(context.firestore(), "UserPrefs"), user.uid));
        }, "Unauthorised delete").rejects.toThrowError();

        await t.cleanup();
    });
});