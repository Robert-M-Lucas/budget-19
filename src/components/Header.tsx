import useWindowDimensions from "../hooks/WindowDimensionsHook.tsx";

interface Props {
    user?: string
}

export function Header({ user }: Props) {
    const {width, height} = useWindowDimensions();
    const aspect_ratio = (width == 0 ? 1 : width) / (height == 0 ? 1 : height);
    const use_narrow = aspect_ratio < 1.3;

    return <header className="p-3 text-bg-dark">

        <div className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">

                {/*App Name reloads home page*/}
                <div className="col-sm-auto" style={{marginRight:"20px"}}>
                    <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white" style={{textDecoration: "none"}}>
                        <h3 style={{marginBottom:"0", textAlign:"center"}}>{use_narrow ? "Narrow" : "Budget19"}</h3>
                    </a>
                </div>

                {/*Pages*/}
                <ul className={"nav " + (use_narrow ? "me-3 " : "col-12 ") + "col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0"}>

                    {/*Links to dashboard with tiles*/}
                    <li><a href="/dash" className="nav-link px-2 text-white">Dashboard</a></li>

                    {/*Links to transactions page with table of expenses*/}
                    <li><a href="/transactions" className="nav-link px-2 text-white">Transactions</a></li>

                </ul>

                <div className="text-end">
                    {user ?
                        <>
                            <label className="label fw-bold text-white" style={{marginRight: "10px"}}>{user}</label>
                            <a href="/">
                                <button type="button" className="btn btn-outline-light me-2">Logout</button>
                            </a>
                        </>
                        :
                        <a href="/user-test">
                        <button type="button" className="btn btn-light me-2">Login</button>
                        </a>
                    }
                </div>
            </div>
        </div>
    </header>;
}