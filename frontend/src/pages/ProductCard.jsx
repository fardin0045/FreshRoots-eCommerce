import { Skeleton } from '@/components/ui/skeleton';
import { setCart } from '@/redux/productSlice';
import { Button } from '@base-ui/react';
import axios from 'axios';
import { ShoppingCart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ProductCard = ({ product, loading }) => {
  const { productImg, productPrice, productName } = product || {};
  const accessToken = localStorage.getItem('accessToken');
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const addToCart = async(productId)=>{
    try{
      const res = await axios.post('http://localhost:8000/api/carts/add',{productId},{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      })
      if(res.data.success){
        toast.success("product added to Cart");
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.error('Add to cart failed:', error.response?.data || error.message || error);
      toast.error(error.response?.data?.message || 'Unable to add product to cart');
    }
  }

  return (
    <div className="shadow-2xl rounded-2xl overflow-hidden h-max">
      <div className="w-full h-full aspect-square overflow-hidden">
        {loading ? (
          <Skeleton className="w-full h-full rounded-lg" />
        ) : (
          <img
          onClick={()=>navigate(`/products/${product._id}`)}
            src={productImg?.[0]?.url}
            alt={productName || 'Product image'}
            className="w-full h-full transition-transform duration-300 hover:scale-105"
          />
        )}
      </div>
      {loading ? (
        <div className="px-2 space-y-2 my-2">
          <Skeleton className="w-[200px] h-4" />
          <Skeleton className="w-[100px] h-4" />
          <Skeleton className="w-[150px] h-4" />
        </div>
      ) : (
        <div className="px-5 space-y-1">
          <h2  onClick={()=>navigate(`/products/${product._id}`)} className="font-semibold h-12 line-clamp-1">
            {productName || 'Unnamed product'}
          </h2>
          <h2 className="mt-2 font-bold text-gray-600 text-lg">
            <span className="text-2xl  font-semibold">৳</span>
            {productPrice ? `${productPrice} ` : 'Price unavailable'}
          </h2>
          <Button onClick={() => addToCart(product._id)} className="bg-green-600 mb-3 p-2 font-medium gap-2 w-full text-white flex items-center justify-content justify-center rounded-lg">
            <ShoppingCart /> Add to Cart{' '}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
