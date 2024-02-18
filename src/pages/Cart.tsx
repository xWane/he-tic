import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "@/api/firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { selectUserId } from "@/redux/slice/authSlice";
import { CartItem } from "@/api/type";

const ShoppingCartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const userId = useSelector(selectUserId);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!userId) return;
      const querySnapshot = await getDocs(
        collection(db, `carts/${userId}/items`)
      );
      const items: CartItem[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "Unknown Item",
          price: data.price || 0,
          imageUrl: data.imageUrl || "default-image.png",
          quantity: data.quantity || 1,
        };
      });
      setCartItems(items);
    };

    fetchCartItems();

    const calculateTotal = () => {
      const result = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      return Math.round(result * 100) / 100;
    };

    setTotal(calculateTotal());
  }, []);

  const handleRemoveItem = async (itemId: string) => {
    await deleteDoc(doc(db, `carts/${userId}/items`, itemId));
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateDoc(doc(db, `carts/${userId}/items`, itemId), {
      quantity: newQuantity,
    });
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <section className="bg-gray-100 p-4">
      <div className="container mx-auto">
        <h2 className="text-xl font-semibold">
          Shopping Cart ({cartItems.length} Items)
        </h2>
        <span>
          Total: <strong>${total}</strong>
        </span>
        <div className="mt-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center mb-4"
            >
              <div className="flex items-center">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-16 w-16 object-cover mr-4"
                />
                <div>
                  <h5 className="font-semibold">{item.name}</h5>
                  <p>${item.price}</p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity - 1)
                  }
                >
                  -
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity + 1)
                  }
                >
                  +
                </button>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="ml-4 text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShoppingCartPage;
