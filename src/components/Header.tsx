import "./Header.css";
import {Link} from "react-router-dom";

type HeaderProps = {
    title: string;
}

function Header({title}: HeaderProps) {
    return(
        <header>
        <div className="container">
            <h1>{title}</h1>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/logout">Logout</Link>
            </nav>

        </div>
        </header>
    );
}

export default Header;