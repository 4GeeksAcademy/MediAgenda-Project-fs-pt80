import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../store/appContext";

export const Register = () => {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [paciente, setPaciente] = useState("");
    const [especialidades, setEspecialidades] = useState("");
    const [numero_colegiatura, setNumeroColegiatura] = useState("");
    const { actions, store } = useContext(Context);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const esPaciente = paciente === "Patient";

        const userData = {
            nombre,
            apellido,
            email,
            password,
            paciente: esPaciente,
            especialidades: !esPaciente ? especialidades : null, 
            numero_colegiatura: !esPaciente ? numero_colegiatura : null
        };

        try {
            await actions.register(userData);

            if (!store.error) {
                navigate("/login");
            } else {
                alert(store.error || "Registration failed. Please try again.");
            }
        } catch (error) {
            alert("An error occurred during registration.");
        }
    };

    return (
        <div className=" justify-content-center align-items-center vh-100">
            <h3 className="doctor-register-title m-5 p-5 mb-0 pb-0">Register</h3>
            <div className="doctor-register-container mt-0 pt-3">
                <div className="doctor-register-card">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-6 mb-3">
                                <label htmlFor="nombre" className="doctor-register-label">First Name:</label>
                                <input
                                    type="text"
                                    className="doctor-register-input"
                                    id="nombre"
                                    placeholder="First Name"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                            </div>
                            <div className="col-6 mb-3">
                                <label htmlFor="apellido" className="doctor-register-label">Last Name:</label>
                                <input
                                    type="text"
                                    className="doctor-register-input"
                                    id="apellido"
                                    placeholder="Last Name"
                                    value={apellido}
                                    onChange={(e) => setApellido(e.target.value)}
                                />
                            </div>
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
                            <label htmlFor="paciente" className="doctor-register-label">Profile Type:</label>
                            <select
                                id="paciente"
                                className="doctor-register-input"
                                value={paciente}
                                onChange={(e) => setPaciente(e.target.value)}
                            >
                                <option value="">Select Profile</option>
                                <option value="Patient">Patient</option>
                                <option value="Doctor">Doctor</option>
                            </select>
                        </div>

                        {paciente === "Doctor" && (
                            <>
                                <div className="mb-3">
                                    <label htmlFor="especialidades" className="doctor-register-label">Specialist type:</label>
                                    <select
                                        id="especialidades"
                                        className="doctor-register-input"
                                        value={especialidades}
                                        onChange={(e) => setEspecialidades(e.target.value)}
                                    >
                                        <option value="">Select Speciality</option>
                                        <option value="Dermatologist">Dermatologist</option>
                                        <option value="Pediatrician">Pediatrician</option>
                                        <option value="Psychologist">Psychologist</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="numero_colegiatura" className="doctor-register-label">License Number:</label>
                                    <input
                                        type="text"
                                        className="doctor-register-input"
                                        id="numero_colegiatura"
                                        placeholder="123456789XXX"
                                        value={numero_colegiatura}
                                        onChange={(e) => setNumeroColegiatura(e.target.value)}
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
        </div>
    );
};
