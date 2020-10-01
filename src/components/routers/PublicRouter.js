import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

const PublicRouter = ({ isAuthenticated, component: Component, ...res }) => {
  return (
    <Route
      {...res}
      component={(props) =>
        !isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/cocinero/ordenes" />
        )
      }
    />
  );
};

PublicRouter.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
};

export default PublicRouter;
