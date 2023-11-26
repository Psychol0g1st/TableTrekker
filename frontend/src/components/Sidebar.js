import {ReactComponent as Logo} from '../icons/LOGO.svg'


export default function Sidebar() {
    return(
        <ul className="nav flex-column ">
            <a className="nav-brand" href="/"><Logo/></a>
            <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/employees">
                    <button type="button" class="btn btn-secondary">Dolgozók</button>
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="/animals">
                    <button type="button" class="btn btn-secondary">Állatok</button>
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="/cages">
                    <button type="button" class="btn btn-secondary">Ketrecek</button>
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="/species">
                    <button type="button" class="btn btn-secondary">Állatfajok</button>
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="/animaldiets">
                    <button type="button" class="btn btn-secondary">Étrend kezelés</button>
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="/login">
                    <button type="button" class="btn btn-secondary">Bejelentkezés</button>
                </a>
            </li>
        </ul>
    )
}