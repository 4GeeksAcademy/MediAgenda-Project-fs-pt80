import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const API_KEY = process.env.REACT_APP_API_KEY;
const SCOPES = "https://www.googleapis.com/auth/calendar";

export const DoctorCalendar = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [calendarUrl, setCalendarUrl] = useState("");

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

          const authInstance = gapi.auth2.getAuthInstance();
          if (authInstance.isSignedIn.get()) {
            setIsSignedIn(true);
            const user = authInstance.currentUser.get();
            const email = user.getBasicProfile().getEmail();
            setCalendarUrl(`https://calendar.google.com/calendar/embed?src=${email}`);
          }
        } catch (error) {
          console.error("Error inicializando gapi:", error);
        }
      });
    }
    start();
  }, []);

  const handleSignIn = () => {
    gapi.auth2.getAuthInstance().signIn().then(() => {
      window.location.reload();
    });
  };

  const handleSignOut = () => {
    gapi.auth2.getAuthInstance().signOut().then(() => {
      setIsSignedIn(false);
      setCalendarUrl("");
      window.location.reload();
    });
  };

  return (
    <div className="doctor-calendar-container">
      <h2>Doctor Calendar</h2>

      {isSignedIn ? (
        <>
          <button onClick={handleSignOut}>Cerrar Sesión</button>
          {calendarUrl ? (
            <iframe
              src={calendarUrl}
              style={{ border: "0", width: "100%", height: "600px" }}
              frameBorder="0"
              scrolling="no"
            ></iframe>
          ) : (
            <p>Cargando calendario...</p>
          )}
        </>
      ) : (
        <button onClick={handleSignIn}>Iniciar Sesión con Google</button>
      )}
    </div>
  );
};
