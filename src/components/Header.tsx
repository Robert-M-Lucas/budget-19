import useWindowDimensions from "../hooks/WindowDimensionsHook.tsx";
import "../assets/css/Header.css"
import {Link, useNavigate} from "react-router-dom";
import {auth} from "../utils/firebase.ts";

interface Props {
    user?: string;
    children?: React.ReactNode;
}

export function Header({ user }: Props) {
    const { width, height } = useWindowDimensions();
    const aspect_ratio = (width == 0? 1 : width) / (height == 0? 1 : height);
    const use_narrow = aspect_ratio < 0.7;

    const currentUser = auth.currentUser?.displayName?? "";

    const navigate = useNavigate();

    const handleLogout = () => {
        auth.signOut();
        navigate("/", { replace: true });
    };

    return (
        <header className="header">
            {/* App Name reloads home page */}
            <a href="/" className="site-title">
                <h3>{use_narrow? "B-19" : "Budget-19"}</h3>
            </a>

            {/* Pages */}
            <ul className="header-nav">
                {/* Links to dashboard with tiles */}
                <li><Link to="/dash" className="header-item">Dashboard</Link></li>

                {/* Links to transactions page with table of expenses */}
                <li><Link to="/transactions" className="header-item">Transactions</Link></li>

                <li><Link to="/test" className="header-item">Firestore Test</Link></li>

                {user && (
                    <li>
                        <span className="username">{currentUser}</span>
                        <button type="button" className="logout-btn" onClick={handleLogout}>Logout</button>
                    </li>
                )}
            </ul>
        </header>
    );
}