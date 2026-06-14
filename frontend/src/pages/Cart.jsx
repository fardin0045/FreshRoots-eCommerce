import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDispatch, useSelector } from 'react-redux';
import userLogo from '../assets/onik.png';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Link,  useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setCart } from '@/redux/productSlice';
import { toast } from 'sonner';
import { useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
export const Cart = ({ product }) => {
  const { cart } = useSelector((store) => store.product);
  const subTotal = cart?.totalPrice || 0;
  const shipping = subTotal > 499 ? 0 : 10;
  const tax = subTotal * 0.06; //6 %
  const total = subTotal + shipping + tax;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const API = `${API_URL}/api/carts`;
  const accessToken = localStorage.getItem('accessToken');

  const loadCart = async () => {
    try {
      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdateQuantity = async (productId, type) => {
    try {
      const res = await axios.put(
        `${API}/update`,
        { productId, type },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleRemove = async (productId) => {
    try {
      const res = await axios.delete(`${API}/remove`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: { productId },
      });
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success('Product remove from cart');
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadCart();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {cart?.items?.length > 0 ? (
          <>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-800">Your Cart</h1>
              <p className="text-slate-500 mt-2">
                Review your items and proceed to checkout
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* LEFT SIDE */}
              <div className="lg:col-span-2 space-y-5">
                {cart?.items?.map((product, index) => (
                  <Card
                    key={index}
                    className="  border-0
  shadow-[0_10px_40px_rgba(0,0,0,0.08)]
  hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]
  transition-all
  duration-300
  rounded-3xl
  bg-white"
                  >
                    <CardContent className="p-5 cursor-pointer">
                      <div className="flex flex-col md:flex-row justify-between gap-5">
                        {/* Product Info */}
                        <div className="flex gap-4">
                          <img
                            onClick={() =>
                              navigate(`/products/${product?.productId?._id}`)
                            }
                            src={
                              product?.productId?.productImg?.[0]?.url ||
                              userLogo
                            }
                            alt=""
                            className="w-28 h-28 object-cover rounded-xl bg-slate-100"
                          />

                          <div>
                            <h2 className="font-bold text-lg text-slate-800">
                              {product?.productId?.productName}
                            </h2>

                            <p className="text-green-700 text-xl font-bold mt-2">
                              ৳
                              {product?.productId?.productPrice?.toLocaleString()}
                            </p>

                            <p className="text-sm text-slate-500 mt-2">
                              Fresh & Organic Product
                            </p>
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border rounded-full overflow-hidden">
                            <Button
                              variant="ghost"
                              onClick={() =>
                                handleUpdateQuantity(
                                  product.productId._id,
                                  'decrease',
                                )
                              }
                              className="rounded-none"
                            >
                              -
                            </Button>

                            <span className="px-4 font-semibold">
                              {product.quantity}
                            </span>

                            <Button
                              variant="ghost"
                              onClick={() =>
                                handleUpdateQuantity(
                                  product.productId._id,
                                  'increase',
                                )
                              }
                              className="rounded-none"
                            >
                              +
                            </Button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex flex-col items-end justify-between">
                          <h3 className="font-bold text-xl text-slate-800">
                            ৳
                            {(
                              product?.productId?.productPrice *
                              product?.quantity
                            ).toLocaleString()}
                          </h3>

                          <button
                            onClick={() =>
                              handleRemove(product?.productId?._id)
                            }
                            className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium"
                          >
                            <Trash2 size={16} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* RIGHT SIDE */}
              <div>
                <Card className="sticky top-24 border-none shadow-xl rounded-2xl bg-white">
                  <CardHeader>
                    <CardTitle className="text-2xl">Order Summary</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-5">
                    <div className="flex justify-between">
                      <span className="text-slate-600">
                        Subtotal ({cart?.items?.length} items)
                      </span>
                      <span className="font-semibold">
                        ৳{cart?.totalPrice?.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-600">Shipping</span>
                      <span className="font-semibold">
                        {shipping === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `৳${shipping}`
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-600">Tax (6%)</span>
                      <span className="font-semibold">৳{tax.toFixed(2)}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-green-700">
                        ৳{total.toFixed(2)}
                      </span>
                    </div>

                    {/* Coupon */}
                    <div className="flex gap-2">
                      <Input placeholder="Promo Code" className="rounded-xl" />
                      <Button variant="outline" className="rounded-xl">
                        Apply
                      </Button>
                    </div>

                    {/* Checkout */}
                    <Button onClick={()=>navigate('/address')} className="w-full text-white rounded-xl bg-green-700 hover:bg-green-800 h-12 text-lg">
                      PLACE ORDER
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full h-12 rounded-xl"
                      asChild
                    >
                      <Link to="/products">Continue Shopping</Link>
                    </Button>

                    {/* Benefits */}
                    <div className="pt-4 border-t space-y-3">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        ✅ Free Shipping over ৳499
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        🔒 Secure SSL Checkout
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        🚚 Fast Home Delivery
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        ↩ Easy Return Policy
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center  h-[70vh] text-center">
            <div className="bg-white shadow-xl p-10 rounded-3xl">
              <ShoppingCart size={70} className="mx-auto text-slate-400 mb-5" />

              <h2 className="text-3xl font-bold text-slate-800">
                Your Cart is Empty
              </h2>

              <p className="text-slate-500 mt-3 max-w-md">
                Looks like you haven't added any products to your cart yet.
                Start exploring our fresh and organic collection.
              </p>

              <Button
                className="mt-6 bg-green-700 text-white rounded-xl p-4 hover:bg-green-800"
                asChild
              >
                <Link to="/products">Start Shopping</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
