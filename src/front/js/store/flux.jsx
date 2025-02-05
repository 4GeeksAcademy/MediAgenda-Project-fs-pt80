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
                        return true;
                    }
                } catch (error) {
                    console.error("Error en el login:", error);
                    setStore({ error: error.message, loading: false });
                    return false;
                }
            },

            logout: () => {
                setStore({ user: null, token: null, role: null });
                localStorage.removeItem("token");
            },

            getProfile: async () => {
                try {
                    const token = getStore().token || localStorage.getItem("token");
                    const response = await fetch(`${process.env.BACKEND_URL}/api/profile`, {
                        method: "GET",
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (!response.ok) throw new Error("Error obteniendo perfil");
                    const data = await response.json();
                    setStore({ user: data.user, role: data.user.paciente ? "paciente" : "especialista", loading: false });
                } catch (error) {
                    console.error("Error en getProfile:", error);
                }
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
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/citas`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (!resp.ok) throw new Error("Error obteniendo citas");
                    const data = await resp.json();
                    setStore({ appointments: data });
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
