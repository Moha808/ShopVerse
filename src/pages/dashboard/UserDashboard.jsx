import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  HiOutlineViewGrid,
  HiOutlineShoppingBag,
  HiOutlineUser,
  HiOutlineLocationMarker,
  HiOutlineHeart,
} from "react-icons/hi";
import { useAuth } from "../../contexts/AuthContext";

const sidebarLinks = [
  { to: "/dashboard", label: "Overview", icon: HiOutlineViewGrid, exact: true },
  { to: "/dashboard/orders", label: "My Orders", icon: HiOutlineShoppingBag },
  { to: "/dashboard/profile", label: "Profile", icon: HiOutlineUser },
  {
    to: "/dashboard/addresses",
    label: "Addresses",
    icon: HiOutlineLocationMarker,
  },
  { to: "/wishlist", label: "Wishlist", icon: HiOutlineHeart },
];

const UserDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (link) => {
    if (link.exact) return location.pathname === link.to;
    return location.pathname.startsWith(link.to);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-extrabold text-surface-900 mb-8">
        Welcome, {user?.displayName || "User"} 👋
      </h1>

      <div className="grid lg:grid-cols-4 gap-8">
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
                      : "text-surface-600 hover:bg-surface-50 hover:text-surface-800"
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
        <main className="lg:col-span-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
