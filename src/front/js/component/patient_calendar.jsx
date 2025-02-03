import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const API_KEY = process.env.REACT_APP_API_KEY;
const SCOPES = "https://www.googleapis.com/auth/calendar";

export const PatientCalendar = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [calendarUrl, setCalendarUrl] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("proyectofinalmmediagenda@gmail.com"); // Poner el email del médico

  useEffect(() => {
    function start() {
      gapi.load("client:auth2", async () => {
        try {
          await gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
            scope: SCOPES,
          });

          const auth = gapi.auth2.getAuthInstance();
          setIsSignedIn(auth.isSignedIn.get());
          auth.isSignedIn.listen(setIsSignedIn);

          // Usar el email del doctor para obtener su calendario
          setCalendarUrl(`https://calendar.google.com/calendar/embed?src=${doctorEmail}`);
        } catch (error) {
          console.error("Error inicializando gapi:", error);
        }
      });
    }
    start();
  }, [doctorEmail]);

  const handleSignOut = () => {
    gapi.auth2.getAuthInstance().signOut().then(() => {
      setIsSignedIn(false);
      setCalendarUrl("");
    });
  };

  return (
    <div className="patient-calendar-container">
      <h2>Patient Calendar</h2>

      {isSignedIn ? (
        <>
          <button onClick={handleSignOut}>Cerrar Sesión</button>
          <iframe
            src={calendarUrl}
            style={{ border: "0", width: "100%", height: "600px" }}
            frameBorder="0"
            scrolling="no"
          ></iframe>
        </>
      ) : (
        <button onClick={() => gapi.auth2.getAuthInstance().signIn()}>Iniciar Sesión con Google</button>
      )}
    </div>
  );
};
