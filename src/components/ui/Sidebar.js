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
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="navbar-brand">
          {chefAuth === null ? (
            <i className="ml-2 fas fa-spinner fa-pulse"></i>
          ) : chefAuth.name !== null ? (
            chefAuth.name
          ) : (
            "RestauranteApp"
          )}
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink className="nav-link" exact to="/cocinero/ordenes">
                Ordenes
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" exact to="/cocinero/menu">
                Menú
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" exact to="/cocinero/crear-platillo">
                Crear platillo
              </NavLink>
            </li>
          </ul>
          <button className="btn btn-danger" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </nav>
    </>
  );
};
