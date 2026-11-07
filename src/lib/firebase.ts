import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA4jDjFblS_9jPVsr957f5ILhwwupFbvBQ",
  authDomain: "wysportfolio.firebaseapp.com",
  databaseURL: "https://wysportfolio-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wysportfolio",
  storageBucket: "wysportfolio.firebasestorage.app",
  messagingSenderId: "854871643803",
  appId: "1:854871643803:web:6751e3431178fd47bed83e",
  measurementId: "G-FH1Z5JSZWJ"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getDatabase(app);
export const auth = getAuth(app);
export default app;
