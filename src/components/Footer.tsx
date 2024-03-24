export function Footer() {
    return <footer className="py-3 my-4">
        <hr/>
        <ul className="nav justify-content-center pb-3 mb-3">
            <li className="nav-item"><a href="/" className="nav-link px-2 text-muted">Home</a></li>
            <li className="nav-item"><a href="/index#contact" className="nav-link px-2 text-muted">Contact</a></li>
            <li className="nav-item"><a href="/projects" className="nav-link px-2 text-muted">Projects</a></li>
        </ul>
        <p className="text-center text-muted">© 2024 Group 19 Inc.</p>
    </footer>;
}