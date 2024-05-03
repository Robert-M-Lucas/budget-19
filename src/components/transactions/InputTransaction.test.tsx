import { beforeEach, describe, expect, vi, test as defaultTest } from 'vitest';
import { InputTransaction } from './InputTransaction';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { render, screen } from '@testing-library/react';
import { writeNewTransaction } from '../../utils/transaction';
import { userEvent } from "@testing-library/user-event"
import "@testing-library/jest-dom";

function TestInputTransaction() {
    const [show, setShow] = useState(false);

    return <>
        <Button variant="primary" onClick={() => setShow(true)}>Open</Button>
        <InputTransaction show={show} closeModal={() => setShow(false)} />
    </>
}

const test = defaultTest.extend({ user: userEvent.setup() })

// mock the "writeNewTransaction" function to cirumvent firebase auth and rules
// its already been unit tested so we know it works
vi.mock("../../utils/transaction", async (importOriginal) => {
    const mod: {} = await importOriginal();
    return {
        ...mod,
        writeNewTransaction: vi.fn(),
    }
})

// mock auth.currentUser to simulate a user being signed into website
vi.mock("../../utils/firebase", async (importOriginal) => {
    const mod: {} = await importOriginal();
    return {
        ...mod,
        auth: { currentUser: { uid: "100" } }
    }
})

describe("InputTransaction Tests", () => {
    beforeEach(() => {
        render(<TestInputTransaction />)
    })

    test("modal opens", async ({ user }) => {
        expect(screen.queryByText("Add Transaction")).toBeNull();

        await user.click(screen.getByText("Open"));

        // there are two elements with the text "Add Transaction" in this modal: the modal title and the submit button
        expect(screen.getAllByText("Add Transaction")).toHaveLength(2)
    })

    test("modal closes with close button", async ({ user }) => {
        await user.click(screen.getByText("Open"));

        await user.click(screen.getByText("Close"));

        expect(screen.getByText("Open")).toBeVisible()
    })

    test("empty required textboxes results in zero uploaded transactions", async ({ user }) => {
        await user.click(screen.getByText("Open"));
        
        await user.click(screen.getAllByRole("button").find((element) => element.textContent === "Add Transaction")!);

        expect(screen.getByText("The inputted amount is invalid")).toBeVisible()
    })

    test("allow optional textboxes to be empty", async ({ user }) => {
        await user.click(screen.getByText("Open"));
        
        await user.type(screen.getByPlaceholderText("Enter name"), "Sainsburys");
        await user.type(screen.getByPlaceholderText("Enter amount (use '-' for expenses, do not include currency)"), "-100");
        // use default category -- income
        
        await user.click(screen.getAllByRole("button").find((element) => element.textContent === "Add Transaction")!)
    
        expect(await screen.findByText("Transaction has been successfully added")).toBeVisible()
        expect(writeNewTransaction).toHaveBeenCalled();
    })

    test("transaction uploaded when all textboxes are valid", async ({ user }) => {
        await user.click(screen.getByText("Open"));
        
        await user.type(screen.getByPlaceholderText("Enter name"), "Sainsburys");
        await user.type(screen.getByPlaceholderText("Enter amount (use '-' for expenses, do not include currency)"), "-100");
        // use default category -- income
        await user.type(screen.getByPlaceholderText("Enter date (DD/MM/YYYY) (optional)"), "12/12/2001");
        await user.type(screen.getByPlaceholderText("Enter time (HH:MM:SS) (optional)"), "00:00:00");
        await user.type(screen.getByPlaceholderText("Enter Description (optional)"), "testing description");
        await user.type(screen.getByPlaceholderText("Enter Notes (optional)"), "testing notes");
        await user.type(screen.getByPlaceholderText("Enter Address (optional)"), "testing address");
        
        await user.click(screen.getAllByRole("button").find((element) => element.textContent === "Add Transaction")!)
    
        expect(await screen.findByText("Transaction has been successfully added")).toBeVisible()
        expect(writeNewTransaction).toHaveBeenCalled();
    })
})


