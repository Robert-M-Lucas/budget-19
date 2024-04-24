import {Transaction, writeNewTransaction} from "./firestore.ts";
import {faker, fakerEN_GB} from "@faker-js/faker";
import { initializeApp } from "firebase-admin/app";
// import {auth} from "firebase-admin";

function fake_transaction(uid: string): Transaction {
    return new Transaction(
        fakerEN_GB.location.streetAddress() + ", " + fakerEN_GB.location.city() + ", " + fakerEN_GB.location.zipCode(),
        parseFloat(faker.finance.amount({min: -1000, max: 1000})),
        faker.word.noun(),
        faker.finance.currency().code,
        faker.date.past().valueOf(),
        faker.lorem.sentence(),
        faker.internet.emoji(),
        faker.word.noun(),
        faker.lorem.sentence(),
        uid
    );
}

describe("Firestore Tests", () => {
    test("Write Test", async () => {
        initializeApp();
        const user = await auth().createUser({
            email: "test@test.com",
            password: "test_password",
        });

        const new_transaction = fake_transaction(user.uid);

        expect(new_transaction.getDocName()).toBe(undefined);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const written_transaction = await writeNewTransaction(user, new_transaction);

        it("Written Transactions have Doc Name set", () => {
            expect(written_transaction.getDocName()).toBeDefined();
        });
    });
});