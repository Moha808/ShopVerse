import { useState, useEffect } from "react";
import {
  HiOutlineCurrencyDollar,
  HiOutlineShoppingBag,
  HiOutlineUsers,
  HiOutlineCube,
} from "react-icons/hi";
import { getAllOrders } from "../../services/orderService";
import { getProducts } from "../../services/productService";
import { formatCurrency, formatDate } from "../../utils/helpers";
import { ORDER_STATUS_COLORS } from "../../utils/constants";
import Loader from "../../components/common/Loader";
import { seedDatabase } from "../../services/seedService";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const AdminOverview = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const loadData = async () => {
    try {
      const [ordersData, productsData] = await Promise.all([
        getAllOrders(),
        getProducts(),
      ]);
      setOrders(ordersData);
      setProducts(productsData);
    } catch (err) {
      console.error("Failed to load data", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      await loadData();
      setLoading(false);
    };
    load();
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    const toastId = toast.loading("Seeding Firestore database...");
    try {
      await seedDatabase();
      toast.success("Database seeded successfully!", { id: toastId });
      await loadData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to seed database.", { id: toastId });
    } finally {
      setSeeding(false);
    }
  };

  if (loading) return <Loader text="Loading analytics..." />;

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const recentOrders = orders.slice(0, 5);

  const monthlyData = [
    { name: "Jan", revenue: 45000 },
    { name: "Feb", revenue: 60000 },
    { name: "Mar", revenue: 35000 },
    { name: "Apr", revenue: 80000 },
    { name: "May", revenue: 65000 },
    { name: "Jun", revenue: 90000 },
    { name: "Jul", revenue: 75000 },
  ];

  const stats = [
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: HiOutlineCurrencyDollar,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: HiOutlineShoppingBag,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Products",
      value: products.length,
      icon: HiOutlineCube,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Pending Orders",
      value: orders.filter((o) => o.status === "pending").length,
      icon: HiOutlineUsers,
      color: "bg-amber-100 text-amber-600",
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-surface-900">Overview Analytics</h2>
          <p className="text-xs text-surface-500 mt-0.5">Real-time platform status & control</p>
        </div>
        <button
          onClick={handleSeed}
          disabled={seeding}
          className="px-4 py-2.5 bg-accent-500 hover:bg-accent-600 disabled:bg-accent-300 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer self-start sm:self-auto"
        >
          {seeding ? "Seeding Database..." : "Seed Demo Database"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-surface-100 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-500">{label}</p>
                <p className="text-2xl font-bold text-surface-900 mt-1">
                  {value}
                </p>
              </div>
              <div
                className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl border border-surface-100 p-6 mb-8">
        <h3 className="text-lg font-bold text-surface-900 mb-4">
          Revenue Overview
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(value) => `₦${(value / 1000)}k`}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [formatCurrency(value), 'Revenue']}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#6366f1" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-surface-100">
        <div className="p-5 border-b border-surface-100">
          <h3 className="text-lg font-bold text-surface-900">Recent Orders</h3>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-10 text-center text-surface-500">
            No orders yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-surface-500 uppercase border-b border-surface-100">
                  <th className="px-5 py-3">Order ID</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-surface-50 transition-colors"
                  >
                    <td className="px-5 py-4 text-sm font-mono text-surface-800">
                      {order.id?.slice(0, 10)}...
                    </td>
                    <td className="px-5 py-4 text-sm text-surface-600">
                      {order.items?.length || 0} items
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
