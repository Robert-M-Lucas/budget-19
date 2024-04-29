import {describe, expect, test} from "vitest";
import {emojis} from "./Transaction.ts";
import {TransactionCategories} from "../../utils/transaction.ts";
import _ from "lodash";

describe("Input Transaction Test", () => {
    test("Category Integrity Test", () => {
        expect(_.isEqual(new Set(Object.keys(emojis)), TransactionCategories),  "Emoji keys do not match transaction categories").toBeTruthy();
    });
});