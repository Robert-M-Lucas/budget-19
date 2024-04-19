import useWindowDimensions from "../hooks/WindowDimensionsHook.tsx";
import "../assets/css/Header.css"

interface Props {
    user?: string
}

export function Header({user} : Props) {
    const {width, height} = useWindowDimensions();
    const aspect_ratio = (width == 0 ? 1 : width) / (height == 0 ? 1 : height);
    const use_narrow = aspect_ratio < 0.7;

    return <header className="header">

                {/*App Name reloads home page*/}
                    <a href="/" className="site-title">
                        <h3>{use_narrow ? "B-19" : "Budget-19"}</h3>
                    </a>

                {/*Pages*/}
                <ul className="header-nav">

                    {/*Links to dashboard with tiles*/}
                    <li><a href="/dash" className="header-item">Dashboard</a></li>

                    {/*Links to transactions page with table of expenses*/}
                    <li><a href="/transactions" className="header-item">Transactions</a></li>

                    <li>{user}</li>
                </ul>
    </header>;
}