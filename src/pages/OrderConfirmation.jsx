import { Link, useParams, useLocation } from "react-router-dom";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
import { formatCurrency, formatDate } from "../utils/helpers";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <HiOutlineCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-extrabold text-surface-900 mb-3">
          Order Confirmed!
        </h1>
        <p className="text-surface-500 mb-2">
          Your order ID: <strong>{orderId}</strong>
        </p>
        <p className="text-surface-500 mb-8">
          Thank you for your purchase. You'll receive an email confirmation
          shortly.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/dashboard/orders"
            className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
          >
            View Orders
          </Link>
          <Link
            to="/shop"
            className="px-6 py-3 border border-surface-200 text-surface-700 font-semibold rounded-xl hover:bg-surface-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <HiOutlineCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-extrabold text-surface-900 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-surface-500">Thank you for your purchase.</p>
      </div>

      <div className="bg-white rounded-2xl border border-surface-100 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-surface-500 uppercase">Order ID</p>
            <p className="text-sm font-mono font-semibold text-surface-800">
              {order.id}
            </p>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full capitalize">
            {order.status}
          </span>
        </div>

        {/* Items */}
        <div className="space-y-3 mb-6">
          {order.items?.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-14 h-14 rounded-lg object-cover bg-surface-100"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-800 truncate">
                  {item.name}
                </p>
                <p className="text-xs text-surface-500">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-semibold">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <hr className="border-surface-100 mb-4" />

        <div className="flex justify-between text-lg font-bold text-surface-900">
          <span>Total Paid</span>
          <span>{formatCurrency(order.total)}</span>
        </div>

        {/* Delivery address */}
        {order.deliveryAddress && (
          <div className="mt-6 pt-6 border-t border-surface-100">
            <h3 className="text-sm font-semibold text-surface-800 mb-2">
              Delivery Address
            </h3>
            <p className="text-sm text-surface-600">
              {order.deliveryAddress.firstName} {order.deliveryAddress.lastName}
              <br />
              {order.deliveryAddress.address}
              <br />
              {order.deliveryAddress.city}, {order.deliveryAddress.state}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 mt-8">
        <Link
          to="/dashboard/orders"
          className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
        >
          View Orders
        </Link>
        <Link
          to="/shop"
          className="px-6 py-3 border border-surface-200 text-surface-700 font-semibold rounded-xl hover:bg-surface-50 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
