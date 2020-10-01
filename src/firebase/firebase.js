import app from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import firebaseConfig from "./config";

class Firebase {
  constructor() {
    !app.apps.length && app.initializeApp(firebaseConfig);
    this.db = app.firestore();
    this.storage = app.storage();
    this.auth = app.auth();
  }
}

const firebase = new Firebase();

export default firebase;
