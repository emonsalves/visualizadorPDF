import { Link, useRouteError } from "react-router-dom";

export const ErrorPage = () => {
    const error = useRouteError();

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Parece que algo salió mal.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
            <p>
                <Link to="/">Volver a la página de inicio</Link>
            </p>
        </div>
    );
}