import { useState, useEffect } from "react";
import { getAllOrders, updateOrderStatus } from "../../services/orderService";
import { formatCurrency, formatDate } from "../../utils/helpers";
import { ORDER_STATUS, ORDER_STATUS_COLORS } from "../../utils/constants";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const data = await getAllOrders();
    setOrders(data);
    setLoading(false);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
      toast.success(`Order status updated to ${newStatus}`);
    } catch {
      toast.error("Failed to update order status");
    }
  };

  const filtered =
    filterStatus === "all"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  if (loading) return <Loader text="Loading orders..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-surface-900">
          Orders ({orders.length})
        </h2>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        >
          <option value="all">All Status</option>
          {Object.values(ORDER_STATUS).map((s) => (
            <option key={s} value={s} className="capitalize">
              {s}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-surface-100">
          <p className="text-surface-500">No orders found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-surface-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-surface-500 uppercase border-b border-surface-100">
                  <th className="px-5 py-3">Order ID</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-surface-50 transition-colors"
                  >
                    <td className="px-5 py-4 text-sm font-mono text-surface-800">
                      {order.id?.slice(0, 10)}...
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-surface-800">
                        {order.deliveryAddress?.firstName}{" "}
                        {order.deliveryAddress?.lastName}
                      </p>
                      <p className="text-xs text-surface-500">
                        {order.deliveryAddress?.phone}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-sm text-surface-600">
                      {order.items?.length || 0}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-surface-900">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-full capitalize ${ORDER_STATUS_COLORS[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-surface-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusUpdate(order.id, e.target.value)
                        }
                        className="px-2 py-1.5 border border-surface-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                      >
                        {Object.values(ORDER_STATUS).map((s) => (
                          <option key={s} value={s} className="capitalize">
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
