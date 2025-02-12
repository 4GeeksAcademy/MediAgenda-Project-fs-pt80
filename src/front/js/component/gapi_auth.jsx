import { gapi } from "gapi-script";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const API_KEY = process.env.REACT_APP_API_KEY;
const SCOPES = "https://www.googleapis.com/auth/calendar.events";


export const loadGoogleApi = async () => {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
            console.log("✅ Google API cargada correctamente");
            resolve();
        };
        script.onerror = () => {
            console.error("❌ Error cargando Google API");
            reject(new Error("No se pudo cargar Google API"));
        };
        document.body.appendChild(script);
    });
};


export const initGapiClient = async () => {
    return new Promise((resolve, reject) => {
        gapi.load("client:auth2", async () => {
            try {
                await gapi.client.init({
                    apiKey: API_KEY,
                    clientId: CLIENT_ID,
                    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
                    scope: SCOPES,
                });

                console.log("✅ gapi.client inicializado correctamente");
                resolve();
            } catch (error) {
                console.error("❌ Error al inicializar gapi:", error);
                reject(error);
            }
        });
    });
};


export const signInWithGoogle = async () => {
    try {
        await loadGoogleApi();  
        await initGapiClient(); 

        return new Promise((resolve, reject) => {
            const tokenClient = window.google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: (response) => {
                    if (response.error) {
                        console.error("❌ Error en la autenticación de Google:", response);
                        reject(response.error);
                        return;
                    }

                    console.log("✅ Token obtenido:", response.access_token);
                    localStorage.setItem("google_access_token", response.access_token);
                    resolve(response.access_token);
                },
            });

            tokenClient.requestAccessToken();
        });
    } catch (error) {
        console.error("❌ Error en signInWithGoogle:", error);
        return null;
    }
};
