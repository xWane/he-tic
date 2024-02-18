// Correction de ProtectedRoutes pour qu'il retourne un unique élément Routes.
import { selectUserRole, selectUserState } from "@/redux/slice/authSlice";
import { lazy, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

const Auth = lazy(() => import("@/pages/Auth"));
const Home = lazy(() => import("@/pages/Home"));
const Cart = lazy(() => import("@/pages/Cart"));
const AddProduct = lazy(() => import("@/pages/AddProduct"));
const SellerProducts = lazy(() => import("@/pages/SellerProducts"));

export default function AppRoutes() {
  const isLogged = useSelector(selectUserState);
  const userRole = useSelector(selectUserRole);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(userRole);
  }, [userRole]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      {isLogged && role === "customer" && (
        <Route path="/cart" element={<Cart />} />
      )}
      {isLogged && role === "seller" && (
        <>
          <Route path="/new-product" element={<AddProduct />} />
          <Route path="/my-products" element={<SellerProducts />} />
        </>
      )}
      {!isLogged && (
        <>
          <Route path="/login/*" element={<Auth type="login" />} />
          <Route path="/register/*" element={<Auth type="register" />} />
        </>
      )}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
