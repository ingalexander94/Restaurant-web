import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { AddSaucer } from "../pages/AddSaucer";
import { Menu } from "../pages/Menu";
import { MySales } from "../pages/MySales";
import { Orders } from "../pages/Orders";
import { Sidebar } from "../ui/Sidebar";

export const DashboardRouter = () => {
  return (
    <>
      <Sidebar />
      <div className="container">
        <Switch>
          <Route exact path="/usuario/cocinero/ordenes">
            <Orders />
          </Route>
          <Route exact path="/usuario/cocinero/menu">
            <Menu />
          </Route>
          <Route exact path="/usuario/administrador/crear-platillo">
            <AddSaucer />
          </Route>
          <Route exact path="/usuario/administrador/mis-ventas">
            <MySales />
          </Route>
          <Redirect to="/usuario/cocinero/ordenes" />
        </Switch>
      </div>
    </>
  );
};
