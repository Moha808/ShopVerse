import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  HiStar,
  HiOutlineHeart,
  HiHeart,
  HiOutlineShoppingCart,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineRefresh,
  HiOutlineMinus,
  HiOutlinePlus,
} from "react-icons/hi";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useAuth } from "../contexts/AuthContext";
import {
  getProductById,
  getProductsByCategory,
} from "../services/productService";
import { getReviews, addReview } from "../services/reviewService";
import { formatCurrency, calcDiscount, formatDate } from "../utils/helpers";
import ProductCard from "../components/product/ProductCard";
import Loader from "../components/common/Loader";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  // Review form states
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setQuantity(1);
      setSelectedImage(0);
      const prod = await getProductById(id);
      setProduct(prod);

      if (prod) {
        const rel = await getProductsByCategory(prod.category);
        setRelated(rel.filter((p) => p.id !== prod.id).slice(0, 4));
        // Fetch real reviews from Firestore
        const revs = await getReviews(prod.id);
        setReviews(revs);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return toast.error("Please enter a comment");
    setSubmitting(true);
    try {
      const reviewObj = {
        productId: product.id,
        userId: user.uid,
        userName: user.displayName || user.email || "Anonymous",
        rating: newRating,
        comment: newComment.trim(),
      };
      const created = await addReview(reviewObj);
      setReviews((prev) => [created, ...prev]);
      setNewComment("");
      setNewRating(5);
      toast.success("Review submitted!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader text="Loading product..." />;
  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-6xl mb-4">😕</p>
        <h2 className="text-2xl font-bold text-surface-800 mb-2">
          Product Not Found
        </h2>
        <Link
          to="/shop"
          className="text-primary-600 hover:text-primary-700 font-semibold"
        >
          ← Back to Shop
        </Link>
      </div>
    );
  }

  const discount = calcDiscount(product.comparePrice, product.price);
  const inWishlist = isInWishlist(product.id);
  const inStock = product.stock > 0;

  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0
    ? (reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviewCount).toFixed(1)
    : product.rating || 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Added ${quantity} item(s) to cart!`);
  };

  const handleWishlist = () => {
    if (!user) return toast.error("Please sign in to use wishlist");
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-surface-500 mb-8">
        <Link to="/" className="hover:text-primary-600">
          Home
        </Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-primary-600">
          Shop
        </Link>
        <span>/</span>
        <Link
          to={`/shop?category=${product.category}`}
          className="hover:text-primary-600 capitalize"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-surface-800 font-medium truncate">
          {product.name}
        </span>
      </nav>

      {/* Product info */}
      <div className="grid lg:grid-cols-2 gap-10 mb-16">
        {/* Image Gallery */}
        <div>
          <div className="relative aspect-square bg-surface-100 rounded-2xl overflow-hidden mb-4">
            <img
              src={product.images?.[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1.5 bg-accent-500 text-white text-sm font-bold rounded-full">
                -{discount}%
              </span>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    selectedImage === i
                      ? "border-primary-600"
                      : "border-surface-200 hover:border-surface-300"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold uppercase rounded-full mb-3">
            {product.category}
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <HiStar
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(averageRating)
                      ? "text-amber-400"
                      : "text-surface-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-surface-500">
              {averageRating} ({reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4 mt-5">
            <span className="text-3xl font-extrabold text-surface-900">
              {formatCurrency(product.price)}
            </span>
            {product.comparePrice > product.price && (
              <span className="text-lg text-surface-400 line-through">
                {formatCurrency(product.comparePrice)}
              </span>
            )}
            {discount > 0 && (
              <span className="px-2.5 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-lg">
                Save {formatCurrency(product.comparePrice - product.price)}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="mt-4">
            {inStock ? (
              <span className="text-sm text-green-600 font-medium">
                ✅ In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-sm text-red-500 font-medium">
                ❌ Out of Stock
              </span>
            )}
          </div>

          {/* Description preview */}
          <p className="mt-5 text-surface-600 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity + Add to Cart */}
          {inStock && (
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
              <div className="flex justify-between items-center border border-surface-200 rounded-xl w-full sm:w-auto h-12">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 h-full text-surface-600 hover:text-primary-600 hover:bg-surface-50 transition-colors rounded-l-xl flex items-center justify-center font-bold"
                >
                  <HiOutlineMinus className="w-4 h-4" />
                </button>
                <div className="w-12 text-center font-semibold text-surface-800">
                  {quantity}
                </div>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  className="px-4 h-full text-surface-600 hover:text-primary-600 hover:bg-surface-50 transition-colors rounded-r-xl flex items-center justify-center font-bold"
                >
                  <HiOutlinePlus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 h-12 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary-600/20"
                >
                  <HiOutlineShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>

                <button
                  onClick={handleWishlist}
                  className={`flex items-center justify-center h-12 w-12 border rounded-xl transition-all ${
                    inWishlist
                      ? "border-red-200 bg-red-50 text-red-500"
                      : "border-surface-200 text-surface-600 hover:border-primary-200 hover:text-primary-600"
                  }`}
                  title={
                    inWishlist ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  {inWishlist ? (
                    <HiHeart className="w-5 h-5" />
                  ) : (
                    <HiOutlineHeart className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-surface-100">
            {[
              { icon: HiOutlineTruck, text: "Free Delivery" },
              { icon: HiOutlineShieldCheck, text: "Warranty" },
              { icon: HiOutlineRefresh, text: "30-Day Returns" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex flex-col items-center gap-2 text-center"
              >
                <Icon className="w-6 h-6 text-primary-600" />
                <span className="text-xs text-surface-500 font-medium">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs: Reviews */}
      <div className="mb-16">
        <div className="flex gap-6 border-b border-surface-200 mb-8">
          {["description", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-semibold capitalize transition-colors border-b-2 ${
                activeTab === tab
                  ? "text-primary-600 border-primary-600"
                  : "text-surface-500 border-transparent hover:text-surface-700"
              }`}
            >
              {tab} {tab === "reviews" && `(${reviews.length})`}
            </button>
          ))}
        </div>

        {activeTab === "description" ? (
          <div className="prose prose-sm max-w-none text-surface-600">
            <p>{product.description}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Write a review form */}
            {user ? (
              <form onSubmit={handleReviewSubmit} className="bg-white p-6 rounded-2xl border border-surface-100 mb-6 space-y-4">
                <h3 className="text-lg font-bold text-surface-900">Write a Review</h3>
                <div>
                  <label className="text-sm font-medium text-surface-700 block mb-1.5">Your Rating *</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="text-2xl transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                      >
                        <HiStar className={star <= newRating ? "text-amber-400" : "text-surface-200"} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="comment" className="text-sm font-medium text-surface-700 block mb-1.5">Review Comment *</label>
                  <textarea
                    id="comment"
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold rounded-xl transition-colors shadow-md text-sm cursor-pointer"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            ) : (
              <div className="bg-white p-6 rounded-2xl border border-surface-100 text-center mb-6">
                <p className="text-sm text-surface-600">
                  Please{" "}
                  <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                    sign in
                  </Link>{" "}
                  to write a review.
                </p>
              </div>
            )}

            <h3 className="text-lg font-bold text-surface-900 border-b border-surface-100 pb-3 mb-2">Customer Reviews</h3>

            {reviews.length === 0 ? (
              <p className="text-surface-500 text-center py-8">
                No reviews yet. Be the first to review!
              </p>
            ) : (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white p-5 rounded-xl border border-surface-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">
                        {review.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-surface-800">
                          {review.userName}
                        </p>
                        <p className="text-xs text-surface-400">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <HiStar
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? "text-amber-400" : "text-surface-200"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-surface-600">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <h2 className="text-xl font-extrabold text-surface-900 mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
