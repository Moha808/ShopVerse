import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  HiOutlineFilter,
  HiOutlineX,
  HiOutlineSearch,
  HiStar,
} from "react-icons/hi";
import ProductCard from "../components/product/ProductCard";
import Loader from "../components/common/Loader";
import ProductSkeleton from "../components/common/ProductSkeleton";
import { getProducts } from "../services/productService";
import {
  PRODUCT_CATEGORIES,
  SORT_OPTIONS,
  ITEMS_PER_PAGE,
} from "../utils/constants";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "",
  );
  const [selectedSort, setSelectedSort] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [minRating, setMinRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Load products
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    };
    load();
  }, []);

  // Sync URL params
  useEffect(() => {
    const search = searchParams.get("search");
    const cat = searchParams.get("category");
    if (search) setSearchTerm(search);
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  // Filter & sort products
  const filtered = useMemo(() => {
    let result = [...products];

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term),
      );
    }

    // Category
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Price range
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );

    // Rating
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    // Sort
    switch (selectedSort) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedSort,
    priceRange,
    minRating,
  ]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedSort("newest");
    setPriceRange([0, 100000]);
    setMinRating(0);
    setCurrentPage(1);
    setSearchParams({});
  };

  const hasActiveFilters =
    searchTerm ||
    selectedCategory ||
    minRating > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 100000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900">
            {selectedCategory
              ? PRODUCT_CATEGORIES.find((c) => c.id === selectedCategory)
                  ?.name || "Shop"
              : searchTerm
                ? `Results for "${searchTerm}"`
                : "All Products"}
          </h1>
          <p className="text-surface-500 text-sm mt-1">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-surface-200 rounded-xl text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors"
          >
            <HiOutlineFilter className="w-4 h-4" />
            Filters
          </button>

          {/* Sort */}
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="flex-1 sm:flex-none px-4 py-2.5 border border-surface-200 rounded-xl text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* ===== Sidebar Filters ===== */}
        <aside
          className={`${
            showFilters ? "fixed inset-0 z-50 bg-black/50" : "hidden"
          } lg:block lg:static lg:bg-transparent`}
        >
          <div
            className={`${
              showFilters
                ? "absolute right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto"
                : ""
            } lg:w-64 lg:shrink-0`}
          >
            {/* Mobile close */}
            {showFilters && (
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h3 className="text-lg font-bold text-surface-900">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <HiOutlineX className="w-6 h-6 text-surface-500" />
                </button>
              </div>
            )}

            {/* Search */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-surface-800 mb-2 block">
                Search
              </label>
              <div className="relative">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2.5 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-surface-800 mb-2 block">
                Category
              </label>
              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    !selectedCategory
                      ? "bg-primary-50 text-primary-700 font-medium"
                      : "text-surface-600 hover:bg-surface-50"
                  }`}
                >
                  All Categories
                </button>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                      selectedCategory === cat.id
                        ? "bg-primary-50 text-primary-700 font-medium"
                        : "text-surface-600 hover:bg-surface-50"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-surface-800 mb-2 block">
                Price Range
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([+e.target.value, priceRange[1]])
                  }
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Min"
                />
                <span className="text-surface-400">—</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], +e.target.value])
                  }
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-surface-800 mb-2 block">
                Min Rating
              </label>
              <div className="space-y-1.5">
                {[4, 3, 2, 1].map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setMinRating(minRating === r ? 0 : r);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                      minRating === r
                        ? "bg-primary-50 text-primary-700 font-medium"
                        : "text-surface-600 hover:bg-surface-50"
                    }`}
                  >
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <HiStar
                          key={i}
                          className={`w-4 h-4 ${i < r ? "text-amber-400" : "text-surface-200"}`}
                        />
                      ))}
                    </div>
                    <span>& Up</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </aside>

        {/* ===== Product Grid ===== */}
        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-6xl mb-4">🔍</p>
              <h3 className="text-xl font-bold text-surface-800 mb-2">
                No Products Found
              </h3>
              <p className="text-surface-500 mb-6">
                Try adjusting your filters or search term
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginated.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-surface-200 rounded-lg text-sm font-medium text-surface-600 hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === i + 1
                          ? "bg-primary-600 text-white"
                          : "text-surface-600 hover:bg-surface-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-surface-200 rounded-lg text-sm font-medium text-surface-600 hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
