import { loadGoogleApi, signInWithGoogle } from "../component/gapi_auth.jsx"; 
const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            user: null,
            token: localStorage.getItem("token"),
            role: null,
            googleAccessToken: localStorage.getItem("X-Google-Access-Token") || null,
            appointments: [],
            availability: [],
            googleAuthUrl: "",
            loading: false,
            error: null,
            doctors: []
        },

        actions: {
            register: async (userData) => {
                try {
                    setStore({ loading: true, error: null });
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/register`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(userData),
                    });

                    if (resp.ok) {
                        const data = await resp.json();
                        setStore({ token: data.token, loading: false });
                        localStorage.setItem("token", data.token);
                        return true;
                    }
                } catch (error) {
                    console.error("Error en el registro:", error);
                    setStore({ error: error.message, loading: false });
                    return false;
                }
            },

            login: async (email, password) => {
                try {
                    setStore({ loading: true, error: null });
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password }),
                    });

                    if (resp.ok) {
                        const data = await resp.json();
                        setStore({ user: data.user, token: data.token, role: data.user.paciente ? "paciente" : "especialista", loading: false });
                        localStorage.setItem("token", data.token);
                        getActions().getProfile();
                        return true;
                    }
                } catch (error) {
                    console.error("Error en el login:", error);
                    setStore({ error: error.message, loading: false });
                    return false;
                }
            },
            initializeGoogleApi: async () => {
                await loadGoogleApi();
            },

            saveGoogleToken: (googleAccessToken) => {
                localStorage.setItem("X-Google-Access-Token", googleAccessToken);
                setStore({ googleAccessToken });
            },

            saveToken: (token) => {
                localStorage.setItem("token", token);
                setStore({ token });
            },

            handleGoogleLogin: async () => {
                try {
                    const googleToken = await signInWithGoogle();
                    if (googleToken) {
                        getActions().saveGoogleToken(googleToken);
                        await getActions().fetchAppointments();
                    }
                } catch (error) {
                    console.error("❌ Error en handleGoogleLogin:", error);
                }
            },

            getProfile: async () => {
                try {
                    const token = localStorage.getItem("token");
                    if (!token) return;
            
                    const response = await fetch(`${process.env.BACKEND_URL}/api/profile`, {
                        method: "GET",
                        headers: { Authorization: `Bearer ${token}` },
                    });
            
                    if (!response.ok) throw new Error("Error al obtener perfil");
            
                    const data = await response.json();
                    console.log("🔍 Datos recibidos de la API:", data);
            
                    if (!data.user || !data.profile) {
                        console.error("⚠️ Datos del perfil incompletos", data);
                        return;
                    }
            
                    // ✅ Asegurar que el perfil tiene los valores correctos
                    setStore({ 
                        user: data.user,  
                        role: data.role,
                        profile: {
                            nombre: data.user?.nombre || "No especificado",
                            apellido: data.user?.apellido || "No especificado",
                            email: data.user?.email || "No especificado",
                            especialidades: data.profile?.especialidades || "No especificado",
                            telefono_oficina: data.profile?.telefono_oficina || "",
                            clinica: data.profile?.clinica || "",
                            numero_colegiatura: data.profile?.numero_colegiatura || "",
                            direccion_centro_trabajo: data.profile?.direccion_centro_trabajo || "",
                            descripcion: data.profile?.descripcion || "",
                        },
                        doctors: Array.isArray(data.doctors) ? data.doctors : [] 
                    });
            
                    console.log("✅ Perfil guardado en store:", getStore().profile);
                } catch (error) {
                    console.error("❌ Error cargando perfil:", error);
                }
            },
            
            
            
            updateProfile: async (profileData) => {
                try {
                    const token = localStorage.getItem("token");
                    if (!token) return false;
            
                    const response = await fetch(`${process.env.BACKEND_URL}/api/profile`, {
                        method: "PUT",
                        headers: { 
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify(profileData),
                    });
            
                    if (!response.ok) throw new Error("Error al actualizar el perfil");
            
                    console.log("✅ Perfil actualizado correctamente.");
                    await getActions().getProfile(); // 🔹 Se vuelve a cargar el perfil actualizado
                    return true;
                } catch (error) {
                    console.error("❌ Error en updateProfile:", error);
                    return false;
                }
            },
            
            
            

            logout: () => {
                
                localStorage.removeItem("token");
            
               
                setStore({
                    token: null,
                    user: null,
                    role: null,
                    appointments: [],
                });
            
                alert("Sesión cerrada correctamente.");
            },

            

            getGoogleAuthUrl: async () => {
                try {
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/auth/google`);
                    if (!resp.ok) throw new Error("Error obteniendo Google Auth URL");
                    const data = await resp.json();
                    setStore({ googleAuthUrl: data.auth_url });
                } catch (error) {
                    console.error("Error en getGoogleAuthUrl:", error);
                }
            },
            googleLogOut: () => {
                localStorage.removeItem("google_access_token");
                setStore({
                    googleAccessToken: null,
                    user: null,
                    role: null,
                    appointments: [],
                });
            
                alert("Sesión cerrada correctamente.");
            },
            
            fetchAppointments: async () => {
                try {
                    const store = getStore();
                    const googleToken = store.googleAccessToken;
            
                    if (!googleToken) {
                        console.warn("⚠️ No hay token de Google disponible.");
                        return;
                    }
            
                    // Evitar llamadas repetitivas si las citas ya han sido obtenidas recientemente
                    if (store.appointments.length > 0 && store.lastFetched) {
                        const now = new Date().getTime();
                        const lastFetchedTime = store.lastFetched;
                        if (now - lastFetchedTime < 10000) { // 10 segundos
                            console.log("⚠️ Evitando llamada repetida a fetchAppointments.");
                            return;
                        }
                    }
            
                    console.log("🔄 Obteniendo citas...");
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/citas`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${store.token}`,
                            "X-Google-Access-Token": googleToken, 
                        },
                    });
            
                    if (!resp.ok) throw new Error("Error obteniendo citas");
                    const data = await resp.json();
            
                    setStore({ 
                        appointments: data.citas, 
                        lastFetched: new Date().getTime() // Guardar tiempo de última actualización
                    });
                    console.log("✅ Citas obtenidas correctamente:", data.citas);
                } catch (error) {
                    console.error("❌ Error en fetchAppointments:", error);
                }
            },
            createAppointment: async (appointmentData) => {
                try {
                    const store = getStore();
                    const googleToken = store.googleAccessToken;
            
                    if (!googleToken) {
                        console.warn("⚠️ No hay token de Google disponible.");
                        return;
                    }
            
                    console.log("📅 Enviando datos de cita:", appointmentData); // Agregar depuración
            
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/citas`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${store.token}`,
                            "X-Google-Access-Token": googleToken, 
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(appointmentData),
                    });
            
                    if (!resp.ok) {
                        const errorText = await resp.text(); // Obtiene el error exacto del backend
                        throw new Error(`Error creando cita: ${errorText}`);
                    }
            
                    const data = await resp.json();
                    console.log("✅ Cita creada en Google Calendar:", data);
                    getActions().fetchAppointments(); // Recargar citas
                } catch (error) {
                    console.error("❌ Error en createAppointment:", error);
                }
            },            
            cancelAppointment: async (google_event_id) => {
                try {
                    const token = getStore().token || localStorage.getItem("token");
                    const googleToken = getStore().googleAccessToken || localStorage.getItem("X-Google-Access-Token");
            
                    if (!token || !googleToken) {
                        alert("Debes iniciar sesión antes de cancelar una cita.");
                        return;
                    }
            
                    console.log("🗑️ Cancelando cita con ID:", google_event_id); // Debug
            
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/citas/${google_event_id}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "X-Google-Access-Token": googleToken,
                        },
                    });
            
                    if (!resp.ok) {
                        const errorText = await resp.text();
                        throw new Error(`Error cancelando cita: ${errorText}`);
                    }
            
                    await getActions().fetchAppointments(); // Recargar citas
                    alert("Cita cancelada correctamente.");
                } catch (error) {
                    console.error("❌ Error en cancelAppointment:", error);
                }
            },
            fetchAvailability: async () => {
                try {
                    const token = getStore().token;
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/disponibilidad`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (!resp.ok) throw new Error("Error obteniendo disponibilidad");
                    const data = await resp.json();
                    setStore({ availability: data });
                } catch (error) {
                    console.error("Error en fetchAvailability:", error);
                }
            },
        },
    };
};

export default getState;
