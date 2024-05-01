import { useState } from "react";
import { Transaction, emojis, formatDate, formatTime } from "./Transaction";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { auth } from "../../utils/firebase";
import { writeNewTransaction } from "../../utils/transaction.ts";

export function InputTransaction({ show, closeModal }: { show: boolean, closeModal: (added: boolean) => void }) {
    const [name, setName] = useState<string>("");
    const [category, setCategory] = useState<string>("Income");

    const [amount, setAmount] = useState<string>("");

    const [description, setDescription] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [address, setAddress] = useState<string>("");

    const [date, setDate] = useState<string>("");
    const [time, setTime] = useState<string>("");

    const [error, setError] = useState<string | null>("");
    const [successMsg, setSuccessMsg] = useState<string | null>("");

    const [added, setAdded] = useState<boolean>(false);

    async function addTransaction() {
        setError(null);
        setSuccessMsg(null);

        if (!auth.currentUser) return setError("You are not signed in");

        let curTime = time;
        if (date.trim() !== "" && curTime.trim() === "") curTime = "00:00:00"
        else if (curTime.trim() === "") curTime = formatTime(new Date())

            const transaction = new Transaction()
            .setDate(date.trim() === "" ? formatDate(new Date()) : date)
            .setTime(curTime)
            .setName(name)
            .setEmoji(category ? emojis[category] : undefined)
            .setCategory(category)
            .setAmount(amount)
            .setCurrency("GBP")
            .setNotes(notes)
            .setAddress(address)
            .setDescription(description);
        
        if (!transaction.isValid && transaction.invalidField)  {
            setError(`The inputted ${transaction.invalidField} is invalid`);
            setTimeout(() => setError(null), 7000);
            return;
        }

        await writeNewTransaction(auth.currentUser, transaction.toDocument(auth.currentUser.uid));

        setSuccessMsg("Transaction has been successfully added");
        setTimeout(() => setSuccessMsg(null), 10000);

        setName("");
        setAmount("");
        setDescription("");
        setNotes("");
        setAddress("");
        setDate("");
        setTime("");

        setAdded(true);
    }
    
    return <Modal show={show} onHide={() => closeModal(added)}>
        <Modal.Header closeButton>
            <Modal.Title>Add Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Control type="name" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
                <Form.Control type="name" placeholder="Enter amount (use '-' for expenses, do not include currency)" value={amount} onChange={(e) => setAmount(e.target.value)} />
                <Form.Select onChange={(e) => setCategory(e.target.value)}>
                    {Object.entries(emojis).map(([category, emoji], i) => <option value={category} key={i}>{emoji} {category}</option>)}
                </Form.Select>

                <Form.Control type="name" placeholder="Enter date (DD/MM/YYYY) (optional)" value={date} onChange={(e) => setDate(e.target.value)} />
                <Form.Control type="name" placeholder="Enter time (HH:MM:SS) (optional)" value={time} onChange={(e) => setTime(e.target.value)} />

                <Form.Control as="textarea" rows={3} placeholder="Enter Description (optional)" onChange={(e) => setDescription(e.target.value)} />
                <Form.Control as="textarea" rows={3} placeholder="Enter Notes (optional)" onChange={(e) => setNotes(e.target.value)} />
                <Form.Control as="textarea" rows={3} placeholder="Enter Address (optional)" onChange={(e) => setAddress(e.target.value)} />
            </Form>

            {successMsg && <Alert variant="success">{successMsg}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => closeModal(added)}>Close</Button>
            <Button variant="primary" onClick={addTransaction}>Add Transaction</Button>
        </Modal.Footer>
    </Modal>
}