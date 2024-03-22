import {ReactNode} from "react";

interface Props {
    children: ReactNode
}

export function FullscreenCenter({ children }: Props) {
    return <div style={{width: "100vw", height: "100vh"}} className="d-flex">
        <div className="d-flex justify-content-center align-items-center" style={{width: "100vw"}}>
            {children}
        </div>
    </div>;
}