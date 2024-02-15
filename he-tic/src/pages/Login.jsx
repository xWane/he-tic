import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

import { auth } from "../../firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email && password) {
        try {
            // Assurez-vous que les noms des clés correspondent à ceux attendus par votre API
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    userCredential.user;
                    document.body.innerHTML = '<h1>Vous êtes maintenant connecté !</h1>';
                    // ...
                })
                .catch((error) => {
                    error.code;
                    error.message;
                }); 
    
        } catch (error) {
            console.error('Login failed', error);
        }
    } else {
        console.log('Please fill in all fields correctly');
    }

    // fake login for now
    localStorage.setItem("id", 1);
    localStorage.setItem("role", 1);

    if (localStorage.getItem("role") === 1) {
      navigate("/customer_page");
    } else if (localStorage.getItem("role") === 3) {
      navigate("/manager_page");
    } else if (localStorage.getItem("role") === 5) {
      navigate("/admin_page");
    } else {
      navigate("/login");
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="w-full flex justify-center items-center h-screen bg-gray-100">
      <form
        className="p-10 bg-white rounded flex justify-center items-center flex-col shadow-md"
        onSubmit={handleSubmit}
      >
        <p className="mb-5 text-3xl uppercase text-gray-600">Login</p>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          className="mb-5 p-3 w-80 focus:border-purple-700 rounded border-2 outline-none"
          autoComplete="off"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="mb-5 p-3 w-80 focus:border-purple-700 rounded border-2 outline-none"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-purple-700 text-white py-2 px-4 rounded"
        >
          Login
        </button>
        <div className="mt-5">
          Don&apos;t have an account?
          <NavLink to="/register" className="text-blue-600 hover:underline">
            Register
          </NavLink>
        </div>
      </form>
    </div>
  );
};

export default Login;
