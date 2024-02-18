import { auth, db } from "@/api/firebase";
import useToast from "@/hooks/Toaster";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { RESET_ACTIVE_USER, SET_ACTIVE_USER } from "@/redux/slice/authSlice";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");

  const showToast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function getNameFromEmail(email: string) {
    return email.substring(0, email.indexOf("@"));
  }

  const getUserRole = async (userId: string) => {
    const userDocRef = doc(db, "users", userId);
    try {
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        return userDocSnap.data().role;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting user role:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const uid = user.uid;
          const email = user.email;
          let displayName = "";
          const role = await getUserRole(user.uid);

          if (user.displayName === null) {
            displayName = getNameFromEmail(email!);
          } else {
            displayName = user.displayName;
          }
          dispatch(
            SET_ACTIVE_USER({
              email: email!,
              userName: displayName || getNameFromEmail(email!),
              userId: uid,
              userRole: role,
              isLogged: true,
            })
          );

          setUserName(displayName || email!);
          setRole(role);
        } catch (error) {
          console.error("Error getting user role:", error);
        }
      } else {
        dispatch(
          RESET_ACTIVE_USER({
            userId: null,
            userName: null,
            email: null,
            userRole: null,
            isLogged: false,
          })
        );
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const logoutCurrentUser = () => {
    signOut(auth)
      .then(() => {
        setUserName("");
        showToast("success", "User logged out successfully");

        navigate("/home");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.error({ errorCode, errorMessage });
        showToast("error", errorMessage);
      });
  };

  return (
    <header className="flex w-full items-center bg-wp-900 h-[8svh]">
      <div className="w-full px-0 lg:px-4">
        <div className="relative  flex items-center justify-between">
          <div className="w-1/3 px-4 flex items-center justify-start">
            <NavLink
              to="/"
              className=" py-5 lg:py-3 flex items-center gap-2 hover:opacity-80 hover:scale-95 transition"
            >
              <h1 className="paragraph text-typo-reverse">Ecommerce</h1>
            </NavLink>
          </div>
          <div className="w-1/3">
            <button
              title="Toggle Navbar"
              onClick={() => setOpen(!open)}
              className={` ${
                open && "navbarTogglerActive"
              } absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] lg:hidden`}
            >
              <i className="fas fa-bars text-typo-reverse"></i>
            </button>
            <nav
              className={`absolute right-4 top-full z-50 w-full max-w-[250px] justify-center rounded-lg bg-wp-800 px-6 py-5 shadow lg:static lg:flex lg:w-full lg:max-w-full lg:bg-transparent lg:py-0 lg:shadow-none ${
                !open && "hidden"
              } `}
            >
              <span className="block lg:flex lg:gap-4 lg:items-center lg:justify-end">
                <ListItem link="/home">Home</ListItem>
                {role === "seller" && (
                  <ListItem link="/new-product">Add Product</ListItem>
                )}
                {role === "customer" && <ListItem link="/cart">Cart</ListItem>}
              </span>
            </nav>
          </div>
          <div className="flex w-1/3 items-center justify-end px-4">
            <div className="hidden justify-end pr-16 sm:flex lg:pr-0 gap-4 items-center">
              <span className="block lg:flex lg:gap-4 lg:items-center lg:justify-end text-sm">
                {role === "seller" || role === "customer" ? (
                  <span className="paragraph text-typo-reverse">
                    Welcome, {role}{" "}
                    <span className="text-blue-500">{userName}</span>
                  </span>
                ) : (
                  <span className="paragraph text-typo-reverse">
                    Welcome, Guest
                  </span>
                )}
              </span>
              <div className="flex justify-end gap-4 items-center">
                {userName ? (
                  <button
                    onClick={logoutCurrentUser}
                    className=" flex items-center gap-2 hover:opacity-80 hover:scale-95 transition text-red-500"
                  >
                    <h1 className="paragraph text-typo-reverse">Logout</h1>
                  </button>
                ) : (
                  <NavLink
                    to="/login"
                    className="flex items-center gap-2 hover:opacity-80 hover:scale-95 transition text-blue-500"
                  >
                    <h1 className="paragraph text-typo-reverse">Login</h1>
                  </NavLink>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
const ListItem = ({
  children,
  link,
}: {
  children: React.ReactNode;
  link: string;
}) => {
  return (
    <NavLink
      to={link}
      className="flex py-2 paragraph font-medium text-typo-reverse hover:opacity-80"
    >
      {children}
    </NavLink>
  );
};
