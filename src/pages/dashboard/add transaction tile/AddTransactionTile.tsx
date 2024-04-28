import {ReactNode, useState} from "react";
import {CSVUpload} from "../../../components/transactions/CSVUpload.tsx";
import {InputTransaction} from "../../../components/transactions/InputTransaction.tsx";

export default function AddTransactionTile(updateTransactions: () => void): ReactNode {
    const [showCSVModal, setShowCSVModal] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);

    const onCSVModalClose = () => {
        setShowCSVModal(false);
        updateTransactions();
    };

    const onTransactionModalClose = () => {
        setShowTransactionModal(false);
        updateTransactions();
    }

    return <>
        <CSVUpload show={showCSVModal} closeModal={onCSVModalClose}/>
        <InputTransaction show={showTransactionModal} closeModal={onTransactionModalClose}/>
        <button onClick={() => setShowCSVModal(true)}>Upload CSV</button>
        <button onClick={() => setShowTransactionModal(true)}>Add Transaction</button>
    </>
}