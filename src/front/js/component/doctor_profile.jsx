import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.js";
import circle_1 from "../../img/Circle.png";
import doctor_1 from "../../img/doctor5.png";
import { Link, useNavigate } from "react-router-dom";
import { DoctorModal } from "./doctor_edit_information.jsx";

export const Doctor = () => {
    const { store, actions } = useContext(Context);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const handleAvailability = () => {
        navigate("/book_appointment"); 
    };

    useEffect(() => {
        actions.getProfile(); // 🔹 Cargar perfil cuando se monta
    }, []);

    if (!store.profile) {
        return <div className="text-center mt-5">Cargando perfil...</div>;
    }

    return (
        <>
            <div className="col-sm-12 col-md-8 col-lg-8">
                <h1 className="prof-pinci-title">Doctor Profile</h1>
                <div className="d-flex mb-4">
                    <div className="content-data-profile">
                        <div className="container-info-profile">
                            <div>
                                <p className="require-data-title">Name:</p>
                                <p className="require-data-info">{store.profile.nombre || "No especificado"}</p>
                            </div>
                            <div>
                                <p className="require-data-title">Last Name:</p>
                                <p className="require-data-info">{store.profile.apellido || "No especificado"}</p>
                            </div>
                            {store.profile.telefono_oficina && (
                                <div>
                                    <p className="require-data-title">Phone Number:</p>
                                    <p className="require-data-info">{store.profile.telefono_oficina}</p>
                                </div>
                            )}
                            <div>
                                <p className="require-data-title">Email:</p>
                                <p className="require-data-info">{store.profile.email || "No especificado"}</p>
                            </div>
                            {store.profile.clinica && (
                                <div>
                                    <p className="require-data-title">Clinic Name or Office:</p>
                                    <p className="require-data-info">{store.profile.clinica}</p>
                                </div>
                            )}
                            {store.profile.direccion_centro_trabajo && (
                                <div>
                                    <p className="require-data-title">Address:</p>
                                    <p className="require-data-info">{store.profile.direccion_centro_trabajo}</p>
                                </div>
                            )}
                            {store.profile.numero_colegiatura && (
                                <div>
                                    <p className="require-data-title">License Number:</p>
                                    <p className="require-data-info">{store.profile.numero_colegiatura}</p>
                                </div>
                            )}
                            <div>
                                <p className="require-data-title">Specialties:</p>
                                <p className="require-data-info">{store.profile.especialidades || "No especificado"}</p>
                            </div>
                            {store.profile.descripcion && (
                                <div>
                                    <p className="require-data-title">Personal Description:</p>
                                    <p className="require-data-info">{store.profile.descripcion}</p>
                                </div>
                            )}
                        </div>
                        <span className="fa-regular fa-pen-to-square prof-edit-icon"
                            onClick={() => setIsModalOpen(true)}>
                        </span>
                    </div>
                </div>

                <div className="d-flex content-medical-options">
                    <div  className="d-flex choose-speci-box text-decoration-none" onClick={handleAvailability}>
                        <img src={doctor_1} alt="especialista" className="esp-pic" />
                        <p className="select-speciality">Manage Availability</p>
                    </div>
                    <Link to="/" className="comming-s-box text-decoration-none">
                        <h3 className="comming-text">Medical</h3>
                        <h3 className="comming-text">History is</h3>
                        <h3 className="comming-text">Coming soon</h3>
                    </Link>
                </div>
            </div>

            <div className="col-sm-12 col-md-4 col-lg-4 pt-4">
                <div className="prof-list-container">
                    <h1 className="prof-sec-title">Patient Appointments</h1>
                    <div className="content-scroll-list">
                        <div className="list-scrolled">
                            <ul className="ps-0">
                                {store.appointments.length > 0 ? (
                                    store.appointments.map((appt, index) => (
                                        <li key={index} className="content-appoint-data">
                                            <div className="data-text-appoint">
                                                <p className="name-appoint">{appt.name}</p>
                                                <p className="date-appoint">{appt.appointment_date} at {appt.appointment_time}</p>
                                            </div>
                                            <div className="content-appoint-status">
                                                <img src={circle_1} alt="circle1" className="img-status" />
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <p className="no-appoint-msg">No appointments scheduled</p>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <DoctorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};
