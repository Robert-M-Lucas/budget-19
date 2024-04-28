import {ReactNode, useState} from "react";
import {CSVUpload} from "../../../components/transactions/CSVUpload.tsx";
import {InputTransaction} from "../../../components/transactions/InputTransaction.tsx";

export default function AddTransactionTile(): ReactNode {
    const [showCSVModal, setShowCSVModal] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);

    return <>
        <CSVUpload show={showCSVModal} setShow={setShowCSVModal}/>
        <InputTransaction show={showTransactionModal} setShow={setShowTransactionModal}/>
        <button onClick={() => setShowCSVModal(true)}>Upload CSV</button>
        <button onClick={() => setShowTransactionModal(true)}>Add Transaction</button>
    </>
}