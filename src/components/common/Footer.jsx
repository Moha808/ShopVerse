import { Link } from "react-router-dom";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from "react-icons/hi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const shopLinks = [
    { to: "/shop", label: "All Products" },
    { to: "/shop?category=electronics", label: "Electronics" },
    { to: "/shop?category=fashion", label: "Fashion" },
    { to: "/shop?category=home", label: "Home & Living" },
    { to: "/shop?category=beauty", label: "Beauty & Health" },
  ];

  const accountLinks = [
    { to: "/dashboard", label: "My Dashboard" },
    { to: "/dashboard/orders", label: "Order History" },
    { to: "/wishlist", label: "Wishlist" },
    { to: "/cart", label: "Shopping Cart" },
    { to: "/dashboard/profile", label: "Profile Settings" },
  ];

  const companyLinks = [
    { to: "/about", label: "About Us" },
    { to: "/privacy", label: "Privacy Policy" },
    { to: "/terms", label: "Terms & Conditions" },
    { to: "/returns", label: "Return Policy" },
    { to: "/faq", label: "FAQ" },
  ];

  return (
    <footer className="bg-surface-900 text-surface-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-extrabold text-sm">SV</span>
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Shop<span className="text-primary-400">Verse</span>
              </span>
            </Link>
            <p className="text-sm text-surface-400 leading-relaxed max-w-sm mb-6">
              Your premium online marketplace. Discover thousands of quality
              products with secure checkout and fast delivery across Nigeria.
            </p>
            <div className="space-y-3">
              <a
                href="mailto:support@shopverse.ng"
                className="flex items-center gap-3 text-sm text-surface-400 hover:text-primary-400 transition-colors"
              >
                <HiOutlineMail className="w-4 h-4 shrink-0" />
                support@shopverse.ng
              </a>
              <a
                href="tel:09156151191"
                className="flex items-center gap-3 text-sm text-surface-400 hover:text-primary-400 transition-colors"
              >
                <HiOutlinePhone className="w-4 h-4 shrink-0" />
                09156151191
              </a>
              <span className="flex items-center gap-3 text-sm text-surface-400">
                <HiOutlineLocationMarker className="w-4 h-4 shrink-0" />
                Lagos, Nigeria
              </span>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Shop
            </h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-surface-400 hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Account
            </h3>
            <ul className="space-y-3">
              {accountLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-surface-400 hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-surface-400 hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-surface-500">
              © {currentYear} ShopVerse. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-surface-500">We accept:</span>
              <div className="flex items-center gap-3">
                {["Visa", "Mastercard", "Paystack"].map((method) => (
                  <span
                    key={method}
                    className="px-2.5 py-1 bg-surface-800 text-surface-400 text-[10px] font-bold rounded-md uppercase tracking-wider"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
