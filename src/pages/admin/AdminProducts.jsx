import { useState, useEffect } from "react";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePhotograph,
} from "react-icons/hi";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from "../../services/productService";
import { PRODUCT_CATEGORIES } from "../../utils/constants";
import { formatCurrency } from "../../utils/helpers";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    comparePrice: "",
    category: "electronics",
    stock: "",
    featured: false,
    images: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      comparePrice: "",
      category: "electronics",
      stock: "",
      featured: false,
      images: [],
    });
    setImageFiles([]);
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setEditing(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      comparePrice: product.comparePrice || "",
      category: product.category,
      stock: product.stock,
      featured: product.featured,
      images: product.images || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) {
      return toast.error("Please fill required fields");
    }
    setSaving(true);
    try {
      const data = {
        ...formData,
        price: Number(formData.price),
        comparePrice: Number(formData.comparePrice) || 0,
        stock: Number(formData.stock),
        rating: editing ? undefined : 0,
        reviewCount: editing ? undefined : 0,
      };
      // Clean undefined values
      Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);

      if (editing) {
        await updateProduct(editing, data);
        toast.success("Product updated!");
      } else {
        await addProduct(data);
        toast.success("Product added!");
      }
      resetForm();
      loadProducts();
    } catch {
      toast.error("Failed to save product");
    }
    setSaving(false);
  };

  if (loading) return <Loader text="Loading products..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-surface-900">
          Products ({products.length})
        </h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors"
        >
          <HiOutlinePlus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Product Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-surface-100 p-6 mb-8"
        >
          <h3 className="text-lg font-bold text-surface-900 mb-5">
            {editing ? "Edit Product" : "Add New Product"}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-surface-700 mb-1.5 block">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-surface-700 mb-1.5 block">
                Description
              </label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-surface-700 mb-1.5 block">
                Price (₦) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-surface-700 mb-1.5 block">
                Compare Price (₦)
              </label>
              <input
                type="number"
                value={formData.comparePrice}
                onChange={(e) =>
                  setFormData({ ...formData, comparePrice: e.target.value })
                }
                className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-surface-700 mb-1.5 block">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-surface-700 mb-1.5 block">
                Stock *
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-surface-700 mb-1.5 block">
                Image URLs (comma-separated)
              </label>
              <input
                type="text"
                value={formData.images.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    images: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
              />
              <label className="text-sm text-surface-700">
                Featured product
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 disabled:bg-primary-400 transition-colors"
            >
              {saving
                ? "Saving..."
                : editing
                  ? "Update Product"
                  : "Add Product"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2.5 border border-surface-200 text-surface-600 text-sm font-medium rounded-xl hover:bg-surface-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-surface-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-surface-500 uppercase border-b border-surface-100">
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-surface-50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images?.[0]}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-surface-100"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-surface-800 truncate max-w-[200px]">
                          {product.name}
                        </p>
                        {product.featured && (
                          <span className="text-[10px] text-primary-600 font-bold">
                            FEATURED
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-surface-600 capitalize">
                    {product.category}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-surface-900">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-surface-400 hover:text-primary-600 transition-colors"
                        title="Edit"
                      >
                        <HiOutlinePencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-surface-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
