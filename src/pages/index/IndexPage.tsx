import {FullscreenCenter} from "../../components/FullscreenCenter.tsx";
import {Link} from "react-router-dom";
import {Header} from "../../components/Header.tsx";
import {Footer} from "../../components/Footer.tsx";

function IndexPage() {
  return (
      <>
          <Header/>
          <FullscreenCenter>
              <div className="text-center">
                  <h1>Budget-19 Home Page</h1>
                  <p><Link to="/dash">Dash</Link>•<Link to="/dash-2">With column</Link>•<Link to="/dash-3">With lots of tiles</Link>•<Link to="/dash-4">With weird stuff</Link></p>
              </div>
          </FullscreenCenter>
          <Footer/>
      </>
)
}

export default IndexPage
