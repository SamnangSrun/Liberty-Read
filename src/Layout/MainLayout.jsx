import  Footer  from "../Components/Index/Footer.jsx";
import  Navbar  from "../Components/Index/Navbar.jsx";
import React from "react";

import { Outlet } from "react-router-dom";


const MainLayout = () => {
  return (
    <>
      <header>
        <Navbar/>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <Footer/>
      </footer>
    </>
  );
};

export default MainLayout;
