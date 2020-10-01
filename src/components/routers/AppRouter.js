import React, { useContext, useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import FirebaseContext from "../../firebase/context";
import { AuthRouter } from "./AuthRouter";
import { DashboardRouter } from "./DashboardRouter";
import PrivateRouter from "./PrivateRouter";
import PublicRouter from "./PublicRouter";

export default function AppRouter() {
  const { firebase } = useContext(FirebaseContext);
  const [isAuth, setIsAuth] = useState(false);
  const [chefAuth, setChefAuth] = useState(null);
  const [cheking, setCheking] = useState(true);
  const isFirts = useRef(1);

  useEffect(() => {
    let unsubscribe = firebase.auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuth(true);
        if (isFirts.current <= 3) {
          setChefAuth({
            uid: user.uid,
            name: user.displayName,
            email: user.email,
          });
          isFirts.current = isFirts.current + 1;
        }
      } else {
        setIsAuth(false);
        setChefAuth(null);
        isFirts.current = 1;
      }
      setCheking(false);
    });

    return () => {
      unsubscribe();
    };
  }, [firebase.auth, isAuth, chefAuth]);

  if (cheking) return <h1>Cargando...</h1>;

  return (
    <Router>
      <Switch>
        <PrivateRouter
          component={DashboardRouter}
          path="/cocinero"
          isAuthenticated={isAuth}
          chefAuth={chefAuth}
        />
        <PublicRouter
          path="/"
          isAuthenticated={isAuth}
          component={AuthRouter}
        />
      </Switch>
    </Router>
  );
}
