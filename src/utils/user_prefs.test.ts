import {describe, expect, test} from "vitest";
import {faker} from "@faker-js/faker";
import {UserPrefs, getUserPrefs, setUserPrefs, Categories} from "./user_prefs.ts";
import _ from "lodash";
import {TransactionCategories} from "./transaction.ts";
import {getTestEnv} from "./firestore.test.ts";
import {setTestDBContext} from "./firebase.ts";


describe("Firestore UserPrefs Tests", () => {
    test("Category Integrity Test", () => {
        expect(_.isEqual(new Set(Object.keys(Categories)), TransactionCategories),  "Category keys do not match transaction categories").toBeTruthy();
    });
    test("Read/Write/Default Value Test", async () => {
        const t = await getTestEnv();
        const user = { uid: faker.string.alphanumeric(20) }
        const context = t.authenticatedContext(user.uid);
        setTestDBContext(context.firestore());

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const prefs = await getUserPrefs(user);

        expect(_.isEqual(prefs, UserPrefs.default()), "Non-existent UserPrefs should return default").toBeTruthy();
        
        const new_prefs = UserPrefs.newChecked(0.4, 0.2);
        
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        await setUserPrefs(user, new_prefs);
        
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const read_prefs = await getUserPrefs(user);

        expect(_.isEqual(read_prefs, new_prefs), "UserPref changes to be read").toBeTruthy();

        await t.cleanup();
    });
});