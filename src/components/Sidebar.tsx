import {ReactNode} from "react";
import useWindowDimensions from "../hooks/WindowHooks.tsx";

// ? From https://getbootstrap.com/docs/5.0/examples/sidebars/

interface Props {
    children: ReactNode
}

export function Sidebar({ children }: Props) {
    const {width, height} = useWindowDimensions();
    const aspect_ratio = (width == 0 ? 1 : width) / (height == 0 ? 1 : height);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const use_narrow = aspect_ratio < 1.5;

    return <div className="row flex-grow-1" style={{marginRight: "0", minHeight: "0"}}>
        <div className={"col-2 d-flex flex-column flex-shrink-0 p-3 text-dark border-end"} style={{minHeight: "0"}}>
            <a href="/public" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
                <img src="https://picsum.photos/30/30" style={{marginRight: "10px", width: "30px", height: "30px"}}/>
                <span className="fs-4">{use_narrow ? "Narrow" : "Sidebar"}</span>
            </a>
            <hr/>
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <a href="#" className="nav-link active" aria-current="page">
                        <div className="bi me-2" style={{display: "inline", width: "16px", height: "16px"}}>
                            <img src="https://picsum.photos/16/16"/>
                        </div>
                        Lorem Ipsum
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link text-dark">
                        <div className="bi me-2" style={{display: "inline", width: "16px", height: "16px"}}>
                            <img src="https://picsum.photos/16/16"/>
                        </div>
                        Lorem Ipsum
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link text-dark">
                        <div className="bi me-2" style={{display: "inline", width: "16px", height: "16px"}}>
                            <img src="https://picsum.photos/16/16"/>
                        </div>
                        Lorem Ipsum
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link text-dark">
                        <div className="bi me-2" style={{display: "inline", width: "16px", height: "16px"}}>
                            <img src="https://picsum.photos/16/16"/>
                        </div>
                        Lorem Ipsum
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link text-dark">
                        <div className="bi me-2" style={{display: "inline", width: "16px", height: "16px"}}>
                            <img src="https://picsum.photos/16/16"/>
                        </div>
                        Lorem Ipsum
                    </a>
                </li>
            </ul>
            <hr/>
            <div className="dropdown">
                <a href="#" className="d-flex align-items-center text-dark text-decoration-none dropdown-toggle"
                   id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2"/>
                    <strong>mdo</strong>
                </a>
                <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                    <li><a className="dropdown-item" href="#">New project...</a></li>
                    <li><a className="dropdown-item" href="#">Settings</a></li>
                    <li><a className="dropdown-item" href="#">Profile</a></li>
                    <li>
                        <hr className="dropdown-divider"/>
                    </li>
                    <li><a className="dropdown-item" href="#">Sign out</a></li>
                </ul>
            </div>
        </div>
        <div className="col-10 overflow-auto" style={{minHeight: "0", height: "100%"}}>
            {children}
        </div>
    </div>
}