const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            user: null,
            token: localStorage.getItem("token") || null,
            role: null,
            appointments: [],
            availability: [],
            googleAuthUrl: "",
            loading: false,
            error: null,
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

            getProfile: async () => {
                try {
                    const store = getStore();
                    const token = store.token || localStorage.getItem("token");
                    if (!token) throw new Error("No autenticado");

                    const response = await fetch(`${process.env.BACKEND_URL}/api/profile`, {
                        method: "GET",
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (!response.ok) throw new Error("No se pudo obtener el perfil");

                    const data = await response.json();
                    setStore({ user: data.user });
                } catch (error) {
                    console.error("Error al obtener el perfil:", error);
                    setStore({ error: "No se pudo cargar el perfil" });
                }
            },
            updateProfile: async (updatedData) => {
                try {
                  const token = getStore().token;
                  const response = await fetch(`${process.env.BACKEND_URL}/api/profile`, {
                    method: "PUT", // o PATCH, dependiendo de la implementación del backend
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedData)
                  });
                  if (!response.ok) throw new Error("Error actualizando perfil");
                  const data = await response.json();
                  
                  setStore({ user: data.user });
                  return true;
                } catch (error) {
                  console.error("Error en updateProfile:", error);
                  setStore({ error: error.message });
                  return false;
                }
              },

            logout: () => {
                setStore({ user: null, token: null, role: null });
                localStorage.removeItem("token");
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

            fetchAppointments: async () => {
                try {
                    const token = getStore().token;
                    if (!token) throw new Error("No token available");
            
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/citas`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                    });
            
                    if (!resp.ok) {
                        const errorData = await resp.json();
                        throw new Error(errorData.error || "Error obteniendo citas");
                    }
            
                    const data = await resp.json();
                    
                    
                    const formattedAppointments = data.citas.map(cita => ({
                        doctorName: cita.summary || `Dr. ${cita.doctor.nombre} ${cita.doctor.apellido}`,
                        appointment_date: cita.start ? cita.start.split("T")[0] : cita.appointment_date,
                        appointment_time: cita.start ? cita.start.split("T")[1].slice(0, 5) : cita.appointment_time,
                        google_event_id: cita.google_event_id || null,
                    }));
            
                    setStore({ appointments: formattedAppointments });
                } catch (error) {
                    console.error("Error en fetchAppointments:", error);
                }
            },
            
            createAppointment: async (appointmentData) => {
                try {
                    const token = getStore().token;
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/citas`, {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                        body: JSON.stringify(appointmentData),
                    });
                    if (!resp.ok) throw new Error("Error creando cita");
                    getActions().fetchAppointments();
                } catch (error) {
                    console.error("Error en createAppointment:", error);
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
