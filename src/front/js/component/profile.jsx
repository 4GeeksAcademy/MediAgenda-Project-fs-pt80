import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.js";
import circle_1 from "../../img/Circle.png";
import circle_2 from "../../img/Circle_2.png";
import circle_3 from "../../img/Circle_3.png";
import doctor_1 from "../../img/doctor5.png";
import { Modals } from "./editinformation.jsx";
import { Link } from "react-router-dom";

export const PatientProfile = () => {
    const { store, actions } = useContext(Context);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profileData, setProfileData] = useState(() => {
        const storedData = localStorage.getItem("profileData");
        return storedData
            ? JSON.parse(storedData)
            : {
                firstName: "Pepe",
                lastName: "El Bueno",
                phoneNumber: "6458889999",
                email: "pepebue@geeks.com",
                address: "",
                securityNumber: ""
            };
    });

    useEffect(() => {
        actions.getProfile();
        //actions.fetchAppointments();
    }, []);

    useEffect(() => {
        if (store.profile) {
            setProfileData(store.profile);
        }
    }, [store.profile]);

    const updateProfileData = (updatedData) => {
        setProfileData(updatedData);
        localStorage.setItem("profileData", JSON.stringify(updatedData));
    };

    return (
        <>
            <div className="col-sm-12 col-md-7 col-lg-7">
                <h1 className="prof-pinci-title">Profile</h1>
                <div className="d-flex mb-4">
                    <div className="content-data-profile">
                        <div className="container-info-profile">
                            <div>
                                <p className="require-data-title">Name:</p>
                                <p className="require-data-info">{profileData.firstName}</p>
                            </div>
                            <div>
                                <p className="require-data-title">Last Name:</p>
                                <p className="require-data-info">{profileData.lastName}</p>
                            </div>
                            <div>
                                <p className="require-data-title">Phone Number:</p>
                                <p className="require-data-info">{profileData.phoneNumber}</p>
                            </div>
                            <div>
                                <p className="require-data-title">Email:</p>
                                <p className="require-data-info">{profileData.email}</p>
                            </div>
                            {profileData.address && (
                                <div>
                                    <p className="require-data-title">Address:</p>
                                    <p className="require-data-info">{profileData.address}</p>
                                </div>
                            )}

                            {profileData.securityNumber && (
                                <div>
                                    <p className="require-data-title">Social Security Number:</p>
                                    <p className="require-data-info">{profileData.securityNumber}</p>
                                </div>
                            )}
                        </div>

                        <span className="fa-regular fa-pen-to-square prof-edit-icon"
                            onClick={() => setIsModalOpen(true)}>
                        </span>
                    </div>
                    <div className="dot-states">
                        <span data-bs-toggle="tooltip" data-bs-custom-class="tool-status" data-bs-placement="bottom" data-bs-title="Available">
                            <img src={circle_1} alt="circle1" />
                        </span>
                        <span data-bs-toggle="tooltip" data-bs-custom-class="tool-status" data-bs-placement="bottom" data-bs-title="Cancelled">
                            <img src={circle_2} alt="circle1" />
                        </span>
                        <span data-bs-toggle="tooltip" data-bs-custom-class="tool-status" data-bs-placement="bottom" data-bs-title="Pending">
                            <img src={circle_3} alt="circle1" />
                        </span>
                    </div>
                </div>
                <div className="d-flex content-medical-options">
                    <Link to="/" className="d-flex choose-speci-box text-decoration-none">
                        <img src={doctor_1} alt="especialista" className="esp-pic" />
                        <p className="select-speciality">Choose a Speciality</p>
                    </Link>
                    <Link to="/" className="comming-s-box text-decoration-none">
                        <h3 className="comming-text">Medical</h3>
                        <h3 className="comming-text">History is</h3>
                        <h3 className="comming-text">Coming soon</h3>
                    </Link>
                </div>
            </div>
            <div className="col-sm-12 col-md-5 col-lg-5 pt-5">
                <div className="prof-list-container">
                    <h1 className="prof-sec-title">Appointment Status</h1>
                    <div className="content-scroll-list">
                        <div className="list-scrolled">
                            <ul className="ps-0">
                                {store.appointments.length > 0 ? (
                                    store.appointments.map((appt, index) => (
                                        <li key={index} className="content-appoint-data">
                                            <div className="data-text-appoint">
                                                <p className="name-appoint">{appt.doctorName}</p>
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
            {isModalOpen && (
                <Modals
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    profileData={profileData}
                    updateProfileData={updateProfileData}
                />
            )}
        </>
    );
};
