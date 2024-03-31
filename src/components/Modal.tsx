import {ReactNode} from "react";

interface Props {
    show: boolean,
    children: ReactNode
}

export function Modal({show, children}: Props) {
    return <div className="modal"
                tabIndex={-1}
                style={{display: show ? "inherit" : "none", backgroundColor: "rgba(0, 0, 0, 0.2)"}}
                onClick={() => console.log("click!")}
    >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            {children}
        </div>
    </div>;
}