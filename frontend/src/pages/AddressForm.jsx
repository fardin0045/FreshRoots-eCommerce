import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  addAddress,
  deleteAddresses,
  setSelectedAddress,
} from '@/redux/productSlice';
import axios from 'axios';
import { Plus, AlertCircle, Loader } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const AddressForm = () => {
  const initialFormData = {
    fullName: '',
    phone: '',
    email: '',
    address1: '',
    city: '',
    address2: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('ONLINE');

  const { cart, addresses, selectedAddress } = useSelector(
    (store) => store.product,
  );
  const [showForm, setShowForm] = useState(
    addresses?.length > 0 ? false : true,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Validate form
    if (!formData.fullName || !formData.phone || !formData.email || !formData.address1 || !formData.city) {
      toast.error('Please fill all required fields');
      return;
    }
    dispatch(addAddress(formData));
    setFormData(initialFormData);
    setShowForm(false);
    toast.success('Address saved successfully');
  };

  const subtotal = cart.totalPrice;
  const shipping = subtotal > 498 ? 0 : 70;
  const tax = parseFloat((subtotal * 0.06).toFixed(2));
  const total = subtotal + shipping + tax;
const API_URL = import.meta.env.VITE_API_URL;
  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      if (selectedAddress === null) {
        toast.error('Please select a delivery address');
        return;
      }

      // Create Order
      const res = await axios.post(
        `${API_URL}/api/orders/checkout`,
        {
          address: addresses?.[selectedAddress] || {},
          paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const order = res.data.order;

      if (paymentMethod === 'COD') {
        navigate(`/payment/success?orderId=${order._id}&amount=${total.toFixed(2)}&method=COD`);
        return;
      }

      // Initiate Payment
      const paymentRes = await axios.post(
        `${API_URL}/api/payment/pay/${order._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (paymentRes.data.paymentUrl) {
        // Redirect to SSLCommerz
        window.location.href = paymentRes.data.paymentUrl;
      } else {
        setError('Failed to initialize payment. Please try again.');
        toast.error('Payment initialization failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Checkout failed';
      const errorDetails = error.response?.data?.details;
      
      setError(errorMessage);
      toast.error(errorMessage);
      
      console.error('Checkout error:', {
        message: errorMessage,
        details: errorDetails,
        fullError: error.response?.data,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 place-items-center p-6 sm:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 mt-10 w-full items-start">
        <div className="space-y-4 p-6 bg-gray-100 rounded-2xl w-full">
          {showForm ? (
            <>
              <div className="bg-white p-2 rounded-xl">
                <Label htmlFor="fullName" className="mb-2 ">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  required
                  placeholder="Fardin Onik"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="rounded"
                />
              </div>
              <div className="bg-white p-2 rounded-xl">
                <Label className="mb-2 " htmlFor="phone">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  required
                  placeholder="+880 18889823"
                  value={formData.phone}
                  onChange={handleChange}
                  className="rounded"
                />
              </div>
              <div className="bg-white p-2 rounded-xl">
                <Label className="mb-2 " htmlFor="email">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  required
                  placeholder="fardin@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="rounded"
                />
              </div>
              <div className="bg-white p-2 rounded-xl">
                <Label className="mb-2 " htmlFor="address1">
                  Address 1
                </Label>
                <Input
                  id="address1"
                  name="address1"
                  required
                  placeholder="House_Number/Road_Number"
                  value={formData.address1}
                  onChange={handleChange}
                  className="rounded"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 bg-white p-2 rounded-xl">
                <div>
                  <Label className="mb-2 " htmlFor="city">
                    City
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    required
                    placeholder="Tangail,Dhaka`"
                    value={formData.city}
                    onChange={handleChange}
                    className="rounded"
                  />
                </div>
                <div>
                  <Label className="mb-2 " htmlFor="address2">
                    Address 2
                  </Label>
                  <Input
                    id="address2"
                    name="address2"
                    placeholder="House_Number/Road_Number"
                    value={formData.address2}
                    onChange={handleChange}
                    className="rounded"
                  />
                </div>
              </div>
              <Button
                onClick={handleSave}
                className="w-full bg-black text-white rounded"
              >
                Save & Continue
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Saved Addresses</h2>
              {addresses.map((addr, index) => {
                return (
                  <div
                    onClick={() => dispatch(setSelectedAddress(index))}
                    key={index}
                    className={`border p-4 rounded-md cursor-pointer relative ${selectedAddress === index ? 'border-pink-600 bg-ping-50' : 'border-gray-300'}`}
                  >
                    <p className="font-medium">{addr.fullName}</p>
                    <p>{addr.phone}</p>
                    <p>{addr.email}</p>
                    <p>
                      {addr.address1},{addr.city},{addr.address2}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(deleteAddresses(index));
                      }}
                      className="absolute top-2 right-2 text-500 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
              <Button
                variant="outline "
                className="w-full bg-black text-white rounded mt-4"
                onClick={() => setShowForm(true)}
              >
                {' '}
                <Plus /> Add new Address
              </Button>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              <Button
                onClick={handleCheckout}
                className="w-full bg-pink-500 hover:bg-pink-600 rounded text-white cursor-pointer"
                disabled={selectedAddress == null || loading}
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  'Proceed To Checkout'
                )}
              </Button>
            </div>
          )}
        </div>
        {/* Right side order summary */}
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
                <span className="text-green-700">৳{total.toFixed(2)}</span>
              </div>

              {/* Coupon */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                <h3 className="font-semibold">Payment Method</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ONLINE"
                      checked={paymentMethod === 'ONLINE'}
                      onChange={() => setPaymentMethod('ONLINE')}
                      className="h-4 w-4 accent-pink-600"
                    />
                    <span className="text-sm font-medium">Online Payment</span>
                  </label>
                  <label className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="h-4 w-4 accent-pink-600"
                    />
                    <span className="text-sm font-medium">Cash on Delivery (COD)</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2">
                <Input placeholder="Promo Code" className="rounded-xl" />
                <Button variant="outline" className="rounded-xl">
                  Apply
                </Button>
              </div>

              {/* Checkout */}
              <Button onClick={handleCheckout} className="w-full text-white rounded-xl bg-green-700 hover:bg-green-800 h-12 text-lg">
                {paymentMethod === 'COD' ? 'Place COD Order' : 'Pay Securely'}
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
    </div>
  );
};
