import {createBrowserRouter} from "react-router-dom";
import App from "./App.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <h1>404</h1>
    },
    {
        path: "/test",
        element: <h1>Test Secondary Page</h1>,
    },
]);