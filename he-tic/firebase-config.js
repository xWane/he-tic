// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASl8PMplHxKU21EmYm0AFcBuYhBbvTuFo",
  authDomain: "e-random-7f36f.firebaseapp.com",
  projectId: "e-random-7f36f",
  storageBucket: "e-random-7f36f.appspot.com",
  messagingSenderId: "619472733856",
  appId: "1:619472733856:web:8e227b25b1578a8cebabc5",
  measurementId: "G-N81BN4406Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log(app);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);


export {
  app, auth,
}