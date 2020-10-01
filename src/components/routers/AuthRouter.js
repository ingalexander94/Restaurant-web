import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { AddChef } from "../auth/AddChef";
import { Login } from "../auth/Login";
import "../styles.css";

export const AuthRouter = () => {
  return (
    <div className="container center">
      <div className="row">
        <div className="col-md-4 col-md-offset-4 mx-auto">
          <Switch>
            <Route path="/entrar">
              <Login />
            </Route>
            <Route path="/crear-cocinero">
              <AddChef />
            </Route>
            <Redirect to="/entrar" />
          </Switch>
        </div>
      </div>
    </div>
  );
};
