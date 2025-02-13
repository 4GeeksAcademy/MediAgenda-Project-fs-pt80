// import React, { useEffect, useState } from "react";
// import { gapi } from "gapi-script";

// const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
// const API_KEY = process.env.REACT_APP_API_KEY;
// const SCOPES = "https://www.googleapis.com/auth/calendar";

// export const PatientCalendar = () => {
//   const [isSignedIn, setIsSignedIn] = useState(false);
//   const [calendarUrl, setCalendarUrl] = useState("");
//   const [doctorEmail, setDoctorEmail] = useState("proyectofinalmmediagenda@gmail.com"); // Poner el email del médico

//   useEffect(() => {
//     function start() {
//       gapi.load("client:auth2", async () => {
//         try {
//           await gapi.client.init({
//             apiKey: API_KEY,
//             clientId: CLIENT_ID,
//             discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
//             scope: SCOPES,
//           });

//           const auth = gapi.auth2.getAuthInstance();
//           setIsSignedIn(auth.isSignedIn.get());
//           auth.isSignedIn.listen(setIsSignedIn);

//           // Usar el email del doctor para obtener su calendario
//           setCalendarUrl(`https://calendar.google.com/calendar/embed?src=${doctorEmail}`);
//         } catch (error) {
//           console.error("Error inicializando gapi:", error);
//         }
//       });
//     }
//     start();
//   }, [doctorEmail]);

//   const handleSignOut = () => {
//     gapi.auth2.getAuthInstance().signOut().then(() => {
//       setIsSignedIn(false);
//       setCalendarUrl("");
//     });
//   };

//   return (
//     <div className="patient-calendar-container">
//       <h2>Patient Calendar</h2>

//       {isSignedIn ? (
//         <>
//           <button onClick={handleSignOut}>Cerrar Sesión</button>
//           <iframe
//             src={calendarUrl}
//             style={{ border: "0", width: "100%", height: "600px" }}
//             frameBorder="0"
//             scrolling="no"
//           ></iframe>
//         </>
//       ) : (
//         <button onClick={() => gapi.auth2.getAuthInstance().signIn()}>Iniciar Sesión con Google</button>
//       )}
//     </div>
//   );
// };

import React, { useEffect, useState, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Context } from "../store/appContext";
import { signInWithGoogle } from "../component/gapi_auth.jsx";

const localizer = momentLocalizer(moment);

export const PatientCalendar = () => {
    const { store, actions } = useContext(Context);
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState("");
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (store.googleAccessToken && store.token && store.appointments.length === 0) {
            actions.fetchAppointments();
        }
    }, [store.googleAccessToken, store.token]);

    useEffect(() => {
        if (store.appointments.length > 0) {
            const formattedEvents = store.appointments.map((appt) => ({
                id: appt.google_event_id,
                title: appt.doctorName || "Cita Médica",
                start: new Date(`${appt.appointment_date}T${appt.appointment_time}`),
                end: new Date(`${appt.appointment_date}T${appt.appointment_time}`),
            }));
            
            // Solo actualizar si los eventos han cambiado
            if (JSON.stringify(formattedEvents) !== JSON.stringify(events)) {
                setEvents(formattedEvents);
            }
        }
    }, [store.appointments]);

    // 🔹 Iniciar sesión con Google
    const handleGoogleLogin = async () => {
        const googleToken = await signInWithGoogle();
        if (googleToken) {
            actions.saveGoogleToken(googleToken);
            actions.fetchAppointments();
        }
    };

    // 🔹 Cerrar sesión solo en Google sin afectar la sesión de usuario
    const handleGoogleLogout = () => {
        actions.googleLogOut();
        setEvents([]);
    };

    // 🔹 Seleccionar una fecha en el calendario
    const handleSelectSlot = ({ start }) => {
        setSelectedDate(moment(start).format("YYYY-MM-DD"));
        setShowForm(true);
    };

    // 🔹 Reservar una cita
    const handleReserve = async (event) => {
        event.preventDefault();
        if (!selectedTime) {
            alert("Por favor, selecciona una hora.");
            return;
        }

        const appointmentData = {
            appointment_date: selectedDate,
            appointment_time: selectedTime,
            medico_id: 1, // 🔹 Este ID debería ser dinámico según el médico seleccionado
            access_token: store.googleAccessToken,
            estado: "confirmada".toLowerCase()
        };

        await actions.createAppointment(appointmentData);
        setShowForm(false);
    };

    const handleSelectEvent = async (event) => {
        const isConfirmed = window.confirm("¿Quieres cancelar esta cita?");
        if (!isConfirmed) return;

        await actions.cancelAppointment(event.id);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Calendario de Citas</h2>

            {!store.googleAccessToken ? (
                <div className="alert alert-warning text-center">
                    <p>Debes iniciar sesión con Google para ver tu calendario.</p>
                    <button className="btn btn-primary" onClick={handleGoogleLogin}>
                        Iniciar con Google
                    </button>
                </div>
            ) : (
                <>
                    <div className="d-flex justify-content-between mb-3">
                        <button className="btn btn-danger" onClick={handleGoogleLogout}>
                            Cerrar Sesión en Google
                        </button>
                    </div>

                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                        selectable
                        onSelectSlot={handleSelectSlot}
                        onSelectEvent={handleSelectEvent}
                    />

                    {showForm && (
                        <div className="mt-4 p-4 border rounded">
                            <h4>Reservar Cita para {selectedDate}</h4>
                            <form onSubmit={handleReserve}>
                                <div className="mb-3">
                                    <label className="form-label">Selecciona la Hora:</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-success">
                                    Reservar Cita
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary ms-2"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancelar
                                </button>
                            </form>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
