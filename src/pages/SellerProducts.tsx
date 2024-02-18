import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/api/firebase";
import { selectUserId, selectUserRole } from "@/redux/slice/authSlice";
import ProductCard from "@/components/productCard";
import useToast from "@/hooks/Toaster";
import { Product } from "@/api/type";
import { useNavigate } from "react-router-dom";
import EditProductDrawer from "@/components/layout/drawer/EditProductDrawer";

const SellerProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const userId = useSelector(selectUserId);
  const userRole = useSelector(selectUserRole);

  const showToast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setRole(userRole);
    const fetchSellerProducts = async () => {
      if (!userId) {
        showToast("error", "User not found");
        return;
      }

      const q = query(
        collection(db, "products"),
        where("sellerId", "==", userId)
      );
      try {
        const querySnapshot = await getDocs(q);
        const productsList: Product[] = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Product)
        );
        setProducts(productsList);
      } catch (error) {
        showToast("error", "Failed to fetch products");
        console.error("Error fetching seller products: ", error);
      }
    };

    if (userRole === "seller") {
      fetchSellerProducts();
    } else {
      showToast("error", "You are not authorized to view this page");
      navigate("/");
    }
  }, []);

  const handleEditClick = useCallback(
    (product: Product) => {
      console.log("Attempt to edit product: ", product);
      if (editingProduct?.id !== product.id) {
        setEditingProduct(product);
        setIsEditDrawerOpen(true);
      } else if (isEditDrawerOpen) {
        setIsEditDrawerOpen(false);
      } else {
        setIsEditDrawerOpen(true);
      }
    },
    [editingProduct, isEditDrawerOpen]
  );

  const closeEditDrawer = () => {
    setIsEditDrawerOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteClick = async (product: Product) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", product.id));
        showToast("success", `${product.title} successfully deleted`);
        const updatedProducts = products.filter((p) => p.id !== product.id);
        setProducts(updatedProducts);
      } catch (error) {
        console.error("Error deleting product: ", error);
        showToast("error", "Failed to delete the product");
      }
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-xl font-semibold mb-4">My Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.length === 0 ? (
          <p>You don't have any products yet</p>
        ) : (
          <>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                image={product.imageUrl}
                name={product.title}
                details={product.description}
                price={product.price.toString()}
                sellerName={product.sellerName}
                role={role!}
                product={product}
                onEditItem={() => handleEditClick(product)}
                onDeleteItem={() => handleDeleteClick(product)}
              />
            ))}
          </>
        )}
      </div>
      <EditProductDrawer
        isOpen={isEditDrawerOpen}
        currentProductData={editingProduct}
        onClose={closeEditDrawer}
      />
    </div>
  );
};

export default SellerProductsPage;
