import {createBrowserRouter} from "react-router-dom";
import IndexPage from "./pages/index/IndexPage.tsx";
import DashboardPage from "./pages/dashboard/DashboardPage.tsx";
import _404Page from "./pages/404/404.tsx";

// ? Routing - see https://reactrouter.com/en/main

export const router = createBrowserRouter([
    {
        path: "/",
        element: <IndexPage/>,
        errorElement: <_404Page/>
    },
    {
        path: "/dash",
        element: <DashboardPage/>,
    },
]);