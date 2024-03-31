import {Sidebar} from "../../../components/Sidebar.tsx";
import {Header} from "../../../components/Header.tsx";
import {Footer} from "../../../components/Footer.tsx";

export function SampleSidebarHeader() {
    return <>
        <Header/>
        <Sidebar>
            <div style={{height: "100vh"}}>
                Sample Content
            </div>
            <Footer/>
        </Sidebar>
    </>
}