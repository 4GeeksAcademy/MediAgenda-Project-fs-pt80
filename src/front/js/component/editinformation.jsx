import React, { useState } from "react";

export const Modals = ({ isOpen, onClose, profileData, updateProfileData }) => {
    const [formData, setFormData] = useState(profileData);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfileData(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content shadow">
                <button className="btn-close close-button" onClick={onClose}></button>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label modal-label">First Name:</label>
                        <input
                            type="text"
                            className="form-control modal-input"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label modal-label">Last Name:</label>
                        <input
                            type="text"
                            className="form-control modal-input"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label modal-label">Phone Number:</label>
                        <input
                            type="tel"
                            className="form-control modal-input"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label modal-label">Email:</label>
                        <input
                            type="email"
                            className="form-control modal-input"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label modal-label">Address (Optional):</label>
                        <input
                            type="text"
                            className="form-control modal-input"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label modal-label" required>Social Security Number:</label>
                        <input
                            type="text"
                            className="form-control modal-input"
                            name="securityNumber"
                            value={formData.securityNumber}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary save-button">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};