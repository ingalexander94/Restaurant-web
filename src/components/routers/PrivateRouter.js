import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import AuthContext from "../auth/authContext";

const PrivateRouter = ({
  isAuthenticated,
  chefAuth,
  component: Component,
  ...res
}) => {
  return (
    <Route
      {...res}
      component={(props) =>
        isAuthenticated ? (
          <AuthContext.Provider value={chefAuth}>
            <Component {...props} />
          </AuthContext.Provider>
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

PrivateRouter.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
};

export default PrivateRouter;
