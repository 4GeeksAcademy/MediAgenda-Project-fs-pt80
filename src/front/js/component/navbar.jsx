import React, { useContext, useState } from "react";
import logo from "../../img/logo-medi-2.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.js"

export const Navbar = () => {
    const {store, actions} = useContext(Context)
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate();
    const handleLogout = () => {
        actions.logout();  
        navigate("/login"); 
    };
    const location = useLocation();

    const handleNavigation = (path) => {
        navigate(path);
        setIsOpen(false); // Cierra el menú móvil después de navegar
    };

    const isProfilePage = location.pathname === "/profile";
    const isLoginPage = location.pathname === "/login";
    const isRegisterPage = location.pathname === "/register";
    const isManageAvPage = location.pathname === "/book_appointment";
    const ProfileNavbar = () => (
        <nav className="navbar navbar-expand-lg navbar-light pt-0 pb-0 navbar-profile ">
            <div className={`d-flex w-100 ${window.innerWidth > 768 ? "container" : ""}`}>
                <Link to="/" className="nav-content-img">
                    <img src={logo} alt="logo" className="nav-logo" />
                </Link>
                <div className={`align-items-center nav-container-items ${isOpen && "open"}`}>
                    <ul className="navbar-nav nav_links">
                        <div className="nav-btn-container-responsive">
                            <div  className="btn custom-btn special_margin" onClick={handleLogout}>
                                <p>Logout</p>
                            </div>
                        </div>
                    </ul>
                </div>
                <li className="nav-btn-container">
                    <div className="btn custom-btn special_margin" onClick={handleLogout}>
                        <p>Logout</p>
                    </div>
                </li>
                <div className={`nav-toggle ${isOpen && "open"}`} onClick={() => setIsOpen(!isOpen)}>
                    <span></span>
                    <span></span>
                    <span className="bar-special-style"></span>
                </div>
            </div>
        </nav>
    );

    const LoginNav = () => (
        <nav className="navbar navbar-expand-lg navbar-light pt-0 pb-0 navbar-login ">
            <div className={`d-flex w-100 ${window.innerWidth > 768 ? "container" : ""}`}>
                <Link to="/" className="nav-content-img">
                    <img src={logo} alt="logo" className="nav-logo" />
                </Link>
                <div className={`align-items-center nav-container-items ${isOpen && "open"}`}>
                    <ul className="navbar-nav nav_links">
                        <li className="nav-item me-3 nav-text-content">
                            <Link to="/" className="nav-link nav-text" aria-current="page">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item me-3 nav-text-content">
                            <Link to="/" className="nav-link nav-text" aria-current="page">
                                About us
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/" className="nav-link nav-text">
                                Support
                            </Link>
                        </li>
                        <div className="nav-btn-container-responsive">
                            <Link to="/register" className="btn custom-btn special_margin" type="submit">
                                <p>Register</p>
                            </Link>
                        </div>
                    </ul>
                </div>
                <li className="nav-btn-container">
                    <Link to="/register" className="btn custom-btn special_margin" type="submit">
                        <p>Register</p>
                    </Link>
                </li>
                <div className={`nav-toggle ${isOpen && "open"}`} onClick={() => setIsOpen(!isOpen)}>
                    <span></span>
                    <span></span>
                    <span className="bar-special-style"></span>
                </div>
            </div>
        </nav>
    );

    const RegisterNav = () => (
        <nav className="navbar navbar-expand-lg navbar-light pt-0 pb-0 navbar-login ">
            <div className={`d-flex w-100 ${window.innerWidth > 768 ? "container" : ""}`}>
                <Link to="/" className="nav-content-img">
                    <img src={logo} alt="logo" className="nav-logo" />
                </Link>
                <div className={`align-items-center nav-container-items ${isOpen && "open"}`}>
                    <ul className="navbar-nav nav_links">
                        <li className="nav-item me-3 nav-text-content">
                            <Link to="/" className="nav-link nav-text" aria-current="page">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item me-3 nav-text-content">
                            <Link to="/" className="nav-link nav-text" aria-current="page">
                                About us
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/" className="nav-link nav-text">
                                Support
                            </Link>
                        </li>
                        <div className="nav-btn-container-responsive">
                            <Link to="/login" className="btn custom-btn special_margin" type="submit">
                                <p>Login</p>
                            </Link>
                        </div>
                    </ul>
                </div>
                <li className="nav-btn-container">
                    <Link to="/login" className="btn custom-btn special_margin" onclick={()=> handleNavigation("/login")}>
                        <p>Login</p>
                    </Link>
                </li>
                <div className={`nav-toggle ${isOpen && "open"}`} onClick={() => setIsOpen(!isOpen)}>
                    <span></span>
                    <span></span>
                    <span className="bar-special-style"></span>
                </div>
            </div>
        </nav>
    );

    const BookAppoNav = () => (
        <nav className="navbar navbar-expand-lg navbar-light pt-0 pb-0 navbar-profile nav-book ">
            <div className={`d-flex w-100 ${window.innerWidth > 768 ? "container" : ""}`}>
                <Link to="/" className="nav-content-img">
                    <img src={logo} alt="logo" className="nav-logo" />
                </Link>
                <div className={`align-items-center nav-container-items ${isOpen && "open"}`}>
                    <ul className="navbar-nav nav_links">
                        <div className="nav-btn-container-responsive">
                            <div className="btn custom-btn special_margin" onClick={handleLogout}>
                                <p>Logout</p>
                            </div>
                        </div>
                    </ul>
                </div>
                <li className="nav-btn-container">
                    <div className="btn custom-btn special_margin" onClick={handleLogout}>
                        <p>Logout</p>
                    </div>
                </li>
                <div className={`nav-toggle ${isOpen && "open"}`} onClick={() => setIsOpen(!isOpen)}>
                    <span></span>
                    <span></span>
                    <span className="bar-special-style"></span>
                </div>
            </div>
        </nav>
    );


    const GeneralNavbar = () => (
        <nav className="navbar navbar-expand-lg navbar-light pt-0 pb-0 navbar-principal-classes h-auto">
            <div className="d-flex w-100">
                <Link to="/" className="nav-content-img">
                    <img src={logo} alt="logo" className="nav-logo" />
                </Link>
                <div className={`align-items-center nav-container-items ${isOpen && "open"}`}>
                    <ul className="navbar-nav nav_links">
                        <li className="nav-item me-3 nav-text-content">
                            <Link to="/aboutus" className="nav-link nav-text" aria-current="page">
                                About us
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/suppor"  className="nav-link nav-text">
                                Support 
                            </Link>
                        </li>
                        <div className="nav-btn-container-responsive">
                            <Link to="/login" className="btn custom-btn special_margin" type="submit">
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
                <div className={`nav-toggle ${isOpen && "open"}`} onClick={() => setIsOpen(!isOpen)}>
                    <span></span>
                    <span></span>
                    <span className="bar-special-style"></span>
                </div>
            </div>
        </nav>
    );


    return <><>
    {isProfilePage && <ProfileNavbar />}
    {isLoginPage && <LoginNav />}
    {isRegisterPage && <RegisterNav />}
    {isManageAvPage && <BookAppoNav />}

    {!isProfilePage && !isLoginPage && !isRegisterPage && !isManageAvPage && <GeneralNavbar />}
</></>;
};