import {FullscreenCenter} from "../../components/FullscreenCenter.tsx";

function _404Page() {
    return (
        <>
            <FullscreenCenter>
                <div className="text-center">
                    <h1>404 - Not Found</h1>
                    <p style={{color: "grey"}}>
                        <b><a style={{textDecoration: "none"}} href="/"
                              onClick={() => window.history.back()}>Back</a></b> ● <b><a
                        style={{textDecoration: "none"}} href="/">Home</a></b>
                    </p>
                </div>
            </FullscreenCenter>
        </>
    )
}

export default _404Page
