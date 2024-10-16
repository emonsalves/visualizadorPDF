import { Link } from "react-router-dom"

export const Home = () => {
    return (
        <div>
            <h1>Home</h1>
            <p>Esta es la página de inicio de la aplicación.</p>
            <ul>
                <li>Para ver el visualizador, navega a <Link to="/auth/visualizador">Visualizador1</Link></li>
            </ul>
        </div>
    )
}