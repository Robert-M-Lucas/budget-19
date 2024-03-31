import {Sidebar} from "../../../components/Sidebar.tsx";
import {Header} from "../../../components/Header.tsx";
import {Footer} from "../../../components/Footer.tsx";
import {Modal} from "../../../components/Modal.tsx";
import {useState} from "react";

export function SampleModal() {
    const [show, setShow] = useState(false);

    return <>
        <Modal show={show}/>
        <Header/>
        <Sidebar>
            <button type="button" className="btn btn-primary" onClick={() => setShow(!show)}>
                Launch demo modal
            </button>
            <Footer/>
        </Sidebar>
    </>
}