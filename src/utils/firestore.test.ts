import {initializeTestEnvironment, RulesTestEnvironment} from "@firebase/rules-unit-testing";
import fs from "node:fs";

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