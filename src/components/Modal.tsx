import {ReactNode} from "react";

interface Props {
    show: boolean,
    children: ReactNode
}

export function Modal({show, children}: Props) {
    return <div className="modal" tabIndex={-1} style={{display: show ? "inherit" : "none"}}>
        <div className="modal-dialog">
            {children}
        </div>
    </div>;
}