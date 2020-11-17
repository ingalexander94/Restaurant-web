import React, { useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";
import FirebaseContext from "../../firebase/context";
import AuthContext from "../auth/authContext";

export const Sidebar = () => {
  // Hooks
  const { firebase } = useContext(FirebaseContext);
  const chefAuth = useContext(AuthContext);
  const history = useHistory();

  const handleLogout = async () => {
    await firebase.auth.signOut();
    history.push("/entrar");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-ligth navbar-light">
        <div className="container-fluid">
          <div className="navbar-brand title-auth" style={{ fontSize: 30 }}>
            <img
              src={`${process.env.PUBLIC_URL}/assets/chef.svg`}
              alt="Cargando..."
              width="50"
              height="50"
              className="d-inline-block align-top mr-2"
            />
            <strong>Fo</strong>
            <strong className="text-secondary-custom">od</strong>
          </div>
          <button
            className="navbar-toggler btn-warning"
            type="button"
            data-toggle="collapse"
            data-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon text-warning"></span>
          </button>
          <div className="collapse navbar-collapse text-center" id="navbarText">
            <ul className="navbar-nav mr-auto text-center">
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  exact
                  to="/usuario/cocinero/ordenes"
                >
                  Ordenes
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" exact to="/usuario/cocinero/menu">
                  Menú
                </NavLink>
              </li>
              {chefAuth !== null && chefAuth.role === "administrador" && (
                <>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      exact
                      to="/usuario/administrador/crear-platillo"
                    >
                      Crear platillo
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      exact
                      to="/usuario/administrador/mis-ventas"
                    >
                      Mis Ventas
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
            <div className="navbar-brand text-gray">
              {chefAuth === null ? (
                <i className="ml-2 fas fa-spinner fa-pulse"></i>
              ) : (
                chefAuth.name
              )}
            </div>
            <button
              className="btn btn-danger btn-warning"
              onClick={handleLogout}
            >
              <i className="fas fa-power-off"></i>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};
