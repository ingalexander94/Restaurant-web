import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { AddSaucer } from "../pages/AddSaucer";
import { Menu } from "../pages/Menu";
import { Orders } from "../pages/Orders";
import { Sidebar } from "../ui/Sidebar";

export const DashboardRouter = () => {
  return (
    <>
      <Sidebar />
      <div className="container">
        <Switch>
          <Route exact path="/cocinero/ordenes">
            <Orders />
          </Route>
          <Route exact path="/cocinero/menu">
            <Menu />
          </Route>
          <Route exact path="/cocinero/crear-platillo">
            <AddSaucer />
          </Route>
          <Redirect to="/cocinero/ordenes" />
        </Switch>
      </div>
    </>
  );
};
