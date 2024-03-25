interface Props {
    user?: string
}

export function Header({ user }: Props) {
    return <header className="p-3 text-bg-dark">
        <div className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                <div className="col-sm-auto" style={{marginRight:"20px"}}>
                    <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white" style={{textDecoration: "none"}}>
                        <h3 style={{marginBottom:"5px"}}>Header</h3>
                    </a>
                </div>

                <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                    <li><a href="/" className="nav-link px-2 text-white  fw-bold ">Page 1</a></li>

                    <li><a href="/" className="nav-link px-2 text-white ">Page 2</a></li>
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