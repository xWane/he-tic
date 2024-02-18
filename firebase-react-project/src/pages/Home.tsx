import { useCallback, useEffect, useRef, useState } from "react";

import { useSelector } from "react-redux";
import { selectUserId, selectUserRole } from "@/redux/slice/authSlice";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/api/firebase";
import { Product } from "@/api/type";

import useToast from "@/hooks/Toaster";
import ProductCard from "@/components/productCard";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const ProductCarousel5 = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const sliderRef = useRef(null);

  const showToast = useToast();
  const userRole = useSelector(selectUserRole);
  const userId = useSelector(selectUserId);

  const handlePrev = useCallback(() => {
    // @ts-expect-error Property 'swiper' does not exist on type 'never'.ts(2339)
    sliderRef.current?.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    // @ts-expect-error Property 'swiper' does not exist on type 'never'.ts(2339)
    sliderRef.current?.swiper.slideNext();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsList: Product[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Product, "id">;
        return {
          id: doc.id,
          ...data,
        };
      });
      setProducts(productsList);
    };

    fetchProducts();
  }, []);

  const addToCart = async (product: Product) => {
    if (!userId || userRole !== "customer") {
      console.error("Operation not allowed");
      return;
    }

    const productToAdd = {
      id: product.id,
      name: product.title!,
      price: product.price!,
      imageUrl: product.imageUrl!,
      sellerName: product.sellerName!,
      quantity: 1,
    };

    const cartItemDocRef = doc(db, `carts/${userId}/items`, product.id);
    const docSnap = await getDoc(cartItemDocRef);
    try {
      if (docSnap.exists()) {
        await updateDoc(cartItemDocRef, {
          quantity: docSnap.data().quantity + 1,
        });
      } else {
        await setDoc(cartItemDocRef, productToAdd);
      }
      showToast("success", "Added to cart");
    } catch (error) {
      showToast("error", "Error adding to cart");
      console.error("Error adding to cart: ", error);
    }
  };

  const shouldLoop = products.length > 3;

  return (
    <>
      <section className="bg-white dark:bg-dark">
        <div className="container mx-auto overflow-hidden pt-20 pb-20 lg:pt-[120px] lg:pb-[90px]">
          <Swiper
            breakpoints={{
              640: {
                width: 640,
                slidesPerView: 1,
              },
              768: {
                width: 768,
                slidesPerView: 2.2,
              },
              1024: {
                width: 1024,
                slidesPerView: 2.2,
              },
              1280: {
                width: 1280,
                slidesPerView: 3,
              },
            }}
            loop={shouldLoop}
            spaceBetween={30}
            ref={sliderRef}
            className="!overflow-visible"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard
                  image={product.imageUrl}
                  name={product.title}
                  details={product.description}
                  price={`$${product.price}`}
                  sellerName={product.sellerName}
                  onItemClick={() => addToCart(product)}
                  role={userRole ?? ""}
                  product={product}
                />
              </SwiperSlide>
            ))}
            <div className="z-50 -bottom-[65px] absolute left-0 right-0 flex items-center justify-center">
              <div className="inline-flex space-x-3 rounded-full border border-stroke dark:border-dark-3 p-[6px] dark:bg-dark-2">
                <div className="prev-arrow cursor-pointer" onClick={handlePrev}>
                  <button
                    title="Previous"
                    className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 text-body-color dark:text-dark-6 hover:border-primary hover:bg-primary hover:text-white"
                  >
                    <svg
                      width={14}
                      height={14}
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-current"
                    >
                      <path d="M12.25 6.51875H2.90935L6.6281 2.73438C6.82498 2.5375 6.82498 2.23125 6.6281 2.03437C6.43123 1.8375 6.12498 1.8375 5.9281 2.03437L1.39998 6.62813C1.2031 6.825 1.2031 7.13125 1.39998 7.32813L5.9281 11.9219C6.0156 12.0094 6.14685 12.075 6.2781 12.075C6.40935 12.075 6.51873 12.0313 6.6281 11.9438C6.82498 11.7469 6.82498 11.4406 6.6281 11.2438L2.93123 7.50313H12.25C12.5125 7.50313 12.7312 7.28438 12.7312 7.02188C12.7312 6.7375 12.5125 6.51875 12.25 6.51875Z" />
                    </svg>
                  </button>
                </div>
                <div className="next-arrow cursor-pointer" onClick={handleNext}>
                  <button
                    title="Next"
                    className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 text-body-color dark:text-dark-6 hover:border-primary hover:bg-primary hover:text-white"
                  >
                    <svg
                      width={14}
                      height={14}
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-current"
                    >
                      <path d="M12.6008 6.6501L8.07266 2.05635C7.87578 1.85947 7.56953 1.85947 7.37266 2.05635C7.17578 2.25322 7.17578 2.55947 7.37266 2.75635L11.0477 6.49697H1.75078C1.48828 6.49697 1.26953 6.71572 1.26953 6.97822C1.26953 7.24072 1.48828 7.48135 1.75078 7.48135H11.0914L7.37266 11.2657C7.17578 11.4626 7.17578 11.7688 7.37266 11.9657C7.46016 12.0532 7.59141 12.097 7.72266 12.097C7.85391 12.097 7.98516 12.0532 8.07266 11.9438L12.6008 7.3501C12.7977 7.15322 12.7977 6.84697 12.6008 6.6501Z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default ProductCarousel5;
