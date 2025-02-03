const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            user: null,
            token: null,
            role: null,
            appointments: [],
            availability: [],
            loading: false,
            error: null,
            appointments: [],
            availability: [],
            googleAuthUrl: "",
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
                        setStore({ loading: false });
                        console.log("Registro exitoso.");
                    } else {
                        setStore({ loading: false, error: "Error al registrar el usuario." });
                    }
                } catch (error) {
                    setStore({ loading: false, error: "Error en el registro." });
                    console.error("Error:", error);
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
                        setStore({
                            user: data.user,
                            token: data.token,
                            role: data.user.paciente ? "paciente" : "especialista",
                            loading: false,
                        });

                        localStorage.setItem("token", data.token);

                        return data.user;
                    } else {
                        setStore({ loading: false, error: "Credenciales inválidas." });
                        return null;
                    }
                } catch (error) {
                    setStore({ loading: false, error: "Error en el login." });
                    console.error("Error:", error);
                    return null;
                }
            },
            logout: () => {
                setStore({ user: null, token: null, role: null });
                localStorage.removeItem("token");
            },

            getProfile: async () => {
                const store = getStore();
                setStore({ loading: true, error: null });

                try {
                    const token = store.token || localStorage.getItem("token");

                    const response = await fetch(`${process.env.BACKEND_URL}/api/profile`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });

                    if (!response.ok) {
                        throw new Error("Error al obtener el perfil del usuario.");
                    }

                    const data = await response.json();
                    setStore({
                        user: data.user,
                        profile: data.profile,
                        role: data.role,
                        loading: false,
                    });
                } catch (error) {
                    console.error("Error en getProfile:", error);
                }
            },

            googleAuth: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/auth/google`);
                    const data = await response.json();
                    return data.auth_url;
                } catch (error) {
                    console.error("Error en la autenticación con Google:", error);
                }
            },

            fetchAvailability: async () => {
                const { token } = getStore();
                try {
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/disponibilidad`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (resp.ok) {
                        const data = await resp.json();
                        setStore({ availability: data });
                    }
                } catch (error) {
                    console.error("Error al obtener disponibilidad:", error);
                }
            },

            createAvailability: async (availabilityData) => {
                const { token } = getStore();
                try {
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/disponibilidad`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(availabilityData),
                    });

                    if (resp.ok) {
                        getActions().fetchAvailability();
                        console.log("Disponibilidad creada con éxito.");
                    }
                } catch (error) {
                    console.error("Error en createAvailability:", error);
                }
            },

            scheduleAppointment: async (appointmentData) => {
                const { token } = getStore();
                try {
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/citas`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(appointmentData),
                    });

                    if (resp.ok) {
                        getActions().fetchAppointments();
                        console.log("Cita agendada con éxito.");
                    }
                } catch (error) {
                    console.error("Error en scheduleAppointment:", error);
                }
            },
        },
    };
};

export default getState;