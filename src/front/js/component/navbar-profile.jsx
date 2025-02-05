import React, {useState} from "react";
import logo from "../../img/logo-medi-2.png";
import { Link, useNavigate } from "react-router-dom";

export const NavbarProfile = () => {
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate();
    const handleNavigation = (path) => {
        navigate(path);
        setIsOpen(false); // Cierra el menú móvil después de navegar
    };
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light pt-0 pb-0 navbar-principal-classes h-auto">
                <div className="d-flex w-100">
                    <Link to="/" className="nav-content-img">
                            <img src={logo} alt="logo" className="nav-logo" />
                    </Link>
                    <div className={`align-items-center nav-container-items ${ isOpen && 'open'}`}>
                        <ul className="navbar-nav nav_links">
                            <li className="nav-item me-3 nav-text-content">
                                <Link to="/" className="nav-link nav-text " aria-current="page">About us</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/" className="nav-link nav-text">Support</Link>
                            </li>
                            <div className="nav-btn-container-responsive">
                                <Link to="/login" className="btn custom-btn special_margin" onclick={()=> handleNavigation("/login")}>
                                    <p>Login</p>
                                </Link>
                                <Link to="/register" className="btn custom-btn special_margin" type="submit">
                                    <p>Register</p>
                                </Link>
                            </div>
                        </ul>
                        
                    </div>
                    <li className="nav-btn-container">
                        <Link to="/login" className="btn custom-btn special_margin" type="submit">
                            <p>Login</p>
                        </Link>
                        <Link to="/register" className="btn custom-btn special_margin" type="submit">
                            <p>Register</p>
                        </Link>
                    </li>
                    <div className={`nav-toggle ${ isOpen && 'open'}`} onClick={() => setIsOpen(!isOpen)}>
                        <span></span>
                        <span></span>
                        <span className="bar-special-style"></span>
                    </div>
                    
                </div>
            </nav>
        </>
    );
};