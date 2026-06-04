import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  HiOutlineViewGrid,
  HiOutlineCube,
  HiOutlineShoppingBag,
  HiOutlineUsers,
  HiOutlineTicket,
  HiOutlineArrowLeft,
} from "react-icons/hi";
import { useAuth } from "../../contexts/AuthContext";

const sidebarLinks = [
  { to: "/admin", label: "Dashboard", icon: HiOutlineViewGrid, exact: true },
  { to: "/admin/products", label: "Products", icon: HiOutlineCube },
  { to: "/admin/orders", label: "Orders", icon: HiOutlineShoppingBag },
  { to: "/admin/users", label: "Users", icon: HiOutlineUsers },
  { to: "/admin/coupons", label: "Coupons", icon: HiOutlineTicket },
];

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (link) => {
    if (link.exact) return location.pathname === link.to;
    return location.pathname.startsWith(link.to);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-surface-900">
            Admin Panel
          </h1>
          <p className="text-sm text-surface-500">Manage your store</p>
        </div>
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-surface-600 hover:text-primary-600 transition-colors"
        >
          <HiOutlineArrowLeft className="w-4 h-4" />
          Back to Store
        </Link>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <nav className="bg-white rounded-2xl border border-surface-100 p-3 space-y-1 sticky top-24">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link)
                      ? "bg-primary-50 text-primary-700"
                      : "text-surface-600 hover:bg-surface-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="lg:col-span-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
