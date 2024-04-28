import {ReactNode, useState} from "react";
import {CSVUpload, stopDragging} from "../../../components/transactions/CSVUpload.tsx";
import {InputTransaction} from "../../../components/transactions/InputTransaction.tsx";

export default function AddTransactionTile(updateTransactions: () => void): ReactNode {
    const [showCSVModal, setShowCSVModal] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);

    function closeModal(added: boolean, setShow: React.Dispatch<React.SetStateAction<boolean>>) {
        setShow(false);
        if (added) updateTransactions();
    }
    const onCSVModalClose = (added: boolean) => closeModal(added, setShowCSVModal)
    const onTransactionModalClose = (added: boolean) => closeModal(added, setShowTransactionModal)

    return <div className="card w-100 h-100" onPointerDown={showCSVModal || showTransactionModal ? stopDragging : undefined}>
        <CSVUpload show={showCSVModal} closeModal={onCSVModalClose}/>
        <InputTransaction show={showTransactionModal} closeModal={onTransactionModalClose}/>
        <div className="card-header w-100 fw-bold align">Import</div>
        <div className="card-body p-1 align-content-center">
            <button className="btn btn-primary w-100 mb-2" onClick={() => setShowCSVModal(true)}>Upload CSV</button>
            <button className="btn btn-primary w-100" onClick={() => setShowTransactionModal(true)}>Add Transaction</button>
        </div>
    </div>
}