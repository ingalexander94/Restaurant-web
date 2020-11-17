import React, { useContext, useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import FirebaseContext from "../../firebase/context";
import { Loading } from "../ui/Loading";
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
    async function subscribe() {
      await firebase.auth.onAuthStateChanged(async (user) => {
        if (user) {
          setIsAuth(true);
          if (isFirts.current <= 3) {
            const userDB = await firebase.db.doc(`users/${user.uid}`).get();
            setChefAuth({
              uid: user.uid,
              name: userDB.data().name,
              email: user.email,
              role: userDB.data().role,
            });
            isFirts.current = isFirts.current + 1;
          }
        } else {
          setIsAuth(false);
          setChefAuth(null);
          isFirts.current = 1;
        }
        setTimeout(() => {
          setCheking(false);
        }, 1500);
      });
    }
    subscribe();
  }, [firebase.auth, firebase.db, isAuth, chefAuth]);

  if (cheking) return <Loading />;

  return (
    <Router>
      <Switch>
        <PrivateRouter
          component={DashboardRouter}
          path="/usuario"
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
