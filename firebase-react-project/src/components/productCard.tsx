import { Product } from "@/api/type";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  image: string;
  name: string;
  details: string;
  price: string;
  sellerName: string;
  onItemClick: (product: Product) => void;
  role: string;
  product: Product;
}

const ProductCard = ({
  image,
  name,
  details,
  price,
  sellerName,
  onItemClick,
  role,
  product,
}: ProductCardProps) => {
  const handleAddToCartClick = () => {
    onItemClick(product);
  };
  const addToCartButton =
    role === "customer" ? (
      <Button className="mt-4" onClick={handleAddToCartClick}>
        Add to Cart
      </Button>
    ) : null;

  return (
    <div className="overflow-hidden rounded-lg bg-white border dark:bg-dark-2 shadow-1 dark:shadow-box-dark">
      <div className="relative overflow-hidden h-[200px] lg:h-[250px] w-full flex items-center justify-center">
        <img
          src={image}
          alt="product background"
          className="absolute top-0 left-0 w-full h-full object-cover blur-sm scale-105 animate-pulse"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30"></div>
        <img
          src={image}
          alt="product"
          className="relative h-[200px] lg:h-[250px] w-auto object-cover z-10"
        />
      </div>
      <div className="p-6">
        <h3>
          <a
            href="/#"
            className="mb-3 block text-lg font-semibold text-dark dark:text-white hover:text-primary xs:text-xl lg:text-lg xl:text-xl"
          >
            {name}
          </a>
        </h3>
        <p className="text-base text-body-color dark:text-dark-6">{details}</p>
        {addToCartButton}
      </div>
      <div className="flex justify-between items-center border-t border-stroke dark:border-dark-3 p-4">
        <span className="text-sm font-medium text-body-color dark:text-dark-6 space-x-4">
          selled by
          <span className="text-blue-600 ml-2">{sellerName}</span>
        </span>
        <span className="text-base font-semibold text-dark dark:text-white">
          {price}
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
