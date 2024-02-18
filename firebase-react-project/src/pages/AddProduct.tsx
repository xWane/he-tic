import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import React, { useState } from "react";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "@/api/firebase";
import useToast from "@/hooks/Toaster";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserState } from "@/redux/slice/authSlice";

const AddProductPage: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const userName = useSelector(selectUserState);

  const showToast = useToast();
  const navigate = useNavigate();

  /**
   * This function is used to handle the image change event
   * @param event
   */
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const sellerName = userName;

    if (imagePreview && name && price && description) {
      const imageRef = ref(storage, `images/${new Date().getTime()}_${name}`);
      const file = (document.getElementById("image") as HTMLInputElement)
        .files![0];

      try {
        const snapshot = await uploadBytes(imageRef, file);
        const imageUrl = await getDownloadURL(snapshot.ref);

        const productData = {
          title: name,
          price: price,
          description: description,
          imageUrl: imageUrl,
          date: new Date(),
          sellerName: sellerName,
        };

        await addDoc(collection(db, "products"), productData);
        showToast(
          "success",
          "Product added successfully for  product: " + name
        );

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (error) {
        console.error("Error adding product: ", error);
        showToast("error", "Error adding product: " + error);
      }
    } else {
      showToast("error", "Please fill all the fields");
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form className="w-96" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-4">Add Product</h1>
        {imagePreview && (
          <img src={imagePreview} alt="Product Preview" className="mb-4" />
        )}
        <div>
          <Label htmlFor="image">Product Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-4"
          />
        </div>
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mb-4"
          />
        </div>
        <div>
          <Label htmlFor="price">Product Price</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className="mb-4"
          />
        </div>
        <div>
          <Label htmlFor="description">Product Description</Label>
          <Input
            id="description"
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="mb-4"
          />
        </div>
        <Button type="submit">Add Product</Button>
      </form>
    </div>
  );
};

export default AddProductPage;
