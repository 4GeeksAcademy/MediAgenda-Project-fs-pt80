import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const Modals = ({ isOpen, onClose }) => {
  const { store, actions } = useContext(Context);
  const [formData, setFormData] = useState(store.profile || {}); 
  const [errors, setErrors] = useState({});

  // 🔹 Sincroniza el estado del modal con `store.profile`
  useEffect(() => {
    setFormData(store.profile || {});
  }, [store.profile]);

  // 🔹 Manejo de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.trim() === "" ? null : value, // Evitar cadenas vacías
    }));
  };

  // 🔹 Validar campos antes de enviar
  const validate = () => {
    let newErrors = {};
    if (!formData.telefono) {
      newErrors.telefono = "El teléfono es obligatorio";
    }
    return newErrors;
  };

  // 🔹 Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // ✅ Actualizar perfil en el store y backend
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
            <h5 className="modal-title">Edit Information</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">First Name:</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="apellido" className="form-label">Last Name:</label>
                <input
                  type="text"
                  className="form-control"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="telefono" className="form-label">
                  Phone Number: <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
                  id="telefono"
                  name="telefono"
                  value={formData.telefono || ""}
                  onChange={handleChange}
                />
                {errors.telefono && (
                  <div className="invalid-feedback">{errors.telefono}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="direccion" className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cerrar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
