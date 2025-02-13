import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";

export const TestInterface = () => {
    const { store, actions } = useContext(Context);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        nombre: "",
        apellido: "",
        is_active: true,
        paciente: true, // Cambia según el tipo de usuario
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async () => {
        await actions.register(formData);
        alert(store.error || "Registro exitoso");
    };

    const handleLogin = async () => {
        await actions.login(formData.email, formData.password);
        alert(store.error || "Inicio de sesión exitoso");
    };

    const handleGetProfile = async () => {
        await actions.getProfile();
        alert(store.error || "Perfil obtenido exitosamente");
    };

    const handleLogout = () => {
        actions.logout();
        alert("Sesión cerrada");
    };

    return (
        <div className="container mt-5">
            <h1>Test Interface</h1>

            {/* Registro */}
            <div className="mb-3">
                <h2>Register</h2>
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                />
                <input
                    type="email"
                    className="form-control mb-2"
                    placeholder="Correo electrónico"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    className="form-control mb-2"
                    placeholder="Contraseña"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <button className="btn btn-primary" onClick={handleRegister}>
                    Register
                </button>
            </div>

            {/* Inicio de sesión */}
            <div className="mb-3">
                <h2>Login</h2>
                <input
                    type="email"
                    className="form-control mb-2"
                    placeholder="Correo electrónico"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    className="form-control mb-2"
                    placeholder="Contraseña"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <button className="btn btn-success" onClick={handleLogin}>
                    Login
                </button>
            </div>

            {/* Obtener perfil */}
            <div className="mb-3">
                <h2>Get Profile</h2>
                <button className="btn btn-info" onClick={handleGetProfile}>
                    Obtener Perfil
                </button>
                {store.user && (
                    <div className="mt-3">
                        <p><b>Nombre:</b> {store.user.nombre}</p>
                        <p><b>Apellido:</b> {store.user.apellido}</p>
                        <p><b>Email:</b> {store.user.email}</p>
                        <p><b>Rol:</b> {store.role}</p>
                    </div>
                )}
            </div>

            {/* Logout */}
            <div className="mb-3">
                <h2>Logout</h2>
                <button className="btn btn-danger" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            {/* Estado del store */}
            <div className="mt-4">
                <h3>Store State</h3>
                <pre>{JSON.stringify(store, null, 2)}</pre>
            </div>
        </div>
    );
};