import {createBrowserRouter} from "react-router-dom";
import App from "./pages/index/App.tsx";
import ExampleComponent from "./components/ExampleComponent.tsx";

// ? Routing - see https://reactrouter.com/en/main

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <h1>404</h1>
    },
    {
        path: "/test",
        element: <>
            <h1>Test Secondary Page</h1>
            <ExampleComponent/>
        </>,
    },
]);