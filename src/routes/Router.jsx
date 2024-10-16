import { createBrowserRouter, Navigate } from "react-router-dom";
import { Visualizador, Home, ErrorPage } from "../pages";
import { LayoutPublic, LayoutPrivate } from "../layouts";

export const Router = createBrowserRouter([
    {
        path: "/",
        element: <LayoutPublic />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />,
            },
        ],
    },
    {
        path: "/auth/",
        element: <LayoutPrivate />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <ErrorPage /> || <Navigate to="visualizador" />,
            },
            {
                path: "visualizador",
                element: <Visualizador />,
            }
        ],
    },
]);