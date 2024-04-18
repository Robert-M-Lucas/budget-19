import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import './utils/firebase.ts'
import { Button } from 'react-bootstrap';
import { CSVUpload } from './components/payments/CSVUpload.tsx';
import { InputTransaction } from './components/payments/InputTransaction.tsx';

// import {RouterProvider} from "react-router-dom";
// import {router} from "./router.tsx";

// ! Potentially temporary - UI Styling tbd
import 'bootstrap/scss/bootstrap.scss'

// ReactDOM.createRoot(document.getElementById('root')!).render(
//     <React.StrictMode>
//         <RouterProvider router={router}/>
//     </React.StrictMode>
// )

// TESTING
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Testing />
    </React.StrictMode>
)

function Testing() {
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);

    return <>
        <Button variant="primary" onClick={() => setShow1(true)}>Upload CSV</Button>
        <CSVUpload show={show1} setShow={setShow1} />

        <Button variant="primary" onClick={() => setShow2(true)}>Add Transaction</Button>
        <InputTransaction show={show2} setShow={setShow2} />
    </>
}