import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePaystackPayment } from "react-paystack";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { createOrder } from "../services/orderService";
import { formatCurrency } from "../utils/helpers";
import { PAYSTACK_PUBLIC_KEY } from "../utils/constants";
import toast from "react-hot-toast";

const Checkout = () => {
  const { cartItems, subtotal, discount, total, coupon, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    notes: "",
  });
  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const required = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
    ];
    for (const field of required) {
      if (!formData[field].trim()) {
        toast.error(
          `Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`,
        );
        return false;
      }
    }
    return true;
  };

  // Paystack configuration
  const paystackConfig = {
    reference: `SV_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    email: formData.email || user?.email || "",
    amount: Math.round(total * 100), // Paystack uses kobo
    publicKey: PAYSTACK_PUBLIC_KEY,
    currency: "NGN",
    metadata: {
      custom_fields: [
        {
          display_name: "Customer Name",
          variable_name: "customer_name",
          value: `${formData.firstName} ${formData.lastName}`,
        },
      ],
    },
  };

  const onPaystackSuccess = async (reference) => {
    setProcessing(true);
    try {
      const order = await createOrder({
        userId: user.uid,
        items: cartItems,
        subtotal,
        discount,
        total,
        couponCode: coupon?.code || null,
        status: "processing",
        paymentRef: reference.reference,
        paymentStatus: "paid",
        deliveryAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        notes: formData.notes,
      });

      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/order-confirmation/${order.id}`, { state: { order } });
    } catch {
      toast.error("Failed to create order. Please contact support.");
    }
    setProcessing(false);
  };

  const onPaystackClose = () => {
    toast.error("Payment was cancelled");
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // If no Paystack key, simulate payment for demo
    if (
      !PAYSTACK_PUBLIC_KEY ||
      PAYSTACK_PUBLIC_KEY === "pk_test_your_paystack_public_key"
    ) {
      toast.success("Demo mode: Simulating payment...");
      onPaystackSuccess({ reference: `DEMO_${Date.now()}` });
      return;
    }

    initializePayment({
      onSuccess: onPaystackSuccess,
      onClose: onPaystackClose,
    });
  };

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 mb-8">
        Checkout
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Delivery Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-surface-100 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-surface-900 mb-6">
                Delivery Information
              </h2>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-surface-700 mb-1.5 block">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-surface-700 mb-1.5 block">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-surface-700 mb-1.5 block">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-surface-700 mb-1.5 block">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+234..."
                    className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-surface-700 mb-1.5 block">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-surface-700 mb-1.5 block">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-surface-700 mb-1.5 block">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-surface-700 mb-1.5 block">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-surface-700 mb-1.5 block">
                    Order Notes
                  </label>
                  <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any special instructions"
                    className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-surface-100 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-surface-900 mb-5">
                Order Summary
              </h3>

              {/* Items */}
              <div className="space-y-3 mb-5 max-h-60 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover bg-surface-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-800 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-surface-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-surface-900">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="border-surface-100 mb-4" />

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-surface-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-surface-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <hr className="border-surface-100" />
                <div className="flex justify-between text-lg font-bold text-surface-900">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full mt-6 py-3.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary-600/20 hover:shadow-xl"
              >
                {processing ? "Processing..." : `Pay ${formatCurrency(total)}`}
              </button>

              <p className="text-xs text-surface-400 text-center mt-3">
                🔒 Secured by Paystack. Your payment info is encrypted.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
