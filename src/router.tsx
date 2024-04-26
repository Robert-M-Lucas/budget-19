import {createBrowserRouter} from "react-router-dom";
import DashboardPage from "./pages/dashboard/DashboardPage.tsx";
import _404Page from "./pages/404/404.tsx";
import IndexPage from "./pages/index/IndexPage.tsx";
import {SampleSidebar} from "./pages/samples/sidebar/SampleSidebar.tsx";
import {SampleSidebarHeader} from "./pages/samples/sidebar_header/SampleSidebarHeader.tsx";
import {SampleModal} from "./pages/samples/modal/SampleModal.tsx";
import GraphDashboard from "./pages/Graphs/Graphs.tsx";
import {TestFirestorePage} from "./pages/test firestore/TestFirestore.tsx";

// ? Routing - see https://reactrouter.com/en/main

// const tileset_defult: Array<{ text: string; rows: number; cols: number }> = [
//     { text: "Tile 1", cols: 1, rows: 1 },
//     { text: "Tile 2", cols: 1, rows: 1 },
//     { text: "Tile 3", cols: 2, rows: 2 },
//     { text: "Tile 4", cols: 2, rows: 2 },
//     { text: "Tile 5", cols: 1, rows: 1 },
//     { text: "Tile 6", cols: 1, rows: 1 },
//     { text: "Tile 7", cols: 1, rows: 1 },
//     { text: "Tile 8", cols: 1, rows: 1 },
//     { text: "Tile 9", cols: 2, rows: 1 },
// ];

const tileset_column: Array<{ text: string; rows: number; cols: number }> = [
    { text: "Tile 1", cols: 1, rows: 1 },
    { text: "Tile 2", cols: 1, rows: 2 },
    { text: "Tile 3", cols: 2, rows: 2 },
    { text: "Tile 4", cols: 2, rows: 2 },
    { text: "Tile 5", cols: 1, rows: 1 },
    { text: "Tile 6", cols: 1, rows: 1 },
    { text: "Tile 7", cols: 1, rows: 1 },
    { text: "Tile 8", cols: 1, rows: 1 },
    { text: "Tile 9", cols: 2, rows: 1 },
];

const tileset_many: Array<{ text: string; rows: number; cols: number }> = [
    { text: "Tile 1", cols: 1, rows: 1 },
    { text: "Tile 2", cols: 2, rows: 1 },
    { text: "Tile 3", cols: 2, rows: 2 },
    { text: "Tile 4", cols: 2, rows: 2 },
    { text: "Tile 5", cols: 1, rows: 1 },
    { text: "Tile 6", cols: 1, rows: 1 },
    { text: "Tile 7", cols: 1, rows: 1 },
    { text: "Tile 8", cols: 1, rows: 1 },
    { text: "Tile 9", cols: 2, rows: 1 },
    { text: "Tile 11", cols: 1, rows: 1 },
    { text: "Tile 12", cols: 2, rows: 1 },
    { text: "Tile 13", cols: 2, rows: 2 },
    { text: "Tile 14", cols: 2, rows: 2 },
    { text: "Tile 15", cols: 1, rows: 1 },
    {text: "Tile 16", cols: 1, rows:1 },
    { text: "Tile 17", cols: 1, rows: 1 },
    { text: "Tile 18", cols: 1, rows: 1 },
    { text: "Tile 19", cols: 2, rows: 1 },
    { text: "Tile 21", cols: 1, rows: 1 },
    { text: "Tile 22", cols: 2, rows: 1 },
    { text: "Tile 23", cols: 2, rows: 2 },
    { text: "Tile 24", cols: 2, rows: 2 },
    { text: "Tile 25", cols: 1, rows: 1 },
    { text: "Tile 26", cols: 1, rows: 1 },
    { text: "Tile 27", cols: 1, rows: 1 },
    { text: "Tile 28", cols: 1, rows: 1 },
    { text: "Tile 29", cols: 2, rows: 1 },
    { text: "Tile 31", cols: 1, rows: 1 },
    { text: "Tile 32", cols: 2, rows: 1 },
    { text: "Tile 33", cols: 2, rows: 2 },
    { text: "Tile 34", cols: 2, rows: 2 },
    { text: "Tile 35", cols: 1, rows: 1 },
    { text: "Tile 36", cols: 1, rows: 1 },
    { text: "Tile 37", cols: 1, rows: 1 },
    { text: "Tile 38", cols: 1, rows: 1 },
    { text: "Tile 39", cols: 2, rows: 1 },
];

const tileset_weird: Array<{ text: string; rows: number; cols: number }> = [
    { text: "Tile 1", cols: 1, rows: 3 },
    { text: "Tile 2", cols: 2, rows: 3 },
    { text: "Tile 3", cols: 3, rows: 2 },
    { text: "Tile 4", cols: 3, rows: 2 },
    { text: "Tile 5", cols: 3, rows: 1 },
    { text: "Tile 6", cols: 1, rows: 1 },
    { text: "Tile 7", cols: 1, rows: 1 },
    { text: "Tile 8", cols: 1, rows: 1 },
    { text: "Tile 9", cols: 2, rows: 1 },
    { text: "Tile 11", cols: 1, rows: 1 },
    { text: "Tile 12", cols: 2, rows: 1 },
    { text: "Tile 13", cols: 2, rows: 2 },
    { text: "Tile 14", cols: 2, rows: 2 },
    { text: "Tile 15", cols: 1, rows: 1 },
    { text: "Tile 16", cols: 1, rows: 1 },
    { text: "Tile 17", cols: 3, rows: 3 },
    { text: "Tile 18", cols: 1, rows: 1 },
    { text: "Tile 19", cols: 2, rows: 1 },
];

export const router = createBrowserRouter([
    {
        path: "/",
        element: <IndexPage />,
        errorElement: <_404Page/>
    },
    {
        path: "/dash",
        element: <DashboardPage tiles={tileset_many}/>,
    },
    {
        path: "/transactions",
        element: <SampleModal/>,
    },
    // -->


    {
        path: "/user-test",
        element: <IndexPage user={"testUserName"}/>,
        errorElement:<_404Page/>
    },
    {
        path: "/graphs",
        element: <GraphDashboard />,
    },
    {
        path: "/dash-2",
        element: <DashboardPage tiles={tileset_column}/>,
    },
    {
        path: "/dash-3",
        element: <DashboardPage tiles={tileset_many}/>,
    },
    {
        path: "/dash-4",
        element: <DashboardPage tiles={tileset_weird}/>,
    },
    {
        path: "/sample_sidebar",
        element: <SampleSidebar/>,
    },
    {
        path: "/sample_sidebar_header",
        element: <SampleSidebarHeader/>,
    },
    {
        path: "/sample_modal",
        element: <SampleModal/>,
    },
    {
        path: "/test",
        element: <TestFirestorePage/>,
    },
]);