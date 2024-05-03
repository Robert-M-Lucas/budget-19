import { describe, expect, test } from "vitest";
import { Transaction, emojis } from "./Transaction.ts";
import { TransactionCategories } from "../../utils/transaction.ts";
import _ from "lodash";

describe("Input Transaction Test", () => {
    test("Category Integrity Test", () => {
        expect(_.isEqual(new Set(Object.keys(emojis)), TransactionCategories),  "Emoji keys do not match transaction categories").toBeTruthy();
    });
});

const validationTest = test.extend({ transaction: new Transaction() })

function doesValidate(transaction: Transaction, field: string) {
    expect(!transaction.isValid && transaction.invalidField == field).toBeTruthy()
}

describe("Transaction Validator Tests", () => {
    validationTest("stops undefined date", ({ transaction }) => {
        transaction.setDate();
        doesValidate(transaction, "date");
    })

    validationTest("stops empty string as date", ({ transaction }) => {
        transaction.setDate("");
        doesValidate(transaction, "date");
    })

    validationTest("stops 00/00/00 as date", ({ transaction }) => {
        transaction.setDate("00/00/00");
        doesValidate(transaction, "date");
    })

    validationTest("stops 32/21/00 as date", ({ transaction }) => {
        transaction.setDate("32/21/00");
        doesValidate(transaction, "date");
    })

    validationTest("stops / as date", ({ transaction }) => {
        transaction.setDate("/");
        doesValidate(transaction, "date");
    })

    validationTest("stops undefined time", ({ transaction }) => {
        transaction.setTime();
        doesValidate(transaction, "time");
    })

    validationTest("stops empty string as time", ({ transaction }) => {
        transaction.setTime("");
        doesValidate(transaction, "time");
    })

    validationTest("stops 25:61:61 as time", ({ transaction }) => {
        transaction.setTime("25:61:61");
        doesValidate(transaction, "time");
    })

    validationTest("stops : as time", ({ transaction }) => {
        transaction.setTime(":");
        doesValidate(transaction, "time");
    })

    validationTest("stops undefined names", ({ transaction }) => {
        transaction.setName();
        doesValidate(transaction, "name");
    })

    validationTest("stops unknown categories", ({ transaction }) => {
        transaction.setCategory("testing");
        doesValidate(transaction, "category");
    })

    validationTest("stops undefined category", ({ transaction }) => {
        transaction.setCategory();
        doesValidate(transaction, "category");
    })

    validationTest("stops non-number amounts", ({ transaction }) => {
        transaction.setAmount("testing");
        doesValidate(transaction, "amount");
    })

    validationTest("stops undefined amount", ({ transaction }) => {
        transaction.setAmount();
        doesValidate(transaction, "amount");
    })

    validationTest("stops undefined currencies", ({ transaction }) => {
        transaction.setCurrency();
        doesValidate(transaction, "currency");
    })
})
