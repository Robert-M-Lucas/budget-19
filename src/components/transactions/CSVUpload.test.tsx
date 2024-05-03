import { beforeEach, describe, expect, test as defaultTest, vi } from 'vitest';
import { CSVUpload } from './CSVUpload';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import "@testing-library/jest-dom";

function TestCSVUpload() {
    const [show, setShow] = useState(false);

    return <>
        <Button variant="primary" onClick={() => setShow(true)}>Open</Button>
        <CSVUpload show={show} closeModal={() => setShow(false)} />
    </>
}

const test = defaultTest.extend({ user: userEvent.setup() })

// mock the "writeNewTransactionsBatched" function to cirumvent firebase auth and rules
// its already been unit tested so we know it works
vi.mock("../../utils/transaction", async (importOriginal) => {
    const mod: {} = await importOriginal();
    return {
        ...mod,
        writeNewTransactionsBatched: vi.fn(),
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

describe("CSVUpload Tests", () => {
    beforeEach(() => {
        render(<TestCSVUpload />)
    });
    
    test("modal opens", async ({ user }) => {
        expect(screen.queryByText("Upload CSV Transactions")).toBeNull();

        await user.click(screen.getByText("Open"));

        expect(screen.getByText("Upload CSV Transactions")).toBeInTheDocument();
    })

    test("modal closes with close button", async ({ user }) => {
        await user.click(screen.getByText("Open"));

        await user.click(screen.getByText("Close"));

        expect(screen.getByText("Open")).toBeVisible()
    })

    test("stops no uploaded CSV", async ({ user }) => {
        await user.click(screen.getByText("Open"));
        
        await user.click(screen.getByText("Upload CSV"));

        expect(screen.getByText("You haven't uploaded a CSV file")).toBeVisible()
    })

    test("non-CSV results in zero uploaded transactions", async ({ user }) => {
        await user.click(screen.getByText("Open"));

        const txt = new File(["testing"], "text.txt", { type: "text/plaintext", lastModified: Date.now() })
        
        await user.upload(screen.getByTestId("csvUpload"), txt)

        await user.click(screen.getByText("Upload CSV"));
        
        expect(screen.getByText("You haven't uploaded a CSV file")).toBeVisible()
    })

    test("empty CSV results in zero uploaded transactions", async ({ user }) => {
        await user.click(screen.getByText("Open"));

        const csv = new File([""], "emptyCSV.csv", { type: "text/csv", lastModified: Date.now() })
        
        await user.upload(screen.getByTestId("csvUpload"), csv)

        await user.click(screen.getByText("Upload CSV"));
        
        expect(screen.getByText("Uploaded CSV is empty")).toBeVisible()
    })

    test("non-Monzo CSV results in zero uploaded transactions", async ({ user }) => {
        await user.click(screen.getByText("Open"));

        const csv = new File(
            ["testing1, 123, testing2, testing,, testing3, 5-5, testing!"], 
            "invalidCSV.csv", 
            { type: "text/csv", lastModified: Date.now() }
        )
        
        await user.upload(screen.getByTestId("csvUpload"), csv)

        await user.click(screen.getByText("Upload CSV"));
        
        expect(screen.getByText("The uploaded CSV file has no valid transactions")).toBeVisible()
    })

    test("Monzo CSV file uploads transactions", async ({ user }) => {
        await user.click(screen.getByText("Open"));

        const csv = new File(
            [
                "Transaction ID,Date,Time,Type,Name,Emoji,Category,Amount,Currency,Local amount,Local currency,Notes and #tags,Address,Receipt,Description,Category split,Money Out,Money In\n",
                "tx_0000AbA3Oasz9hIuCRy3RT,26/10/2023,11:55:41,Card payment,Boots,💊,Personal care,-21.97,GBP,-21.97,GBP,,1 Newark Street,,BOOTS 2011             BATH          GBR,,-21.97,\n",
                "tx_0000Ab8DxJ14CFwgh9JVh4,25/10/2023,14:44:35,Card payment,Aesop Bath,💄,Shopping,-25.00,GBP,-25.00,GBP,,16 New Bond Street,,Aesop Bath             Bath          GBR,,-25.00,\n"
            ], 
            "validCSV.csv", 
            { type: "text/csv", lastModified: Date.now() }
        )

        await user.upload(screen.getByTestId("csvUpload"), csv)

        await user.click(screen.getByText("Upload CSV"));
        
        expect(screen.getByText("2 transactions have been imported")).toBeVisible()
    })
})