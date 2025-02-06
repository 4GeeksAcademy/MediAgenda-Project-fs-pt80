import React from "react";
import image18 from "../../img/Group21.png";
import { Footer } from "../component/footer.jsx";

export const SupportPage = () => {
  return (
    <div className="support-container">
      {/* Sección del Formulario */}
      <div className="form-box">
        <form>
          <label>First Name:</label>
          <input type="text" defaultValue="Alice" />

          <label>Last Name:</label>
          <input type="text" defaultValue="Roa" />

          <label>Email:</label>
          <input type="email" defaultValue="alicero@medi.com" disabled />

          <label>Tell us briefly what is the problem?:</label>
          <textarea rows="4"></textarea>

          <button type="submit">Send</button>
        </form>

      </div>

      {/* Sección de Vista Previa en Móvil */}
      <div className="mobile-preview">
        <div className="mobile-frame">
          <img src={image18} alt="Mobile Preview" />
        </div>     
      </div>
    </div>
  );
};
