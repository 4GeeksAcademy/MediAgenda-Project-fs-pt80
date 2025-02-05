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

import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { gapi } from "gapi-script";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const API_KEY = process.env.REACT_APP_API_KEY;
const SCOPES = "https://www.googleapis.com/auth/calendar";

export const GoogleCalendar = ({ userType }) => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    function start() {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
          scope: SCOPES,
        })
        .then(() => {
          const auth = gapi.auth2.getAuthInstance();
          setIsSignedIn(auth.isSignedIn.get());
          auth.isSignedIn.listen(setIsSignedIn);
        });
    }
    gapi.load("client:auth2", start);
  }, []);

  const handleAuthClick = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOutClick = () => {
    gapi.auth2.getAuthInstance().signOut();
    setEvents([]);
  };

  const fetchEvents = async () => {
    if (!isSignedIn) return;
    try {
      const response = await gapi.client.calendar.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        orderBy: "startTime",
      });
      setEvents(response.result.items || []);
    } catch (error) {
      console.error("Error fetching events: ", error);
    }
  };

  const addEvent = async () => {
    if (!isSignedIn) return;
    const start = new Date(date);
    start.setHours(10, 0, 0);
    const end = new Date(start);
    end.setHours(11, 0, 0);

    const event = {
      summary: userType === "doctor" ? "Disponibilidad del Doctor" : "Cita Médica",
      start: { dateTime: start.toISOString(), timeZone: "America/New_York" },
      end: { dateTime: end.toISOString(), timeZone: "America/New_York" },
    };

    try {
      await gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: event,
      });
      fetchEvents();
    } catch (error) {
      console.error("Error creating event: ", error);
    }
  };

  return (
    <div>
      <h2>{userType === "doctor" ? "Doctor Calendar" : "Patient Calendar"}</h2>
      {!isSignedIn ? (
        <button onClick={handleAuthClick}>Iniciar Sesión con Google</button>
      ) : (
        <button onClick={handleSignOutClick}>Cerrar Sesión</button>
      )}
      <Calendar onChange={setDate} value={date} />
      <button onClick={fetchEvents}>Cargar Disponibilidad</button>
      <button onClick={addEvent}>{userType === "doctor" ? "Agregar Disponibilidad" : "Reservar Cita"}</button>
      <ul>
        {events.map((event) => (
          <li key={event.id} onClick={() => setSelectedEvent(event)}>
            {event.summary} - {event.start.dateTime}
          </li>
        ))}
      </ul>
      {selectedEvent && (
        <div>
          <h3>Detalles del Evento</h3>
          <p>{selectedEvent.summary}</p>
          <p>Inicio: {selectedEvent.start.dateTime}</p>
          <p>Fin: {selectedEvent.end.dateTime}</p>
          <button onClick={() => setSelectedEvent(null)}>Cerrar</button>
        </div>
      )}
    </div>
  );
};