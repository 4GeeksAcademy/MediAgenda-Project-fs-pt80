import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import moment from "moment";
import { signInWithGoogle } from "../component/gapi_auth.jsx";

export const Calendar = () => {
    const { store, actions } = useContext(Context);
    const [currentMonth, setCurrentMonth] = useState(moment()); 
    const [selectedDay, setSelectedDay] = useState(null); 

    useEffect(() => {
        actions.fetchDoctors();
    }, []);

    useEffect(() => {
        if (store.selectedDoctor) {
            actions.fetchAvailability(store.selectedDoctor);
        }
    }, [store.selectedDoctor]);

    const handleGoogleLogin = async () => {
        const googleToken = await signInWithGoogle();
        if (googleToken) {
            actions.saveGoogleToken(googleToken);
            actions.fetchAppointments();
        }
    };

    const handleGoogleLogout = () => {
        actions.googleLogOut();
    };

    const handlePrevSpeciality = () => {
        actions.setPreviousSpeciality();
    };

    const handleNextSpeciality = () => {
        actions.setNextSpeciality();
    };

    const handleSelectDoctor = (doctorId) => {
        actions.setSelectedDoctor(doctorId);
        actions.fetchAvailability(doctorId);  // 🔹 Cargar disponibilidad al seleccionar doctor
    };

    const handleSelectDay = (date) => {
        setSelectedDay(date);
    };

    const handleReserveAppointment = async (time) => {
        if (!store.selectedDoctor || !selectedDay || !store.user) {
            alert("Selecciona un médico y una fecha antes de agendar la cita.");
            return;
        }
        const appointmentData = {
            appointment_date: selectedDay,
            appointment_time: time,
            medico_id: store.selectedDoctor,
            paciente_id: store.user.id,
            estado: "confirmada"
        };
        await actions.createAppointment(appointmentData);
    };

    const handleCancelAppointment = async (eventId) => {
        await actions.cancelAppointment(eventId);
    };

    const handlePrevMonth = () => {
        setCurrentMonth(prev => prev.clone().subtract(1, "month"));
    };

    const handleNextMonth = () => {
        setCurrentMonth(prev => prev.clone().add(1, "month"));
    };

    const renderCalendar = () => {
        const startOfMonth = currentMonth.clone().startOf("month");
        const endOfMonth = currentMonth.clone().endOf("month");
        const startDay = startOfMonth.day();
        const daysInMonth = [];
        const availabilityDates = store.availability.map(slot => moment(slot.fecha).format("YYYY-MM-DD"));

        for (let i = 0; i < startDay; i++) {
            daysInMonth.push({ day: "", date: null, isAvailable: false });
        }

        for (let day = startOfMonth; day.isBefore(endOfMonth, "day"); day.add(1, "day")) {
            const dayStr = day.format("YYYY-MM-DD");
            const isAvailable = availabilityDates.includes(dayStr);
            daysInMonth.push({ day: day.format("DD"), date: dayStr, isAvailable });
        }

        return (
            <div className="calendar-appointment ">
                <div className="calendar-header-appo">
                    <button className="calendar-nav-button" onClick={handlePrevMonth}>&#8592;</button>
                    <h3 className="title-date">{currentMonth.format("MMMM YYYY")}</h3>
                    <button className="calendar-nav-button" onClick={handleNextMonth}>&#8594;</button>
                </div>
                <div className="calendar-grid">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                        <div key={day} className="calendar-day-name">{day}</div>
                    ))}
                    {daysInMonth.map((day, index) => (
                        <div
                            key={index}
                            className={`calendar-day ${day.isAvailable ? "available" : ""}`}
                            onClick={() => day.date && handleSelectDay(day.date)}
                        >
                            {day.day}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderAvailableTimes = () => {
        if (!selectedDay || store.availability.length === 0) {
            return <p>No hay horas disponibles para el día seleccionado.</p>;
        }

        const availableSlots = store.availability.filter(slot =>
            moment(slot.fecha).format("YYYY-MM-DD") === selectedDay
        );

        return (
            <div className="pat-appointment-list">
                <h3 className="title-available">Available hours</h3>
                {availableSlots.map((slot) => (
                    <p key={`${slot.fecha}-${slot.hora_inicio}`} className="doctor-schedule">
                        {slot.hora_inicio} - {slot.hora_final}
                        <button className="appointment-schedule-button" onClick={() => handleReserveAppointment(slot.hora_inicio)}>
                            Schedule
                        </button>
                    </p>
                ))}
            </div>
        );
    };

    return (
        <>
            <div className="content-availa-section">
                <div className="title-container container">
                    <h1 className="calendar-title-p">Schedule an Appointment</h1>
                </div>

                {!store.googleAccessToken ? (
                    <div className="content-login-google">
                        <button className="login-google" onClick={handleGoogleLogin}>Login with Google</button>
                    </div>
                ) : (
                    <div className="content-logout-google container">
                        <button className="google-logout" onClick={handleGoogleLogout}>Logout with Google</button>
                    </div>
                )}

                <div className="d-flex justify-content-center">
                    <div className="appointment-carousel">
                        <button className="appointment-carousel-arrow" onClick={handlePrevSpeciality}>&#8592;</button>
                        <div className="appointment-carousel-item active">{store.selectedSpeciality}</div>
                        <button className="appointment-carousel-arrow" onClick={handleNextSpeciality}>&#8594;</button>
                    </div>
                </div>

                <div className="appointment-specialty-doctors ms-2">
                    <ul>
                        {Array.isArray(store.doctors) && store.doctors.length > 0 ? (
                            store.doctors
                                .filter(doctor => doctor.especialidades?.includes(store.selectedSpeciality))
                                .map(doctor => (
                                    <li key={doctor.id} className={`appointment-doctor-item ${store.selectedDoctor === doctor.id ? "selected" : ""}`} 
                                        onClick={() => handleSelectDoctor(doctor.id)}>
                                        {doctor.nombre} {doctor.apellido}
                                    </li>
                                ))
                        ) : (
                            <p className="title-available">No doctors available</p>
                        )}
                    </ul>
                </div>

                <div className="calendar-container-appo">
                    {renderCalendar()}
                </div>

                {selectedDay && renderAvailableTimes()}

                <div className="schedule-list container">
                    {store.appointments && store.appointments.length > 0 ? (
                        store.appointments.map(appt => (
                            <div className="d-flex justify-content-between align-items-baseline">
                                <p key={`${appt.google_event_id || appt.id}-${appt.appointment_date}-${appt.appointment_time}`} className="book-appointment-item">
                                    {appt.appointment_date} {appt.appointment_time} - con Dr./Dra. {appt.doctor?.nombre || "Unknown"} {appt.doctor?.apellido || ""}
                                </p>
                                <button className="cal-delete-button" onClick={() => handleCancelAppointment(appt.google_event_id)}>
                                    Cancel
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="no-appointment-msg">No appointments scheduled</p>
                    )}
                </div>
            </div>
        </>
    );
};
