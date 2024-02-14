import { signInWithEmailAndPassword } from "../node_modules/firebase/firebase-auth.js";
import {
  app, auth,
} from "./firebase-config.js"


var email = document.getElementById('email').value;
var password = document.getElementById('password').value;
var form = document.getElementById('login-form');

window.onload=()=>{
  function login(e) {
    e.preventDefault();
    console.log(email);
    console.log(password);
    
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        document.body.innerHTML = '<h1>Vous êtes maintenant connecté !</h1>';
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      }); 
    
    }

    form.addEventListener("submit",(e)=>login(e));
}






