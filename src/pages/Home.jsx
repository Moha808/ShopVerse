import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineArrowRight,
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineCreditCard,
  HiOutlineSupport,
  HiOutlineShoppingBag,
  HiOutlineDesktopComputer,
  HiOutlineSparkles,
  HiOutlineHome,
  HiOutlineHeart,
  HiOutlineLightningBolt,
  HiOutlineBookOpen,
  HiOutlinePuzzle,
  HiStar,
} from "react-icons/hi";
import ProductCard from "../components/product/ProductCard";
import { PRODUCT_CATEGORIES } from "../utils/constants";
import { DEMO_PRODUCTS } from "../utils/seedData";
import { getFeaturedProducts } from "../services/productService";

const CATEGORY_ICONS = {
  electronics: HiOutlineDesktopComputer,
  fashion: HiOutlineSparkles,
  home: HiOutlineHome,
  beauty: HiOutlineHeart,
  sports: HiOutlineLightningBolt,
  books: HiOutlineBookOpen,
  toys: HiOutlinePuzzle,
  grocery: HiOutlineShoppingBag,
};

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const products = await getFeaturedProducts();
        setFeatured(products);
      } catch {
        setFeatured(DEMO_PRODUCTS.filter((p) => p.featured));
      }
      setLoading(false);
    };
    load();
  }, []);

  const benefits = [
    {
      icon: HiOutlineTruck,
      title: "Free Delivery",
      desc: "On orders over ₦50,000",
    },
    {
      icon: HiOutlineShieldCheck,
      title: "Secure Payment",
      desc: "100% protected checkout",
    },
    {
      icon: HiOutlineCreditCard,
      title: "Easy Returns",
      desc: "30-day return policy",
    },
    {
      icon: HiOutlineSupport,
      title: "24/7 Support",
      desc: "Dedicated customer care",
    },
  ];

  return (
    <div>
      {/* ────────── Hero ────────── */}
      <section className="relative bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 overflow-hidden">
        {/* soft glow decorations */}
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-primary-600/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 right-0 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[140px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 text-accent-300 text-xs font-semibold rounded-full border border-white/10 mb-6 backdrop-blur-sm">
                <HiStar className="w-3.5 h-3.5 text-accent-400" />
                New Collection 2026
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.1] tracking-tight">
                Discover Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-300">
                  Perfect Style
                </span>
              </h1>

              <p className="mt-5 text-base sm:text-lg text-primary-200/80 max-w-lg leading-relaxed">
                Shop thousands of premium products with secure checkout and
                lightning-fast delivery. Your one-stop marketplace for
                everything you need.
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent-500 hover:bg-accent-600 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Shop Now
                  <HiOutlineArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/shop?category=electronics"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/15 text-white text-sm font-bold rounded-xl transition-all border border-white/15 backdrop-blur-sm"
                >
                  Explore Electronics
                </Link>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-8 mt-10 pt-8 border-t border-white/10">
                {[
                  { value: "10K+", label: "Products" },
                  { value: "50K+", label: "Customers" },
                  { value: "4.8", label: "Rating", star: true },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-1">
                      {stat.value}
                      {stat.star && (
                        <HiStar className="w-4 h-4 text-amber-400" />
                      )}
                    </p>
                    <p className="text-xs text-primary-400 mt-0.5">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:block animate-fade-in pl-8">
              <div className="absolute -inset-4 bg-gradient-to-tr from-accent-500 to-primary-600 rounded-[2.5rem] blur-2xl opacity-20 -z-10 animate-pulse-soft"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <img
                  src="/hero-image.png"
                  alt="ShopVerse Premium Showcase"
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────── Benefits ────────── */}
      <section className="bg-white border-b border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-surface-800 truncate">
                    {title}
                  </p>
                  <p className="text-[11px] sm:text-xs text-surface-500 truncate">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────── Categories ────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-surface-900">
            Shop by Category
          </h2>
          <p className="text-surface-500 mt-2 text-sm">
            Find exactly what you're looking for
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
          {PRODUCT_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id] || HiOutlineShoppingBag;
            return (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.id}`}
                className="group flex flex-col items-center gap-3 p-6 sm:p-7 bg-white rounded-2xl border border-surface-100 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-50 rounded-2xl flex items-center justify-center group-hover:bg-primary-600 transition-colors duration-300">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-surface-700 group-hover:text-primary-700 transition-colors text-center">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ────────── Featured Products ────────── */}
      <section className="bg-surface-50/80 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 sm:mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-surface-900">
                Featured Products
              </h2>
              <p className="text-surface-500 mt-1 text-sm">
                Handpicked just for you
              </p>
            </div>
            <Link
              to="/shop"
              className="hidden sm:inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-semibold text-sm transition-colors"
            >
              View All
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden border border-surface-100"
                >
                  <div className="aspect-square skeleton" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 w-16 skeleton rounded" />
                    <div className="h-4 w-full skeleton rounded" />
                    <div className="h-4 w-3/4 skeleton rounded" />
                    <div className="h-5 w-20 skeleton rounded mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {featured.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold text-sm rounded-xl hover:bg-primary-700 transition-colors"
            >
              View All Products
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ────────── Promo Banner ────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-accent-500 via-accent-600 to-orange-600 p-8 sm:p-12 overflow-hidden">
          {/* decorative circles */}
          <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <span className="inline-block px-3 py-1 bg-white/20 text-white text-[10px] font-bold rounded-full uppercase tracking-wider mb-3">
                Limited Time Offer
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                Up to 50% Off
              </h2>
              <p className="text-white/80 mt-2 max-w-md text-sm sm:text-base">
                Don't miss out on our biggest sale of the season. Premium
                products at unbeatable prices.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-accent-600 text-sm font-bold rounded-xl hover:bg-white/90 transition-colors shadow-lg shrink-0"
            >
              Shop Deals
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ────────── Newsletter ────────── */}
      <section className="bg-surface-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
              Stay in the Loop
            </h2>
            <p className="text-surface-400 text-sm mb-7">
              Subscribe to get exclusive deals and new arrivals delivered
              straight to your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/15 text-white placeholder-surface-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white text-sm font-bold rounded-xl transition-colors shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
