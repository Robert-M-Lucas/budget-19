import {Sidebar} from "../../../components/Sidebar.tsx";
import {Footer} from "../../../components/Footer.tsx";

export function SampleSidebar() {
    return <Sidebar>
        <div style={{height: "100vh"}}>
            Example Contents
        </div>
        <Footer/>
    </Sidebar>
}