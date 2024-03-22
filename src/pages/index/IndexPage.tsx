import {FullscreenCenter} from "../../components/FullscreenCenter.tsx";
import {Link} from "react-router-dom";

function IndexPage() {
  return (
      <>
          <FullscreenCenter>
              <div className="text-center">
                  <h1>Budget-19 Home Page</h1>
                  <Link to="/dash">Dash</Link>
              </div>
          </FullscreenCenter>
      </>
)
}

export default IndexPage
