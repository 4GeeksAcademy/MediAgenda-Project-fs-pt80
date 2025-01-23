import React, { useState } from "react";
import { Link } from "react-router-dom";

export const Register = () => {
    const [profileType, setProfileType] = useState("");

    const handleProfileTypeChange = (event) => {
        setProfileType(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (profileType === "doctor") {
            console.log("Redirecting to Specialist form...");
        } else {
            console.log("Registering as Patient...");
        }
    };

    return (
        <div 
            className="d-flex justify-content-center align-items-center vh-100"
        >
            <div 
                className="card p-4 shadow" 
                style={{ 
                    width: "100%", 
                    maxWidth: "400px", 
                    borderRadius: "15px", 
                    backgroundColor: "rgba(111, 76, 176, 0.33)", 
                }}
            >
                <h3 
                    className="text-left" 
                    style={{ 
                        color: "#4a148c", 
                        position: "absolute", 
                        top: "-32px",  
                        left: "15px", 
                        margin: "0",
                        fontSize: "24px"
                    }}
                >
                    Register
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-6 mb-3">
                        <label 
                            htmlFor="phone" 
                            className="form-label" 
                            style={{ color: "#3E2F9C" }}
                        >First Name:</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="firstName" 
                                placeholder="Harry" 
                                style={{ 
                                    backgroundColor: "rgba(111, 76, 176, 0.00)", 
                                    border: "1px solid #4a148c", 
                                    borderRadius: "8px",
                                    color: "white",
                                    fontSize: "12px"
                                }} 
                            />
                        </div>
                        <div className="col-6 mb-3">
                        <label 
                            htmlFor="phone" 
                            className="form-label" 
                            style={{ color: "#3E2F9C" }}
                        >Last Name:</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="lastName" 
                                placeholder="Last Name" 
                                style={{ 
                                    backgroundColor: "rgba(111, 76, 176, 0.00)", 
                                    border: "1px solid #4a148c", 
                                    borderRadius: "8px",
                                    color: "white",
                                    fontSize: "12px"
                                }} 
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                    <label 
                            htmlFor="phone" 
                            className="form-label" 
                            style={{ color: "#3E2F9C" }}
                        >Phone:</label>
                        <input 
                            type="tel" 
                            className="form-control" 
                            id="phone" 
                            placeholder="+34 910 86 69 83" 
                            style={{ 
                                backgroundColor: "rgba(111, 76, 176, 0.00)", 
                                border: "1px solid #4a148c", 
                                borderRadius: "8px",
                                color: "white",
                                fontSize: "12px"
                            }} 
                        />
                    </div>
                    <div className="mb-3">
                    <label 
                            htmlFor="phone" 
                            className="form-label" 
                            style={{ color: "#3E2F9C" }}
                        >Email:</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            id="email" 
                            placeholder="example@mediagenda.com" 
                            style={{ 
                                backgroundColor: "rgba(111, 76, 176, 0.00)", 
                                border: "1px solid #4a148c", 
                                borderRadius: "8px",
                                color: "white",
                                fontSize: "12px"
                            }} 
                        />
                    </div>
                    <div className="mb-3">
                    <label 
                            htmlFor="phone" 
                            className="form-label" 
                            style={{ color: "#3E2F9C" }}
                        >Password:</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            id="password" 
                            placeholder="********" 
                            style={{ 
                                backgroundColor: "rgba(111, 76, 176, 0.00)", 
                                border: "1px solid #4a148c", 
                                borderRadius: "8px",
                                color: "white",
                                fontSize: "12px"
                            }} 
                        />
                    </div>
                    <div className="mb-3">
                    <label 
                            htmlFor="phone" 
                            className="form-label" 
                            style={{ color: "#3E2F9C" }}
                        >Profile type:</label>
                        <select 
                            id="profileType" 
                            className="form-select" 
                            value={profileType} 
                            onChange={handleProfileTypeChange} 
                            style={{ 
                                backgroundColor: "rgba(111, 76, 176, 0.00)", 
                                border: "1px solid #4a148c", 
                                borderRadius: "8px", 
                                color: "white",
                                fontSize: "12px"
                            }}
                        >
                            <option value="" style={{
                                backgroundColor: "rgba(111, 76, 176, 0.33)", 
                            }}>Select profile type</option>
                            <option value="Patient" style={{
                                backgroundColor: "rgba(111, 76, 176, 0.33)", 
                            }}>Patient</option>
                            <option value="Doctor" style={{
                                backgroundColor: "rgba(111, 76, 176, 0.33)", 
                            }}>Doctor</option>
                        </select>
                    </div>
                    {profileType === "Doctor" ? (
                        <Link 
                            to="/doctorregister" 
                            style={{ 
                                display: "inline-block", 
                                backgroundColor: "#4a148c", 
                                borderRadius: "8px", 
                                padding: "10px", 
                                fontSize: "12px",
                                width: "35%",
                                color: "white",
                                textAlign: "center",
                                marginTop: "10px"
                            }}
                        >
                            Register
                        </Link>
                    ) : (
                        <button 
                            type="submit"  
                            style={{ 
                                backgroundColor: "#4a148c", 
                                borderRadius: "8px", 
                                padding: "10px", 
                                marginTop: "10px",
                                fontSize: "16px",
                                width: "35%",
                                color: "white",
                            }}
                        >
                            Register
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};
