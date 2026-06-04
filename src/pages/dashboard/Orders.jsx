import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getUserOrders } from "../../services/orderService";
import { formatCurrency, formatDate } from "../../utils/helpers";
import { ORDER_STATUS_COLORS } from "../../utils/constants";
import Loader from "../../components/common/Loader";

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const load = async () => {
      if (user) {
        const data = await getUserOrders(user.uid);
        setOrders(data);
      } else {
        setOrders([]);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const filtered =
    filterStatus === "all"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  if (loading) return <Loader text="Loading orders..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-surface-900">My Orders</h2>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-surface-100">
          <p className="text-surface-500">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-surface-100 overflow-hidden"
            >
              {/* Order header */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-surface-50 border-b border-surface-100">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-xs text-surface-500 uppercase">
                      Order ID
                    </p>
                    <p className="text-sm font-mono font-semibold text-surface-800">
                      {order.id?.slice(0, 12)}...
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500 uppercase">Date</p>
                    <p className="text-sm font-medium text-surface-800">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${ORDER_STATUS_COLORS[order.status]}`}
                  >
                    {order.status}
                  </span>
                  <span className="text-base font-bold text-surface-900">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>

              {/* Order items */}
              <div className="p-5 space-y-3">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover bg-surface-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-800 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-surface-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order tracking */}
              {(order.status === "processing" ||
                order.status === "shipped") && (
                <div className="px-5 pb-5">
                  <div className="flex items-center gap-2">
                    {["pending", "processing", "shipped", "delivered"].map(
                      (step, i) => {
                        const statusOrder = [
                          "pending",
                          "processing",
                          "shipped",
                          "delivered",
                        ];
                        const currentIdx = statusOrder.indexOf(order.status);
                        const isComplete = i <= currentIdx;
                        return (
                          <div
                            key={step}
                            className="flex items-center gap-2 flex-1"
                          >
                            <div
                              className={`w-3 h-3 rounded-full ${
                                isComplete ? "bg-primary-600" : "bg-surface-200"
                              }`}
                            />
                            {i < 3 && (
                              <div
                                className={`flex-1 h-0.5 ${
                                  i < currentIdx
                                    ? "bg-primary-600"
                                    : "bg-surface-200"
                                }`}
                              />
                            )}
                          </div>
                        );
                      },
                    )}
                  </div>
                  <div className="flex justify-between mt-1">
                    {["Pending", "Processing", "Shipped", "Delivered"].map(
                      (label) => (
                        <span
                          key={label}
                          className="text-[10px] text-surface-400"
                        >
                          {label}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
