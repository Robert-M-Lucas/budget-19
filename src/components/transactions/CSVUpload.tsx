import { useState } from "react";
import { Transaction } from "./Transaction";
import { Alert, Button, Form, Modal } from "react-bootstrap";

export function CSVUpload({ show, setShow }: { show: boolean, setShow: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [error, setError] = useState<string | null>();
    const [successMsg, setSuccessMsg] = useState<string | null>();

    const reader = new FileReader();

    function handleUpload() {
        setError(null);
        setSuccessMsg(null);
        
        const fileElement = document.getElementById("file") as HTMLInputElement | null;
        if (!fileElement || fileElement.files?.length === 0) return setError("You haven't uploaded a CSV file");

        const file = fileElement.files![0]; 
        if (!file) return setError("You haven't uploaded a CSV file");
    
        reader.onload = (event) => {
            const csvContent = event.target?.result;
            if (!csvContent || csvContent instanceof ArrayBuffer) return setError("Unable to read uploaded CSV file");

            const rows = csvContent
                .split("\n")
                .slice(1)
                .map((row) => row.split(","));

            const transactions = rows
                .filter((row) => row[3] === "Card payment" || row[3] === "Faster payment") // filter by type
                .map((row) => new Transaction().fromRow(row));

            const validTransactions = transactions.filter((transaction) => transaction.isValid);
            if (validTransactions.length === 0) return setError("The uploaded CSV file has no valid transactions");
                
            // -------------------------------------------------------------------------------------
            // TODO: STORE "validTransactions" IN THE DATABASE
            // -------------------------------------------------------------------------------------
            
            setSuccessMsg(`${validTransactions.length} valid transactions have been imported out of ${transactions.length} total transactions`);
            setTimeout(() => setSuccessMsg(null), 10000);

            fileElement.value = "";
        };

        reader.readAsText(file);
    };

    return <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Upload CSV Transactions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Control type="file" id="file" accept=".csv" />
            </Form>

            {successMsg && <Alert variant="success">{successMsg}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
            <Button variant="primary" onClick={handleUpload}>Upload CSV</Button>
        </Modal.Footer>
    </Modal>
}