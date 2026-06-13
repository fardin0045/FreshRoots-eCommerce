import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';

export const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  const orderId = searchParams.get('orderId');
  const tranId = searchParams.get('tran_id');
  const amount = searchParams.get('amount');
  const message = searchParams.get('message');
  const method = searchParams.get('method');
  const pathname = window.location.pathname;

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (pathname.includes('success')) {
          // If we have orderId, payment was already verified by backend
          if (orderId) {
            setStatus('success');
            const accessToken = localStorage.getItem('accessToken');
            try {
              const res = await axios.get(
                `http://localhost:8000/api/payment/verify/${orderId}`,
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              );
              setOrderData(res.data.order);
            } catch (err) {
              console.error('Failed to fetch order:', err);
              setOrderData({ _id: orderId, transactionId: tranId, amount, paymentMethod: method });
            }
          } else if (tranId) {
            // Direct access with only tran_id - show success with transaction ID
            setStatus('success');
            setOrderData({ _id: 'unknown', transactionId: tranId, amount });
          } else {
            setStatus('error');
            setError('No order information available');
          }
        } else if (pathname.includes('fail')) {
          setStatus('fail');
          setError(message || 'Payment Failed');
        } else if (pathname.includes('cancel')) {
          setStatus('cancel');
          setError(message || 'Payment Cancelled');
        }
      } catch (err) {
        setError(err.message);
        setStatus('error');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [orderId, tranId, pathname, message, amount, method]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto text-blue-500 mb-4" />
          <p className="text-xl text-slate-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        {status === 'success' ? (
          <Card className="border-none shadow-xl rounded-2xl bg-white">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <CardTitle className="text-3xl text-green-600">
                Payment Successful!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <p className="text-slate-700 mb-2">
                  <span className="font-semibold">Order ID:</span> {orderData?._id}
                </p>
                <p className="text-slate-700 mb-2">
                  <span className="font-semibold">Amount:</span> ৳{amount || orderData?.amount}
                </p>
                <p className="text-slate-700 mb-2">
                  <span className="font-semibold">Payment Method:</span>{' '}
                  <span className="text-green-600 font-semibold">
                    {orderData?.paymentMethod === 'COD' || method === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                  </span>
                </p>
                <p className="text-slate-700 mb-2">
                  <span className="font-semibold">Status:</span>{' '}
                  <span className="text-green-600 font-semibold">
                    {orderData?.paymentMethod === 'COD' || method === 'COD' ? 'Awaiting delivery' : 'Paid'}
                  </span>
                </p>
                {orderData?.transactionId && (
                  <p className="text-slate-700">
                    <span className="font-semibold">Transaction ID:</span> {orderData?.transactionId}
                  </p>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-slate-700 text-sm">
                  {orderData?.paymentMethod === 'COD' || method === 'COD'
                    ? 'Your order has been placed. Please pay the delivery agent when your package arrives.'
                    : 'Thank you for your purchase! Your order has been confirmed. You can track your order status from your profile.'}
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => navigate('/my-order')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                  View Order
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="flex-1 rounded-lg"
                >
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : status === 'fail' ? (
          <Card className="border-none shadow-xl rounded-2xl bg-white">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <XCircle className="w-16 h-16 text-red-500" />
              </div>
              <CardTitle className="text-3xl text-red-600">
                Payment Failed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-red-50 p-6 rounded-lg">
                <p className="text-slate-700">
                  <span className="font-semibold">Error:</span> {error}
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-slate-700 text-sm">
                  Your payment could not be processed. Please check your payment details and try
                  again.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => navigate('/address')}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  Retry Payment
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="flex-1 rounded-lg"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : status === 'cancel' ? (
          <Card className="border-none shadow-xl rounded-2xl bg-white">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="w-16 h-16 text-amber-500" />
              </div>
              <CardTitle className="text-3xl text-amber-600">
                Payment Cancelled
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-amber-50 p-6 rounded-lg">
                <p className="text-slate-700">
                  <span className="font-semibold">Message:</span> {error}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-slate-700 text-sm">
                  Your payment has been cancelled. Your items are still in your cart. You can
                  complete your purchase anytime.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => navigate('/cart')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Back to Cart
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="flex-1 rounded-lg"
                >
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-none shadow-xl rounded-2xl bg-white">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="w-16 h-16 text-gray-500" />
              </div>
              <CardTitle className="text-3xl text-gray-600">
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-slate-700">
                  <span className="font-semibold">Error:</span> {error}
                </p>
              </div>

              <Button
                onClick={() => navigate('/')}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
              >
                Back to Home
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
