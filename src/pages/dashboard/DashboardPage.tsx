import {FullscreenCenter} from "../../components/FullscreenCenter.tsx";
import {Link} from "react-router-dom";

function DashboardPage() {
    return (
        <>
            <FullscreenCenter>
                <div className="text-center">
                    <h1>Budget-19 Dashboard</h1>
                    <Link to="/">Home</Link>
                </div>
            </FullscreenCenter>
        </>
    )
}

export default DashboardPage
