import { useState } from "react";
import { Transaction, emojis, formatDate, formatTime } from "./Transaction";
import { Button, Modal, Form, Alert } from "react-bootstrap";

export function InputTransaction({ show, setShow}: { show: boolean, setShow: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [name, setName] = useState<string>("");
    const [category, setCategory] = useState<string>("Income");

    const [amount, setAmount] = useState<string>("");

    const [description, setDescription] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [address, setAddress] = useState<string>("");

    const [error, setError] = useState<string | null>("");
    const [successMsg, setSuccessMsg] = useState<string | null>("");

    function addTransaction() {
        setError(null);
        setSuccessMsg(null);

        const date = new Date();

        const transaction = new Transaction()
            .setDate(formatDate(date))
            .setTime(formatTime(date))
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

        // -------------------------------------------------------------------------------------
        // TODO: STORE "transaction" IN THE DATABASE
        // -------------------------------------------------------------------------------------

        setSuccessMsg("Transaction has been successfully added");
        setTimeout(() => setSuccessMsg(null), 10000);

        setName("");
        setCategory("");
        setAmount("");
        setDescription("");
        setNotes("");
        setAddress("");
    }
    
    return <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Add Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Control type="name" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
                <Form.Control type="name" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                <Form.Select onChange={(e) => setCategory(e.target.value)}>
                    {Object.entries(emojis).map(([category, emoji], i) =>  <option value={category} key={i}>{emoji} {category}</option>)}
                </Form.Select>

                <Form.Control as="textarea" rows={3} placeholder="Enter Description (optional)" onChange={(e) => setDescription(e.target.value)} />
                <Form.Control as="textarea" rows={3} placeholder="Enter Notes (optional)" onChange={(e) => setNotes(e.target.value)} />
                <Form.Control as="textarea" rows={3} placeholder="Enter Address (optional)"onChange={(e) => setAddress(e.target.value)} />
            </Form>

            {successMsg && <Alert variant="success">{successMsg}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
            <Button variant="primary" onClick={addTransaction}>Add Transaction</Button>
        </Modal.Footer>
    </Modal>
}