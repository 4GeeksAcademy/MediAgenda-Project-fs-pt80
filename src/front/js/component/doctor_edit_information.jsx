import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const DoctorModal = ({ isOpen, onClose }) => {
    const { store, actions } = useContext(Context);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (isOpen) {
            setFormData(store.profile || {});
        }
    }, [isOpen, store.profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await actions.updateProfile(formData);
        if (success) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Editar Información</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div>
                                <p>First Name:</p>
                                <input type="text" className="form-control mb-3" name="nombre" value={formData.nombre || ""} onChange={handleChange} placeholder="First Name"/>
                            </div>
                            <div>
                                <p>Last Name:</p>
                                <input type="text" className="form-control mb-3" name="apellido" value={formData.apellido || ""} onChange={handleChange} placeholder="Last Name"/>
                            </div>
                            <div>
                                <p>Phone Number:</p>
                                <input type="text" className="form-control mb-3" name="telefono_oficina" value={formData.telefono_oficina || ""} onChange={handleChange} placeholder="645050920"/>
                            </div>
                            <div>
                                <p>Clinic Name or Office Name:</p>
                                <input type="text" className="form-control mb-3" name="clinica" value={formData.clinica || ""} onChange={handleChange} placeholder="Country Clinic"/>
                            </div>
                            <div>
                                <p>Address:</p>
                                <input type="text" className="form-control mb-3" name="direccion_centro_trabajo" value={formData.direccion_centro_trabajo || ""} onChange={handleChange} placeholder="Number 4 of Privet Drive"/>
                            </div>
                            <div>
                                <p>Personal Description:</p>
                                <input type="text" className="form-control mb-3" name="descripcion" value={formData.descripcion || ""} onChange={handleChange} placeholder="I am Dermatologist...."/>
                            </div>
                        
                            
                            
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                            <button type="submit" className="btn btn-primary">Guardar cambios</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
