import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";


import { Home } from "./pages/home.jsx";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";


import { Navbar } from "./component/navbar.jsx";
import { Footer } from "./component/footer.jsx";
import { Login } from "./component/login.jsx";
import { Register } from "./component/register.jsx";
import { Modals } from "./component/editinformation.jsx";
import { Profile } from "./pages/profile.jsx";
import { BookAppointment } from "./component/book_appointment.jsx";
import { Calendar } from "./component/calendar.jsx";
import { AboutUs } from "./component/about_us.jsx";




import { TestInterface } from "./component/test.jsx";
import { SupportPage } from "./pages/suppor.js";


//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<SupportPage />} path="/suppor" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Register />} path="/register" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<Modals />} path="/editinformation" />
                        <Route element={<Profile />} path="/profile" />
                        <Route element={<BookAppointment />} path="/book_appointment" />
                        <Route element={<Calendar />} path="/calendar" /> 
                        <Route element={<Footer />} path="/footer" />
                        <Route element={<TestInterface />} path="/test" />
                        <Route element={<AboutUs />} path="/aboutus" />
                        {/* <Route element={<Register />} path="/register" /> */}
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
