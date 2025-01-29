import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../store/appContext";

export const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profileType, setProfileType] = useState("");
    const [specialistType, setSpecialistType] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const { actions, store } = useContext(Context);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const userData = {
            firstName,
            lastName,
            phone,
             email,
            password, 
            profileType,
            specialistType: profileType === "Doctor" ? specialistType : null,
            licenseNumber: profileType === "Doctor" ? licenseNumber :null
        }; 
    
        try  {
            await  actions.register(userData);
    
            if (!store.error) {
                navigate("/profile");
            } else {
                alert(store.error || "Registration failed. Please try again.");
            }
        } 
        catch (error) {
            alert("An error occurred during registration.");
        }
    };

    return (
        <>
            <h3 className="doctor-register-title">Register</h3>
            <div className="doctor-register-container">
                <div className="doctor-register-card">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-6 mb-3">
                                <label htmlFor="firstName" className="doctor-register-label">First Name:</label>
                                <input
                                    type="text"
                                    className="doctor-register-input"
                                    id="firstName"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="col-6 mb-3">
                                <label htmlFor="lastName" className="doctor-register-label">Last Name:</label>
                                <input
                                    type="text"
                                    className="doctor-register-input"
                                    id="lastName"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="doctor-register-label">Phone:</label>
                            <input
                                type="tel"
                                className="doctor-register-input"
                                id="phone"
                                placeholder="+44 1234 56 78 99"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="doctor-register-label">Email:</label>
                            <input
                                type="email"
                                className="doctor-register-input"
                                id="email"
                                placeholder="example@mediagenda.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="doctor-register-label">Password:</label>
                            <input
                                type="password"
                                className="doctor-register-input"
                                id="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="profileType" className="doctor-register-label">Profile Type:</label>
                            <select
                                id="profileType"
                                className="doctor-register-input"
                                value={profileType}
                                onChange={(e) => setProfileType(e.target.value)}
                            >
                                <option value="">Profile Type</option>
                                <option value="Patient">Patient</option>
                                <option value="Doctor">Doctor</option>
                            </select>
                        </div>

                        {profileType === "Doctor" && (
                            <>
                                <div className="mb-3">
                                    <label htmlFor="specialistType" className="doctor-register-label">Specialist type:</label>
                                    <select
                                        id="specialistType"
                                        className="doctor-register-input"
                                        value={specialistType}
                                        onChange={(e) => setSpecialistType(e.target.value)}
                                    >
                                        <option value="">Select Speciality</option>
                                        <option value="Dermatologist">Dermatologist</option>
                                        <option value="Pediatrician">Pediatrician</option>
                                        <option value="Psychologist">Psychologist</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="licenseNumber" className="doctor-register-label">Number specialist license:</label>
                                    <input
                                        type="text"
                                        className="doctor-register-input"
                                        id="licenseNumber"
                                        placeholder="123456789XXX"
                                        value={licenseNumber}
                                        onChange={(e) => setLicenseNumber(e.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            className="doctor-register-button"
                            disabled={store.loading}
                        >
                            {store.loading ? "Registering..." : "Register"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};