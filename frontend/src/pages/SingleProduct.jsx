import Breadcrums from "@/components/Breadcrums";
import ProductDesc from "@/components/ProductDesc";
import ProductImg from "@/components/ProductImg";
import ProductCard from "@/pages/ProductCard";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const SingleProduct = () => {
  const params = useParams();
  const productId = params.id;

  const { products } = useSelector((store) => store.product);

  const product = products?.find((item) => item._id === productId);

  // Safe fallback
  if (!product) {
    return (
      <div className="pt-24 text-center text-gray-500">
        Loading product...
      </div>
    );
  }

  // Similar products (same category, exclude current product)
  const similarProducts = products?.filter(
    (item) =>
      item.category === product.category && item._id !== product._id
  );

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Breadcrumb */}
        <Breadcrums product={product} />

        {/* Main Product Section */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <ProductImg images={product.productImg} />
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <ProductDesc product={product} />
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts?.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-10">
              Similar Products
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarProducts.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleProduct;