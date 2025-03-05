import React, { useEffect, useContext, useRef, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/BookAppointment.css";
import moment from "moment";
import { signInWithGoogle } from "../component/gapi_auth.jsx";

export const BookAppointment = () => {
    const { store, actions } = useContext(Context);
    const hasFetchedAvailability = useRef(false);
    const [isDeleting, setIsDeleting] = useState(false); // Nuevo estado para evitar múltiples eliminaciones

    useEffect(() => {
        const fetchData = async () => {
            if (store.googleAccessToken && store.token) {
                console.log("🔄 Intentando cargar el perfil...");

                if (!store.user) {
                    await actions.getProfile();
                }

                if (store.user?.id && store.role === "especialista" && !hasFetchedAvailability.current) {
                    console.log("🟢 Cargando disponibilidad del médico con ID:", store.user.id);
                    if (store.user.perfil_especialista?.id) {
                        actions.fetchAvailability(store.user.perfil_especialista.id);
                    } else {
                        console.error("Error: El usuario no tiene un perfil de especialista registrado.");
                    }
                    hasFetchedAvailability.current = true; // Evitar múltiples cargas
                }
            }
        };
        fetchData();
    }, [store.googleAccessToken, store.token, store.user]);

    const handleGoogleLogin = async () => {
        const googleToken = await signInWithGoogle();
        if (googleToken) {
            actions.saveGoogleToken(googleToken);
            await actions.getProfile(); // Asegurar que el perfil se obtiene antes de continuar
            if (store.user?.id) {
                actions.fetchAvailability(store.user.id);
            }
        }
    };

    const handleGoogleLogout = () => {
        actions.googleLogOut();
        hasFetchedAvailability.current = false;
    };

    const handleSelectDay = (day) => {
        const selectedDate = moment().format(`YYYY-MM-${day < 10 ? `0${day}` : day}`);
        actions.setAvailabilityDate(selectedDate);
        actions.setAvailabilityShowForm(true);
    };

    const handleAddAvailability = async (event) => {
        event.preventDefault();

        if (!store.user?.id) {
            alert("Error: Usuario no cargado. Intenta iniciar sesión nuevamente.");
            return;
        }

        if (!store.availabilityStartTime || !store.availabilityEndTime) {
            alert("⚠️ Selecciona un horario válido.");
            return;
        }

        const availabilityData = {
            medico_id: store.user.id,
            fecha: store.availabilityDate,
            hora_inicio: store.availabilityStartTime,
            hora_final: store.availabilityEndTime,
            access_token: store.googleAccessToken,
        };

        try {
            await actions.createAvailability(availabilityData);
            actions.setAvailabilityShowForm(false);
        } catch (error) {
            console.error("Error creando disponibilidad:", error);
            alert("Hubo un error al guardar la disponibilidad.");
        }
    };

    const handleDeleteAvailability = async (id) => {
        if (isDeleting) return; // Evitar múltiples eliminaciones simultáneas
        const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar esta disponibilidad?");
        if (!isConfirmed) return;

        setIsDeleting(true);
        try {
            await actions.deleteAvailability(id);
        } catch (error) {
            console.error("Error al eliminar disponibilidad:", error);
        }
        setIsDeleting(false);
    };

    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

    return (
        <div className="content-availa-section">
            <h1 className="calendar-title text-start ms-5">Manage Availability</h1>

            {!store.googleAccessToken ? (
                <div className="alert alert-warning text-center">
                    <p>Debes iniciar sesión con Google para gestionar tu disponibilidad.</p>
                    <button className="btn btn-primary" onClick={handleGoogleLogin}>
                        Iniciar con Google
                    </button>
                </div>
            ) : (
                <>
                    <button className="btn btn-danger mb-3" onClick={handleGoogleLogout}>
                        Cerrar Sesión en Google
                    </button>

                    <div className="calendar-container">
                        <div className="calendar">
                            {weekDays.map((day, index) => (
                                <div key={index} className="calendar-weekday">{day}</div>
                            ))}
                            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                                <div
                                    key={day}
                                    className={`calendar-day ${store.availabilityDate?.endsWith(`-${day < 10 ? `0${day}` : day}`) ? "selected" : ""}`}
                                    onClick={() => handleSelectDay(day)}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {store.availabilityShowForm && (
                            <form onSubmit={handleAddAvailability} className="appointment-details">
                                <p>Date: {store.availabilityDate}</p>
                                <div className="time-selector">
                                    <label>Start Time:</label>
                                    <input
                                        type="time"
                                        value={store.availabilityStartTime || ""}
                                        onChange={(e) => actions.setAvailabilityStartTime(e.target.value)}
                                        className="me-2"
                                        required
                                    />
                                    <label>End Time:</label>
                                    <input
                                        type="time"
                                        value={store.availabilityEndTime || ""}
                                        onChange={(e) => actions.setAvailabilityEndTime(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="schedule-button">Schedule</button>
                            </form>
                        )}

                        <div className="appointments-list">
                            {store.availability.length > 0 ? (
                                store.availability.map((avail) => (
                                    <p key={avail.id} className="appointment-item">
                                        {avail.fecha} {avail.hora_inicio} - {avail.hora_final}
                                        <button
                                            className="delete-button cal-avail"
                                            onClick={() => handleDeleteAvailability(avail.id)}
                                            disabled={isDeleting} // Deshabilitar botón durante eliminación
                                        >
                                            <span className="fa-solid fa-trash trash"></span>
                                        </button>
                                    </p>
                                ))
                            ) : (
                                <p className="no-appointment-msg">No availability scheduled</p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
