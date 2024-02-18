import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6PVNV96KYzdo0yL6xVvYZkcnM2nIruak",
  authDomain: "he-ticien.firebaseapp.com",
  projectId: "he-ticien",
  storageBucket: "he-ticien.appspot.com",
  messagingSenderId: "524064272900",
  appId: "1:524064272900:web:ba2caf75869f4e66273b51",
  measurementId: "G-7TNJBM310M"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
