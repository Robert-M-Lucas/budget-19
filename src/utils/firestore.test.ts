import {initializeTestEnvironment, RulesTestEnvironment} from "@firebase/rules-unit-testing";
import fs from "node:fs";
import {describe, expect, test} from "vitest";
import {faker} from "@faker-js/faker";
import {setTestDBContext} from "./firebase.ts";
import {getUserPrefs, setUserPrefs, UserPrefs} from "./user_prefs.ts";
import _ from "lodash";

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

        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            await setUserPrefs(user, UserPrefs.default());
            expect.fail("Unauthorised write");
        }
        catch (e) {
            // Expected
        }

        await t.cleanup();
    });
});