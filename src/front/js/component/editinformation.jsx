// editinformation.jsx
import React, { useState, useEffect } from "react";

export const Modals = ({ isOpen, onClose, profileData, updateProfileData }) => {
  const [formData, setFormData] = useState(profileData);
  const [errors, setErrors] = useState({});

  // Sincroniza el estado local con la data recibida por props
  useEffect(() => {
    setFormData(profileData);
  }, [profileData]);

  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validación de campos obligatorios
  const validate = () => {
    let newErrors = {};
    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio";
    }
    if (!formData.securityNumber.trim()) {
      newErrors.securityNumber = "El número de seguridad social es obligatorio";
    }
    return newErrors;
  };

  // Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Se actualiza el perfil llamando a la función updateProfileData
    await updateProfileData(formData);
    onClose();
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
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">
                  Nombre
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="apellido" className="form-label">
                  Apellido
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="telefono" className="form-label">
                  Teléfono <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                />
                {errors.telefono && (
                  <div className="invalid-feedback">{errors.telefono}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="direccion" className="form-label">
                  Dirección
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="securityNumber" className="form-label">
                  Número de Seguridad Social <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.securityNumber ? "is-invalid" : ""}`}
                  id="securityNumber"
                  name="securityNumber"
                  value={formData.securityNumber}
                  onChange={handleChange}
                />
                {errors.securityNumber && (
                  <div className="invalid-feedback">{errors.securityNumber}</div>
                )}
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
