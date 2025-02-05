//import react into the bundle
import React from "react";
import ReactDOM from "react-dom/client";


//include your index.scss file into the bundle
import "../styles/index.css";
import "../styles/navbar.css";
import "../styles/BookAppointment.css";
import "../styles/profile.css";
import "../styles/footer.css";
import "../styles/login.css";
import "../styles/register.css";
import "../styles/editinformation.css";
import "../styles/calendar.css"
import "../styles/about_us.css"


import "../styles/home.css";


//import your own components
import Layout from "./layout";

const root = ReactDOM.createRoot(document.getElementById("app"));

root.render(
  <React.StrictMode>
    <Layout />
  </React.StrictMode>
);
