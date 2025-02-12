

// import React, { useEffect, useContext, useState } from "react";
// import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
// import moment from "moment";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import { Context } from "../store/appContext";
// import { signInWithGoogle } from "../component/gapi_auth.jsx";

// const localizer = momentLocalizer(moment);

// export const BookAppointment = () => {
//     const { store, actions } = useContext(Context);


//     useEffect(() => {
//       if (store.googleAccessToken && store.token && store.user?.id && !store.user.paciente) {
//           console.log("🟢 Ejecutando fetchAvailability para el médico con ID:", store.user.id);
//           actions.fetchAvailability(store.user.id);
//       } else {
//           console.log("⚠️ store.user no está disponible aún:", store.user);
//       }
//     }, [store.googleAccessToken, store.token, store.user]);
  
//     const handleGoogleLogin = async () => {
//         const googleToken = await signInWithGoogle();
//         if (googleToken) {
//             actions.saveGoogleToken(googleToken);
//             actions.fetchAvailability(store.user.id);
//         }
//     };

//     const handleGoogleLogout = () => {
//         actions.googleLogOut();
//     };

//     const handleSelectSlot = ({ start }) => {
//       actions.setAvailabilityDate(moment(start).format("YYYY-MM-DD"));
//       actions.setAvailabilityShowForm(true);
//     };

//     const handleAddAvailability = async (event) => {
//       event.preventDefault();
//       if (!store.availabilityStartTime || !store.availabilityEndTime) {
//           alert("Selecciona un horario válido.");
//           return;
//       }
  
//       const availabilityData = {
//           medico_id: store.user.id,
//           fecha: store.availabilityDate,
//           hora_inicio: store.availabilityStartTime,
//           hora_final: store.availabilityEndTime,
//           access_token: store.googleAccessToken
//       };
  
//       await actions.createAvailability(availabilityData);
//       actions.setAvailabilityShowForm(false);
//     };

//     const handleDeleteAvailability = async (id) => {
//       const isConfirmed = window.confirm("⚠️ ¿Estás seguro de que deseas cancelar esta disponibilidad?");
//       if (!isConfirmed) return;
  
//       try {
//           await actions.deleteAvailability(id);
//           alert("✅ Disponibilidad cancelada con éxito.");
//       } catch (error) {
//           console.error("❌ Error al cancelar disponibilidad:", error);
//           alert("Error al cancelar la disponibilidad. Intenta nuevamente.");
//       }
//   };

//     const events = store.availability.map(avail => ({
//       id: avail.id,
//       title: "Disponible",
//       start: new Date(`${avail.fecha}T${avail.hora_inicio}`),
//       end: new Date(`${avail.fecha}T${avail.hora_final}`),
//     }));

//     return (
//         <div className="container mt-4">
//             <h2 className="text-center mb-4">Calendario de Disponibilidad</h2>

//             {!store.googleAccessToken ? (
//                 <div className="alert alert-warning text-center">
//                     <p>Debes iniciar sesión con Google para gestionar tu disponibilidad.</p>
//                     <button className="btn btn-primary" onClick={handleGoogleLogin}>
//                         Iniciar con Google
//                     </button>
//                 </div>
//             ) : (
//                 <>
//                     <button className="btn btn-danger mb-3" onClick={handleGoogleLogout}>
//                         Cerrar Sesión en Google
//                     </button>

//                     <BigCalendar
//                         localizer={localizer}
//                         events={events}
//                         startAccessor="start"
//                         endAccessor="end"
//                         style={{ height: 500 }}
//                         selectable
//                         onSelectSlot={handleSelectSlot}
//                     />

//                   {store.availabilityShowForm && (
//                       <form onSubmit={handleAddAvailability} className="mt-4 p-4 border rounded">
//                           <h4>Agregar Disponibilidad para {store.availabilityDate}</h4>
//                           <label className="form-label">Hora de Inicio:</label>
//                           <input
//                               type="time"
//                               className="form-control"
//                               value={store.availabilityStartTime || ""}
//                               onChange={(e) => actions.setAvailabilityStartTime(e.target.value)}
//                               required
//                           />
//                           <label className="form-label mt-2">Hora de Fin:</label>
//                           <input
//                               type="time"
//                               className="form-control"
//                               value={store.availabilityEndTime || ""}
//                               onChange={(e) => actions.setAvailabilityEndTime(e.target.value)}
//                               required
//                           />
//                           <button type="submit" className="btn btn-success mt-3">
//                               Guardar Disponibilidad
//                           </button>
//                       </form>
//                   )}
//                 </>
//             )}
//         </div>
//     );
// };

import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/BookAppointment.css";
import moment from "moment";

export const BookAppointment = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        if (store.googleAccessToken && store.token && store.user?.id && !store.user.paciente) {
            actions.fetchAvailability(store.user.id);
        }
    }, [store.googleAccessToken, store.token, store.user]);

    const handleSelectDay = (day) => {
        actions.setAvailabilityDate(moment().format(`YYYY-MM-${day < 10 ? `0${day}` : day}`));
        actions.setAvailabilityShowForm(true);
    };

    const handleAddAvailability = async (event) => {
        event.preventDefault();
        if (!store.availabilityStartTime || !store.availabilityEndTime) {
            alert("Selecciona un horario válido.");
            return;
        }

        const availabilityData = {
            medico_id: store.user.id,
            fecha: store.availabilityDate,
            hora_inicio: store.availabilityStartTime,
            hora_final: store.availabilityEndTime,
            access_token: store.googleAccessToken,
        };

        await actions.createAvailability(availabilityData);
        actions.setAvailabilityShowForm(false);
    };

    const handleDeleteAvailability = async (id) => {
        const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar esta disponibilidad?");
        if (!isConfirmed) return;

        await actions.deleteAvailability(id);
    };

    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

    return (
        <>
            <div className="content-availa-section">
                <h1 className="calendar-title text-start ms-5">Manage Availability</h1>
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
                            <p>
                                Date: {store.availabilityDate}
                            </p>
                            <div className="time-selector">
                                <label>Start Time:</label>
                                <input
                                    type="time"
                                    value={store.availabilityStartTime || ""}
                                    onChange={(e) => actions.setAvailabilityStartTime(e.target.value)} className="me-2"
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
            </div>
            
        </>
    );
};


