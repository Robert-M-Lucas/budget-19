import {describe, expect, test} from "vitest";
import {faker} from "@faker-js/faker";
import {UserPrefs, getUserPrefs, setUserPrefs, Categories} from "./user_prefs.ts";
import _ from "lodash";
import {TransactionCategories} from "./transaction.ts";


describe("Firestore UserPrefs Tests", () => {
    test("Category Integrity Test", () => {
        expect(_.isEqual(new Set(Object.keys(Categories)), TransactionCategories),  "Emoji keys do not match transaction categories").toBeTruthy();
    });
    test("Read/Write/Default Value Test", async () => {
        const user = { uid: faker.string.alphanumeric(20) }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const prefs = await getUserPrefs(user);

        expect(_.isEqual(prefs, UserPrefs.default()), "Non-existent UserPrefs should return default").toBeTruthy();
        
        const new_prefs = UserPrefs.newChecked(0.4, 0.2);
        
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        await setUserPrefs(user, prefs);
        
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const read_prefs = await getUserPrefs(user);

        console.log(new_prefs);
        console.log(read_prefs);

        expect(_.isEqual(read_prefs, prefs), "UserPref changes to be read").toBeTruthy();
    });
});