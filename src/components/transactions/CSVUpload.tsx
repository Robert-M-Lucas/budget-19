import { useState } from "react";
import { Transaction } from "./Transaction";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { writeNewTransactionsBatched } from "../../utils/transaction.ts";
import { auth } from "../../utils/firebase";

export function stopDragging(e: React.PointerEvent<HTMLDivElement>) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
}

export function CSVUpload({ show, closeModal }: { show: boolean, closeModal: (added: boolean) => void }) {
    const [error, setError] = useState<string | null>();
    const [successMsg, setSuccessMsg] = useState<string | null>();

    const [added, setAdded] = useState<boolean>(false);

    const reader = new FileReader();

    async function handleUpload() {
        setError(null);
        setSuccessMsg(null);
                
        const fileElement = document.getElementById("file") as HTMLInputElement | null;
        if (!fileElement || fileElement.files?.length === 0) return setError("You haven't uploaded a CSV file");

        const file = fileElement.files![0]; 
        if (!file) return setError("You haven't uploaded a CSV file");

        reader.onload = async (event) => {
            if (!auth.currentUser) return setError("You are not signed in");
            
            const csvContent = event.target?.result;
            if (!csvContent || csvContent instanceof ArrayBuffer) return setError("Uploaded CSV is empty");

            const transactionDocuments = csvContent
                .split("\n")
                .slice(1)
                .map((row) => row.split(","))
                .filter((row) => row[3] === "Card payment" || row[3] === "Faster payment") // filter by type
                .map((row) => new Transaction().fromRow(row))
                .filter((transaction) => transaction.isValid)
                .map((transaction) => transaction.toDocument(auth.currentUser!.uid));

            if (transactionDocuments.length === 0) return setError("The uploaded CSV file has no valid transactions");
                            
            await writeNewTransactionsBatched(auth.currentUser, transactionDocuments);
            
            setSuccessMsg(`${transactionDocuments.length} transactions have been imported`);
            setTimeout(() => setSuccessMsg(null), 10000);

            fileElement.value = "";
            setAdded(true);
        };

        reader.readAsText(file);
    };

    return <Modal show={show} onHide={() => closeModal(added)}>
        <Modal.Header closeButton>
            <Modal.Title>Upload CSV Transactions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Control data-testid="csvUpload" type="file" id="file" accept=".csv" />
            </Form>

            {successMsg && <Alert variant="success">{successMsg}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => closeModal(added)}>Close</Button>
            <Button variant="primary" onClick={handleUpload}>Upload CSV</Button>
        </Modal.Footer>
    </Modal>
}