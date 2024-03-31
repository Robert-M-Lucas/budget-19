import React from 'react'
import ReactDOM from 'react-dom/client'
import './utils/firebase.ts'
import {RouterProvider} from "react-router-dom";
import {router} from "./router.tsx";

// ! Potentially temporary - UI Styling tbd
import 'bootstrap/scss/bootstrap.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)
