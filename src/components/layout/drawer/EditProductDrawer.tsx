import React, { useEffect, useState } from "react";
import { db } from "@/api/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Product } from "@/api/type";
import useToast from "@/hooks/Toaster";

interface EditProductDrawerProps {
  isOpen: boolean;
  currentProductData: Product | null;
  onClose: () => void;
}

const EditProductDrawer: React.FC<EditProductDrawerProps> = ({
  isOpen,
  currentProductData,
  onClose,
}) => {
  const showToast = useToast();

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (currentProductData) {
      setFormData({
        title: currentProductData.title,
        price: currentProductData.price.toString(),
        description: currentProductData.description,
        imageUrl: currentProductData.imageUrl,
      });
    }
  }, [currentProductData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentProductData && currentProductData.id) {
      const productRef = doc(db, "products", currentProductData.id);
      try {
        await updateDoc(productRef, {
          ...formData,
          price: parseFloat(formData.price),
        });

        showToast("success", "Product updated successfully");
      } catch (error) {
        showToast("error", "Error updating product: " + error);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      price: "",
      description: "",
      imageUrl: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={handleCancel}
      ></div>
      <div className="fixed right-0 top-0 h-full w-full max-w-md overflow-auto bg-white p-5">
        <button onClick={handleCancel} className="text-black">
          Close
        </button>
        <form className="mt-4">
          <div className="mb-4">
            <label htmlFor="title" className="block">
              Product Name
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="border border-gray-300 rounded px-2 py-1"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block">
              Price
            </label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              className="border border-gray-300 rounded px-2 py-1"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border border-gray-300 rounded px-2 py-1"
            ></textarea>
          </div>
          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="Product preview"
              className="mb-4"
            />
          )}
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Update Product
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProductDrawer;
