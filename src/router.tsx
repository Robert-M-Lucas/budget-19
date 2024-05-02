import {createBrowserRouter} from "react-router-dom";
import DashboardPage from "./pages/dashboard/DashboardPage.tsx";
import _404Page from "./pages/404/404.tsx";
import IndexPage from "./pages/index/IndexPage.tsx";
// import {SampleSidebar} from "./pages/samples/sidebar/SampleSidebar.tsx";
// import {SampleSidebarHeader} from "./pages/samples/sidebar_header/SampleSidebarHeader.tsx";
// import {SampleModal} from "./pages/samples/modal/SampleModal.tsx";
// import GraphDashboard from "./pages/dashboard/DashboardPage.tsx";
// import {TestFirestorePage} from "./pages/test firestore/TestFirestore.tsx";
import {TransactionPage} from "./pages/transactions/TransactionPage.tsx";

// ? Routing - see https://reactrouter.com/en/main

export const router = createBrowserRouter([
    {
        path: "/",
        element: <IndexPage />,
        errorElement: <_404Page/>
    },
    {
        path: "/dash",
        element: <DashboardPage/>,
    },
    {
        path: "/transactions",
        element: <TransactionPage/>,
    },
    // {
    //     path: "/user-tiles",
    //     element: <IndexPage/>,
    //     errorElement:<_404Page/>
    // },
    // {
    //     path: "/graphs",
    //     element: <GraphDashboard />,
    // },
    // {
    //     path: "/sample_sidebar",
    //     element: <SampleSidebar/>,
    // },
    // {
    //     path: "/sample_sidebar_header",
    //     element: <SampleSidebarHeader/>,
    // },
    // {
    //     path: "/sample_modal",
    //     element: <SampleModal/>,
    // },
    // {
    //     path: "/tiles",
    //     element: <TestFirestorePage/>,
    // },
]);