import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const OrderCard = ({ userOrder }) => {
  const navigate = useNavigate();

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Failed':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="rounded-xl h-11 px-5 shadow-sm hover:shadow-md transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Order History
          </h1>

          <p className="text-slate-500 mt-2">View and manage customer orders</p>
        </div>

        {/* Empty State */}
        {userOrder?.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-16 text-center">
            <div className="text-7xl mb-4">📦</div>

            <h2 className="text-2xl font-bold text-slate-800">
              No Orders Found
            </h2>

            <p className="text-slate-500 mt-2">
              This user hasn't placed any orders yet.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {userOrder?.map((order) => (
              <div
                key={order._id}
                className="
                  bg-white
                  rounded-3xl
                  overflow-hidden
                  border border-slate-100
                  shadow-[0_10px_40px_rgba(0,0,0,0.08)]
                  hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]
                  transition-all duration-300
                "
              >
                {/* Order Header */}
                <div className="p-6 border-b border-slate-100">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Order ID</p>

                      <h2 className="font-semibold text-slate-900 break-all">
                        {order._id}
                      </h2>
                    </div>

                    <div className="lg:text-right">
                      <p className="text-sm text-slate-500">Total Amount</p>

                      <p className="text-3xl font-bold text-green-600">
                        {order.currency} {order.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="px-6 py-5 border-b border-slate-100">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg text-slate-800">
                        {order.user?.firstName || 'Unknown'}{' '}
                        {order.user?.lastName || ''}
                      </h3>

                      <p className="text-slate-500 text-sm">
                        {order.user?.email || 'N/A'}
                      </p>
                    </div>

                    <span
                      className={`
                        px-4 py-2
                        rounded-full
                        text-sm
                        font-semibold
                        border
                        self-start md:self-center
                        ${getStatusStyle(order.status)}
                      `}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Products */}
                <div className="p-6">
                  <h3 className="font-bold text-lg text-slate-800 mb-5">
                    Ordered Products
                  </h3>

                  <div className="space-y-4">
                    {order.products.map((product, index) => (
                      <div
                        key={index}
                        className="
                          bg-slate-50
                          rounded-2xl
                          p-4
                          hover:bg-slate-100
                          transition-all
                        "
                      >
                        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                          {/* Product Image */}
                          <img
                            onClick={() =>
                              navigate(`/products/${product?.productId?._id}`)
                            }
                            src={
                              product.productId?.productImg?.[0]?.url ||
                              '/placeholder.png'
                            }
                            alt={product.productId?.productName}
                            className="
                              w-24
                              h-24
                              object-cover
                              rounded-xl
                              cursor-pointer
                              hover:scale-105
                              transition-transform
                              shadow-sm
                            "
                          />

                          {/* Product Info */}
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-800 text-lg">
                              {product.productId?.productName}
                            </h4>

                            <p className="text-xs text-slate-500 break-all mt-1">
                              Product ID: {product.productId?._id}
                            </p>
                          </div>

                          {/* Price */}
                          <div className="sm:text-right">
                            <p className="text-xl font-bold text-green-600">
                              ৳{product.productId?.productPrice}
                            </p>

                            <p className="text-slate-500 text-sm">
                              Quantity: {product.quantity}
                            </p>

                            <p className="font-semibold text-slate-700 mt-1">
                              Total: ৳
                              {(
                                product.productId?.productPrice *
                                product.quantity
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
