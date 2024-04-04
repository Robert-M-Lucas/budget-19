import {FullscreenCenter} from "../../components/FullscreenCenter.tsx";
import {useNavigate} from "react-router-dom";

function _404Page() {
    const navigate = useNavigate();

    return (
        <>
            <FullscreenCenter>
                <div className="text-center">
                    <h1>404 - Not Found</h1>
                    <p style={{color: "grey"}}>
                        <b><a style={{textDecoration: "none"}} href="/"
                              onClick={() => navigate(-1)}>Back</a></b> ● <b><a
                        style={{textDecoration: "none"}} href="/">Home</a></b>
                    </p>
                </div>
            </FullscreenCenter>
        </>
    )
}

export default _404Page
