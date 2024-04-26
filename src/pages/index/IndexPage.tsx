import {Header} from "../../components/Header.tsx";
import {Footer} from "../../components/Footer.tsx";

import "./IndexPage.scss"
import {Link, useNavigate} from "react-router-dom";
import { signInWithGoogle } from '../../utils/authentication';
import { useState } from "react";

interface IndexPageProps {
    user?: string;
}

function IndexPage({ user }: IndexPageProps) {
    const [currentUser, setCurrentUser] = useState<string | undefined>(user);
    const navigate = useNavigate();

    const handleSignIn = async () => {
        const user = await signInWithGoogle();
        setCurrentUser(user);
        navigate('/dash', { replace: true }); // Redirect to /dash after signing in
    };

    return (<>
        <div className="d-flex vh-100 flex-column">
            {currentUser? (
                <Header user={currentUser} />
            ) : (
                <Header user="" /> // or some other default value
            )}
            <div className="row vw-100" style={{flexGrow: 1, maxWidth: "99vw"}}>
                <div className="col-6 p-0 d-flex justify-content-center align-items-center">
                    <div className="text-center">
                        <h1 className="fw-bold" style={{fontSize: "80px"}}>Budget-19</h1>
                        <p className="text-muted">Budgeting. Made difficult.</p>
                    </div>
                </div>
                <div className="p-0 m-0" style={{
                    position: "absolute",
                    top: "30%",
                    height: "50%",
                    left: "50%",
                    transform: "translate(-50%, 0)",
                    width: "1px",
                    backgroundColor: "grey",
                }}></div>
                <div className="col-6 p-0 d-flex justify-content-center align-items-center">
                    <div className="text-center">
                        <h1 className="pb-2" style={{fontSize: "60px"}}>Login</h1>
                        <div className="row">
                            <div className="col p-2">
                                <button type="button" className="login-with-google-btn" onClick={handleSignIn}>
                                    Sign in with Google
                                </button>
                            </div>
                            <div className="col p-2">
                                <Link to="/login-page">
                                    <button type="button" className="login-with-ms-btn text-nowrap">Sign in with
                                        Microsoft
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </>);
}

export default IndexPage;