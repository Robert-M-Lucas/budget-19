import {Link} from "react-router-dom";

export function Footer() {
    return <footer className="pt-3 mt-4">
        <hr className="my-0 w-100"/>

        <div style={{padding: "2.75rem 0"}}>
            <ul className="nav justify-content-center pt-0 mt-0 pb-3 mb-3">
                <li className="nav-item"><Link to="/" className="nav-link px-2 text-muted py-0">Home</Link></li>
                <li className="nav-item"><Link to="/dash" className="nav-link px-2 text-muted py-0">Dashboard</Link></li>
                <li className="nav-item"><Link to="#" className="nav-link px-2 text-muted py-0" onClick={() => window.scrollTo(0, 0)}>Top</Link></li>
            </ul>
            <p className="text-center text-muted mb-0">Budget-19 © 2024 Group 19 Inc.</p>
        </div>
    </footer>;
}