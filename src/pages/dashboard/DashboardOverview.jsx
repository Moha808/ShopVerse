import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineShoppingBag, HiOutlineEye } from "react-icons/hi";
import { useAuth } from "../../contexts/AuthContext";
import { getUserOrders } from "../../services/orderService";
import { formatCurrency, formatDate } from "../../utils/helpers";
import { ORDER_STATUS_COLORS } from "../../utils/constants";
import Loader from "../../components/common/Loader";

const DashboardOverview = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (user) {
        const data = await getUserOrders(user.uid);
        setOrders(data);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  if (loading) return <Loader text="Loading dashboard..." />;

  const recentOrders = orders.slice(0, 5);
  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-surface-100 p-5">
          <p className="text-sm text-surface-500">Total Orders</p>
          <p className="text-2xl font-bold text-surface-900 mt-1">
            {orders.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-100 p-5">
          <p className="text-sm text-surface-500">Total Spent</p>
          <p className="text-2xl font-bold text-surface-900 mt-1">
            {formatCurrency(totalSpent)}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-100 p-5">
          <p className="text-sm text-surface-500">Pending Orders</p>
          <p className="text-2xl font-bold text-surface-900 mt-1">
            {
              orders.filter(
                (o) => o.status === "pending" || o.status === "processing",
              ).length
            }
          </p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-surface-100">
        <div className="flex items-center justify-between p-5 border-b border-surface-100">
          <h2 className="text-lg font-bold text-surface-900">Recent Orders</h2>
          <Link
            to="/dashboard/orders"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View All
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-10 text-center">
            <HiOutlineShoppingBag className="w-12 h-12 text-surface-300 mx-auto mb-3" />
            <p className="text-surface-500">No orders yet.</p>
            <Link
              to="/shop"
              className="text-sm text-primary-600 font-medium mt-2 inline-block"
            >
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-surface-100">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-5 hover:bg-surface-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex -space-x-2">
                    {order.items?.slice(0, 3).map((item, i) => (
                      <img
                        key={i}
                        src={item.image}
                        alt=""
                        className="w-10 h-10 rounded-lg border-2 border-white object-cover"
                      />
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-800">
                      {order.items?.length || 0} item(s)
                    </p>
                    <p className="text-xs text-surface-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-2.5 py-1 text-xs font-bold rounded-full capitalize ${ORDER_STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}
                  >
                    {order.status}
                  </span>
                  <span className="text-sm font-semibold text-surface-900 hidden sm:block">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;
