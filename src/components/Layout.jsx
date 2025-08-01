import React from "react";

const Layout = ({ children }) => {
  return (
    <>
      {/* HEADER */}
      <header className="header fixed-top">
        <div className="container-fluid container-xl d-flex align-items-center justify-content-between">
          <a href="/" className="logo d-flex align-items-center">
            <img src="/logo.png" alt="Logo" style={{ maxHeight: "36px", marginRight: "8px" }} />
            <h1>JINED Ticket System</h1>
          </a>
          <div className="logout-btn-container">
            <button className="logout-btn">Cerrar Sesión</button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main style={{ paddingTop: "100px" }}>
        {children}
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="copyright">
            © Copyright <strong><span>JINED Ticket System</span></strong>. Todos los derechos reservados
          </div>
        </div>
      </footer>
    </>
  );
};

export default Layout;