import React from "react";
import AppRouter from "./components/routers/AppRouter";
import FirebaseContext from "./firebase/context";
import firebase from "./firebase/firebase";

const RestaurantApp = () => {
  return (
    <FirebaseContext.Provider value={{ firebase }}>
      <AppRouter />
    </FirebaseContext.Provider>
  );
};

export default RestaurantApp;
