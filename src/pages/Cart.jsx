import { Link } from "react-router-dom";
import {
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineShoppingCart,
  HiOutlineArrowRight,
} from "react-icons/hi";
import { useCart } from "../contexts/CartContext";
import { formatCurrency } from "../utils/helpers";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    total,
    coupon,
    itemCount,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiOutlineShoppingCart className="w-12 h-12 text-surface-400" />
          </div>
          <h2 className="text-2xl font-bold text-surface-800 mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-surface-500 mb-8">
            Looks like you haven't added anything yet.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-lg"
          >
            Start Shopping
            <HiOutlineArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 mb-8">
        Shopping Cart ({itemCount} item{itemCount !== 1 ? "s" : ""})
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 sm:gap-6 bg-white p-4 sm:p-5 rounded-2xl border border-surface-100 hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <Link to={`/product/${item.id}`} className="shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl bg-surface-100"
                />
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${item.id}`}
                  className="text-sm sm:text-base font-semibold text-surface-800 hover:text-primary-600 line-clamp-2 transition-colors"
                >
                  {item.name}
                </Link>
                <p className="text-lg font-bold text-surface-900 mt-2">
                  {formatCurrency(item.price)}
                </p>

                {/* Quantity & Remove */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-surface-200 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 text-surface-500 hover:text-primary-600 transition-colors"
                    >
                      <HiOutlineMinus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-surface-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= (item.stock || 99)}
                      className="p-2 text-surface-500 hover:text-primary-600 disabled:opacity-40 transition-colors"
                    >
                      <HiOutlinePlus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-surface-400 hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Line total (desktop) */}
              <div className="hidden sm:flex flex-col items-end justify-center">
                <span className="text-lg font-bold text-surface-900">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-surface-100 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-surface-900 mb-5">
              Order Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-surface-600">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex justify-between text-surface-600">
                <span>Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({coupon?.code})</span>
                  <span className="font-medium">
                    -{formatCurrency(discount)}
                  </span>
                </div>
              )}

              <hr className="border-surface-100" />

              <div className="flex justify-between text-lg font-bold text-surface-900">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full flex items-center justify-center gap-2 mt-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary-600/20 hover:shadow-xl"
            >
              Proceed to Checkout
              <HiOutlineArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/shop"
              className="block text-center mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
