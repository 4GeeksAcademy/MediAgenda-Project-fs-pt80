import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../store/appContext";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { store, actions } = useContext(Context);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); 
       
        const success = await actions.login(email, password);

        if (success) {
            
            navigate("/profile");
        } else {
            alert("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="login-body">
            <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">
                
                </div>
            </div>
            <div className=" justify-content-center align-items-center vh-100">
            <h2 className="login-title m-5 p-5 mb-0 pb-0">Login</h2>
                <div className="login-container mt-0">
                    <div className="card p-3 shadow-sm login-card">
                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email:</label>
                                <input
                                    type="email"
                                    className="form-control email-input"
                                    id="email"
                                    placeholder="example@mediagenda.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password:</label>
                                <input
                                    type="password"
                                    className="form-control password-input"
                                    id="password"
                                    placeholder="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="mb-3 text-end">
                                <a href="/forgot-password" className="forgot-password-link">
                                    Have you forgotten your password?
                                </a>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary login-button"
                                disabled={isLoading}
                            >
                                {isLoading ? "Logging in..." : "Log in"}
                            </button>
                            <p className="text-center mt-3">
                                <span className="register-warning">
                                    If you are not registered you can&nbsp;
                                    <a
                                        href="https://congenial-capybara-v6g54v55jgp5hxqr7-3000.app.github.dev/register"
                                        className="register-link">
                                        register here
                                    </a>.
                                </span>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

