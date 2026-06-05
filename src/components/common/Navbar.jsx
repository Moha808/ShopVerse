import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  HiOutlineShoppingCart,
  HiOutlineHeart,
  HiOutlineUser,
  HiOutlineSearch,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineLogout,
  HiOutlineViewGrid,
  HiOutlineCog,
  HiOutlineMoon,
  HiOutlineSun,
} from "react-icons/hi";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userMenu, setUserMenu] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    setMobileMenu(false);
    setUserMenu(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenu]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setUserMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setSearchOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserMenu(false);
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/contact", label: "Contact Us" },
  ];

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-200 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-surface-200/60"
            : "bg-white border-b border-surface-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-extrabold text-xs leading-none">
                  SV
                </span>
              </div>
              <span className="text-lg font-extrabold text-surface-900 tracking-tight">
                Shop<span className="text-primary-600">Verse</span>
              </span>
            </Link>

            {/* ── Desktop nav ── */}
            <div className="hidden md:flex items-center gap-1 ml-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? "text-primary-700 bg-primary-50"
                      : "text-surface-500 hover:text-surface-800 hover:bg-surface-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/admin")
                      ? "text-primary-700 bg-primary-50"
                      : "text-surface-500 hover:text-surface-800 hover:bg-surface-50"
                  }`}
                >
                  Admin
                </Link>
              )}
            </div>

            {/* ── Search ── */}
            <div className="hidden md:block flex-1 max-w-sm mx-6">
              <form onSubmit={handleSearch} className="relative">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products…"
                  className="w-full pl-9 pr-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-300 transition-all"
                />
              </form>
            </div>

            {/* ── Right icons ── */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 text-surface-500 hover:text-surface-800 rounded-lg transition-colors"
                aria-label="Toggle Theme"
              >
                {isDark ? (
                  <HiOutlineSun className="w-5 h-5 text-amber-500" />
                ) : (
                  <HiOutlineMoon className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden p-2 text-surface-500 hover:text-surface-800 rounded-lg transition-colors"
                aria-label="Search"
              >
                <HiOutlineSearch className="w-5 h-5" />
              </button>

              <Link
                to="/wishlist"
                className="p-2 text-surface-500 hover:text-red-500 rounded-lg transition-colors"
                aria-label="Wishlist"
              >
                <HiOutlineHeart className="w-5 h-5" />
              </Link>

              <Link
                to="/cart"
                className="p-2 text-surface-500 hover:text-primary-600 rounded-lg transition-colors relative"
                aria-label="Cart"
              >
                <HiOutlineShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 bg-accent-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                    {itemCount > 99 ? "99" : itemCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenu(!userMenu)}
                    className="ml-1 flex items-center gap-1.5 p-1 pr-2.5 hover:bg-surface-50 rounded-lg transition-colors"
                  >
                    <div className="w-7 h-7 bg-primary-100 text-primary-700 rounded-md flex items-center justify-center text-xs font-bold">
                      {(
                        user.displayName?.[0] ||
                        user.email?.[0] ||
                        "U"
                      ).toUpperCase()}
                    </div>
                    <span className="hidden lg:block text-sm font-medium text-surface-600 max-w-[80px] truncate">
                      {user.displayName?.split(" ")[0] || "Account"}
                    </span>
                  </button>

                  {userMenu && (
                    <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl border border-surface-200 shadow-xl py-1.5 animate-scale-in origin-top-right z-50">
                      <div className="px-3.5 py-2.5 border-b border-surface-100">
                        <p className="text-sm font-semibold text-surface-900 truncate">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-[11px] text-surface-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-surface-600 hover:bg-surface-50 transition-colors"
                        >
                          <HiOutlineViewGrid className="w-4 h-4 text-surface-400" />{" "}
                          Dashboard
                        </Link>
                        <Link
                          to="/dashboard/profile"
                          className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-surface-600 hover:bg-surface-50 transition-colors"
                        >
                          <HiOutlineUser className="w-4 h-4 text-surface-400" />{" "}
                          Profile
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-surface-600 hover:bg-surface-50 transition-colors"
                          >
                            <HiOutlineCog className="w-4 h-4 text-surface-400" />{" "}
                            Admin Panel
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-surface-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                        >
                          <HiOutlineLogout className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="ml-1 hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Sign In
                </Link>
              )}

              <button
                onClick={() => setMobileMenu(!mobileMenu)}
                className="md:hidden p-2 text-surface-500 hover:text-surface-800 rounded-lg transition-colors ml-0.5"
                aria-label="Menu"
              >
                {mobileMenu ? (
                  <HiOutlineX className="w-5 h-5" />
                ) : (
                  <HiOutlineMenu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile search ── */}
        {searchOpen && (
          <div className="md:hidden px-4 pb-3 animate-fade-in">
            <form onSubmit={handleSearch} className="relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products…"
                className="w-full pl-9 pr-3 py-2.5 bg-surface-50 border border-surface-200 rounded-lg text-sm placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-300"
              />
            </form>
          </div>
        )}

        {/* ── Mobile menu ── */}
        {mobileMenu && (
          <div className="md:hidden border-t border-surface-100 bg-white animate-fade-in">
            <div className="px-4 py-3 space-y-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? "text-primary-700 bg-primary-50"
                      : "text-surface-600 hover:bg-surface-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-surface-600 hover:bg-surface-50 transition-colors"
                >
                  Admin Panel
                </Link>
              )}
              {!user && (
                <div className="pt-2 mt-2 border-t border-surface-100 flex gap-2">
                  <Link
                    to="/login"
                    className="flex-1 py-2.5 text-center text-sm font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 py-2.5 text-center text-sm font-semibold border border-surface-200 text-surface-700 rounded-lg hover:bg-surface-50 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {mobileMenu && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setMobileMenu(false)}
        />
      )}
    </>
  );
};

export default Navbar;
