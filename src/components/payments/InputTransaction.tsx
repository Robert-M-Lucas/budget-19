import { useState } from "react";
import { Transaction, emojis, formatDate, formatTime } from "./Transaction";
import { FormError, FormSuccess } from "../Messages";

export function InputTransaction() {
    const [name, setName] = useState<string>("");
    const [category, setCategory] = useState<string>("");

    const [amount, setAmount] = useState<string>("");

    const [description, setDescription] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [address, setAddress] = useState<string>("");

    const [error, setError] = useState<string | null>("");
    const [successMsg, setSuccessMsg] = useState<string | null>("");

    function addTransaction(event: React.FormEvent<HTMLInputElement>) {
        event.preventDefault();

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
    
    return <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />

        <br />

        <label htmlFor="category">Category:</label>
        <select id="category" onChange={(e) => setCategory(e.target.value)}>
            <option disabled={true} selected={true} key={0}>Select an option</option>

            {Object.entries(emojis).map(([category, emoji], i) =>  <option value={category} key={i+1}>{emoji} {category}</option>)}
        </select>

        <br />

        <label htmlFor="amount">Amount:</label>
        <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} />

        <br />

        <label htmlFor="description">Description (optional):</label>
        <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />

        <br />

        <label htmlFor="notes">Notes (optional):</label>
        <input type="text" id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />

        <br />

        <label htmlFor="address">Address (optional):</label>
        <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} />

        <br />

        <input type="button" value="Add Transaction" onClick={addTransaction} />
        
        <FormError error={error} />
        <FormSuccess message={successMsg} />
    </div>
}