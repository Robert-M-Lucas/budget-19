import useWindowDimensions from "../hooks/WindowDimensionsHook.tsx";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase.ts";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import "../assets/css/Header.css"

export function Header() {
    const { width, height } = useWindowDimensions();
    const aspect_ratio = (width == 0 ? 1 : width) / (height == 0 ? 1 : height);
    const use_narrow = aspect_ratio < 0.7;

    const navigate = useNavigate();
    
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!auth.currentUser?.uid);
    // displayName is optional, an account may not have a displayName but is logged in
    const [displayName, setDisplayName] = useState<string | null | undefined>(auth.currentUser?.displayName);

    // only attach the event listener once, otherwise we get an infinite loop
    useEffect(() => {
        auth.onAuthStateChanged((user: User | null) => {
            setIsLoggedIn(!!user?.uid);
            setDisplayName(user?.displayName);
        });
    }, []);

    async function handleLogout() {
        await auth.signOut();

        navigate("/", { replace: true });
    }

    return <header className="header">
        {/* App Name reloads home page */}
        <h3><Link to="/">{use_narrow ? "B-19" : "Budget-19"}</Link></h3>

        {/* Pages */}
        <ul className="header-nav">
            {/* Links to dashboard with tiles */}
            <li><Link to="/dash" className={`header-item ${isLoggedIn ? "header-item" : "text-muted bg-transparent"}`}>Dashboard</Link></li>

            {/* Links to transactions page with table of expenses */}
            <li><Link to="/transactions" className={`header-item ${isLoggedIn ? "header-item" : "text-muted bg-transparent"}`}>Transactions</Link></li>

            {/*<li><Link to="/tiles" className="header-item">Firestore Test</Link></li>*/}

            {displayName && <li><span className="username">{displayName}</span></li>}

            {isLoggedIn && <li><button type="button" className="logout-btn" onClick={handleLogout}>Logout</button></li>}
        </ul>
    </header>
}