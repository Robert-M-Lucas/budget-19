import {Sidebar} from "../../../components/Sidebar.tsx";
import {Header} from "../../../components/Header.tsx";
import {Footer} from "../../../components/Footer.tsx";
import {Modal} from "../../../components/Modal.tsx";
import {useState} from "react";

export function SampleModal() {
    const [show, setShow] = useState(false);

    return <>
        <Modal show={show}>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Modal title</h5>
                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setShow(false)}></button>
                </div>
                <div className="modal-body">
                    <p>Modal body text goes here.</p>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShow(false)}>Close</button>
                    <button type="button" className="btn btn-primary">Save changes</button>
                </div>
            </div>
        </Modal>

        <Header/>
        <Sidebar>
            <div className="container mt-5">
                <button type="button" className="btn btn-primary" onClick={() => setShow(!show)}>
                    Launch demo modal ({show ? "shown" : "hidden"})
                </button>
            </div>
            <Footer/>
        </Sidebar>
    </>
}