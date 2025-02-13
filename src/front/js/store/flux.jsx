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
            doctors: [],
            selectedDate: null,
            selectedTime: "",
            selectedSpeciality: "Allergist",
            specialities: [
                "Allergist", "Anesthesiologist", "Cardiologist", "Dentist",
                "Dermatologist", "Emergency", "Endocrinologist", "Gastroenterologist",
                "General", "Geneticist", "Geriatrician", "Gynecologist",
                "Hematologist", "Nephrologist", "Neurologist", "Oncologist",
                "Ophthalmologist", "Orthopedic", "Otolaryngologist", "Pathologist",
                "Pediatrician", "Psychiatrist", "Pulmonologist", "Radiologist",
                "Rheumatologist", "Surgeon", "Urologist"
            ],
            selectedDoctor: null,
            showForm: false,
            availabilityDate: null,
            availabilityStartTime: "",
            availabilityEndTime: "",
            availabilityShowForm: false,
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
                        await getActions().getProfile(); //

                        const store = getStore();
                        console.log("Usuario después de getProfile():", store.user);

                        if (store.user && store.user.id) {
                            if (store.user.paciente) {
                                await getActions().fetchAppointments();
                            } else {
                                await getActions().fetchAvailability(store.user.id);
                            }
                        } else {
                            console.error("Usuario no cargado correctamente en store.user");
                        }
                    }
                } catch (error) {
                    console.error("Error en handleGoogleLogin:", error);
                }
            },


            fetchDoctors: async () => {
                try {
                    console.log("Cargando lista de médicos...");
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/profile`, {
                        method: "GET",
                        headers: { Authorization: `Bearer ${getStore().token}` },
                    });

                    if (!resp.ok) throw new Error(`Error obteniendo médicos: ${resp.statusText}`);

                    const data = await resp.json();
                    console.log("Médicos cargados:", data.doctors);

                    if (data.doctors.length === 0) {
                        console.warn("No hay médicos en la base de datos.");
                    }

                    setStore({ doctors: data.doctors });
                } catch (error) {
                    console.error("Error al cargar médicos:", error);
                }
            },
            setNextSpeciality: () => {
                const store = getStore();
                const currentIndex = store.specialities.indexOf(store.selectedSpeciality);
                const nextIndex = (currentIndex + 1) % store.specialities.length;
                setStore({ selectedSpeciality: store.specialities[nextIndex] });
            },

            setPreviousSpeciality: () => {
                const store = getStore();
                const currentIndex = store.specialities.indexOf(store.selectedSpeciality);
                const prevIndex = (currentIndex - 1 + store.specialities.length) % store.specialities.length;
                setStore({ selectedSpeciality: store.specialities[prevIndex] });
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
                        console.error("Datos del perfil incompletos", data);
                        return;
                    }


                    if (data.role === "paciente") {
                        setStore({
                            user: data.user,
                            role: "paciente",
                            profile: {
                                nombre: data.user?.nombre || "",
                                apellido: data.user?.apellido || "",
                                email: data.user?.email || "",
                                telefono: data.profile?.telefono || "",
                                direccion: data.profile?.direccion || "",
                            }
                        });
                    } else if (data.role === "especialista") {
                        setStore({
                            user: data.user,
                            role: "especialista",
                            profile: {
                                nombre: data.user?.nombre || "",
                                apellido: data.user?.apellido || "",
                                email: data.user?.email || "",
                                especialidades: data.profile?.especialidades || "No especificado",
                                telefono_oficina: data.profile?.telefono_oficina || "",
                                clinica: data.profile?.clinica || "",
                                numero_colegiatura: data.profile?.numero_colegiatura || "",
                                direccion_centro_trabajo: data.profile?.direccion_centro_trabajo || "",
                                descripcion: data.profile?.descripcion || "",
                            }
                        });
                    } else {
                        console.error("Rol desconocido:", data.role);
                    }

                    console.log("Perfil guardado en store:", getStore().profile);
                } catch (error) {
                    console.error("Error cargando perfil:", error);
                }
            },

            updateProfile: async (profileData) => {
                try {
                    const token = localStorage.getItem("token");
                    if (!token) return false;

                    console.log("📤 Enviando datos al backend:", profileData);

                    const response = await fetch(`${process.env.BACKEND_URL}/api/profile`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify(profileData),
                    });

                    if (!response.ok) {
                        const errorResponse = await response.json();
                        console.error("Respuesta del backend con error:", errorResponse);
                        throw new Error("Error al actualizar el perfil");
                    }

                    console.log("Perfil actualizado correctamente.");
                    await getActions().getProfile();
                    return true;
                } catch (error) {
                    console.error("Error en updateProfile:", error);
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

            fetchDoctors: async () => {
                try {
                    console.log("Cargando lista de médicos...");
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/profile`, {
                        method: "GET",
                        headers: { Authorization: `Bearer ${getStore().token}` },
                    });

                    if (!resp.ok) throw new Error(`Error obteniendo médicos: ${resp.statusText}`);

                    const data = await resp.json();
                    console.log("Médicos cargados:", data.doctors);
                    setStore({ doctors: data.doctors });
                } catch (error) {
                    console.error("Error al cargar médicos:", error);
                }
            },

            //Citas 
            setSelectedSpeciality: (increment) => {
                const store = getStore();

                if (!store.doctors.length) {
                    console.error("No hay doctores cargados aún.");
                    return;
                }

                const especialidades = [...new Set(store.doctors.map(doc => doc.especialidades).filter(Boolean))];

                if (!especialidades.length) {
                    console.error("No hay especialidades disponibles.");
                    return;
                }

                let currentIndex = especialidades.indexOf(store.selectedSpeciality);
                let nextIndex = (currentIndex + increment + especialidades.length) % especialidades.length;

                setStore({ selectedSpeciality: especialidades[nextIndex] });

                const doctoresFiltrados = store.doctors.filter(doc => doc.especialidades === especialidades[nextIndex]);
                if (doctoresFiltrados.length) {
                    setStore({ selectedDoctor: doctoresFiltrados[0].id });
                    getActions().fetchAvailability(doctoresFiltrados[0].id);
                }
            },

            setSelectedDoctor: (doctorId) => {
                setStore({ selectedDoctor: doctorId });
                getActions().fetchAvailability(doctorId);
            },

            setShowForm: (value) => {
                setStore({ showForm: value });
            },

            setSelectedTime: (time) => {
                setStore({ selectedTime: time });
            },
            setSelectedDate: (date) => setStore({ selectedDate: date }),

            fetchAppointments: async () => {

                try {
                    const store = getStore();
                    const googleToken = store.googleAccessToken;
                    if (!googleToken) return;

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
                    setStore({ appointments: data.citas });
                } catch (error) {
                    console.error("Error en fetchAppointments:", error);
                }
            },

            createAppointment: async (appointmentData) => {
                try {
                    const store = getStore();
                    let googleToken = store.googleAccessToken;

                    if (!googleToken) {
                        console.log("Intentando refrescar el token de Google...");
                        const tokenResp = await fetch(`${process.env.BACKEND_URL}/api/refresh_token`, {
                            method: "GET",
                            headers: { Authorization: `Bearer ${store.token}` },
                        });

                        if (!tokenResp.ok) throw new Error("Error refrescando el token de Google");

                        const tokenData = await tokenResp.json();
                        googleToken = tokenData.access_token;
                        setStore({ googleAccessToken: googleToken });
                    }

                    console.log("📅 Enviando datos de cita:", appointmentData);

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
                        const errorText = await resp.text();
                        throw new Error(`Error creando cita: ${errorText}`);
                    }

                    console.log("Cita creada con éxito");
                    await getActions().fetchAppointments();
                } catch (error) {
                    console.error("❌ Error en createAppointment:", error);
                }
            },

            cancelAppointment: async (google_event_id) => {
                try {
                    console.log("Intentando cancelar cita con ID:", google_event_id);

                    const store = getStore();
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/citas/${google_event_id}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${store.token}`,
                            "X-Google-Access-Token": store.googleAccessToken,
                        },
                    });

                    if (!resp.ok) {
                        const errorText = await resp.text();
                        throw new Error(`Error cancelando cita: ${errorText}`);
                    }

                    console.log("Cita cancelada con éxito.");
                    await getActions().fetchAppointments();
                } catch (error) {
                    console.error("Error en cancelAppointment:", error);
                }
            },

            //Manejo disponibilidad
            setAvailabilityDate: (date) => setStore({ availabilityDate: date }),
            setAvailabilityStartTime: (time) => setStore({ availabilityStartTime: time }),
            setAvailabilityEndTime: (time) => setStore({ availabilityEndTime: time }),
            setAvailabilityShowForm: (value) => setStore({ availabilityShowForm: value }),

            fetchAvailability: async (medico_id) => {
                console.log("🔍 Solicitando disponibilidad para medico_id:", medico_id);
                if (!medico_id) {
                    console.error("❌ Error: medico_id es indefinido.");
                    return;
                }

                console.log(`🔄 Intentando obtener disponibilidad con medico_id: ${medico_id}`);

                try {
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/disponibilidad?medico_id=${medico_id}`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${getStore().token}`,
                            "X-Google-Access-Token": getStore().googleAccessToken
                        },
                    });

                    if (!resp.ok) {
                        const errorText = await resp.text();
                        throw new Error(`Error obteniendo disponibilidad: ${errorText}`);
                    }

                    const data = await resp.json();
                    // console.log("Respuesta completa de la API:", data);

                    // console.log("Disponibilidad obtenida:", data.disponibilidad);
                    // console.log("Médico seleccionado:", store.selectedDoctor);


                    setStore({ availability: [...data.disponibilidad] });
                } catch (error) {
                    console.error("Error en fetchAvailability:", error);
                    alert("Error cargando la disponibilidad.");
                }
            },


            createAvailability: async (availabilityData) => {
                try {
                    console.log("Enviando datos de disponibilidad:", availabilityData);
                    const store = getStore();
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/disponibilidad`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${store.token}`,
                            "X-Google-Access-Token": store.googleAccessToken,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(availabilityData),
                    });

                    if (!resp.ok) {
                        const errorText = await resp.text();
                        throw new Error(`Error creando disponibilidad: ${errorText}`);
                    }

                    console.log("Disponibilidad creada en Google Calendar");
                    getActions().fetchAvailability(availabilityData.medico_id);
                } catch (error) {
                    console.error("Error en createAvailability:", error);
                }
            },

            deleteAvailability: async (id) => {
                try {
                    const store = getStore();
                    const token = store.token;
                    const googleToken = store.googleAccessToken;

                    if (!token || !googleToken) {
                        alert("Debes iniciar sesión antes de eliminar una disponibilidad.");
                        return;
                    }

                    console.log(`Eliminando disponibilidad con ID: ${id}...`);

                    const resp = await fetch(`${process.env.BACKEND_URL}/api/disponibilidad/${id}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "X-Google-Access-Token": googleToken,
                            "Content-Type": "application/json"
                        },
                    });

                    if (!resp.ok) {
                        const errorText = await resp.text();
                        throw new Error(`Error al eliminar: ${errorText}`);
                    }

                    console.log("Disponibilidad eliminada correctamente en Google Calendar y base de datos.");
                    alert("Disponibilidad eliminada correctamente.");

                    await getActions().fetchAvailability(store.user.id);
                } catch (error) {
                    console.error("Error en deleteAvailability:", error);
                    alert("Error al eliminar la disponibilidad. Intenta nuevamente.");
                }
            },
        },
    };
};

export default getState;
