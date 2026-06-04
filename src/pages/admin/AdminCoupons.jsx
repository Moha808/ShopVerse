import { useState, useEffect } from "react";
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import {
  getAllCoupons,
  addCoupon,
  updateCoupon,
  deleteCoupon,
} from "../../services/couponService";
import { formatCurrency, formatDate } from "../../utils/helpers";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    type: "percent",
    minAmount: "",
    expiresAt: "",
    active: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    setLoading(true);
    const data = await getAllCoupons();
    setCoupons(data);
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      code: "",
      discount: "",
      type: "percent",
      minAmount: "",
      expiresAt: "",
      active: true,
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (coupon) => {
    setEditing(coupon.id);
    setFormData({
      code: coupon.code,
      discount: coupon.discount,
      type: coupon.type,
      minAmount: coupon.minAmount || "",
      expiresAt: coupon.expiresAt || "",
      active: coupon.active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      await deleteCoupon(id);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      toast.success("Coupon deleted");
    } catch {
      toast.error("Failed to delete coupon");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discount)
      return toast.error("Please fill required fields");
    setSaving(true);
    try {
      const data = {
        ...formData,
        discount: Number(formData.discount),
        minAmount: Number(formData.minAmount) || 0,
      };
      if (editing) {
        await updateCoupon(editing, data);
        toast.success("Coupon updated!");
      } else {
        await addCoupon(data);
        toast.success("Coupon created!");
      }
      resetForm();
      loadCoupons();
    } catch {
      toast.error("Failed to save coupon");
    }
    setSaving(false);
  };

  if (loading) return <Loader text="Loading coupons..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-surface-900">
          Coupons ({coupons.length})
        </h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors"
        >
          <HiOutlinePlus className="w-4 h-4" />
          Add Coupon
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-surface-100 p-6 mb-8"
        >
          <h3 className="text-lg font-bold text-surface-900 mb-5">
            {editing ? "Edit Coupon" : "Create Coupon"}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-surface-700 mb-1.5 block">
                Code *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase(),
                  })
                }
                placeholder="SAVE20"
                className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 uppercase"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-surface-700 mb-1.5 block">
                Discount Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₦)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-surface-700 mb-1.5 block">
                Discount {formData.type === "percent" ? "(%)" : "(₦)"} *
              </label>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) =>
                  setFormData({ ...formData, discount: e.target.value })
                }
                className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-surface-700 mb-1.5 block">
                Min. Amount (₦)
              </label>
              <input
                type="number"
                value={formData.minAmount}
                onChange={(e) =>
                  setFormData({ ...formData, minAmount: e.target.value })
                }
                className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-surface-700 mb-1.5 block">
                Expiry Date
              </label>
              <input
                type="date"
                value={formData.expiresAt}
                onChange={(e) =>
                  setFormData({ ...formData, expiresAt: e.target.value })
                }
                className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center gap-2 self-end pb-3">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
                className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
              />
              <label className="text-sm text-surface-700">Active</label>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 disabled:bg-primary-400 transition-colors"
            >
              {saving ? "Saving..." : editing ? "Update" : "Create"}
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

      {coupons.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-surface-100">
          <p className="text-surface-500">No coupons yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-surface-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-surface-500 uppercase border-b border-surface-100">
                  <th className="px-5 py-3">Code</th>
                  <th className="px-5 py-3">Discount</th>
                  <th className="px-5 py-3">Min Amount</th>
                  <th className="px-5 py-3">Expires</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {coupons.map((coupon) => (
                  <tr
                    key={coupon.id}
                    className="hover:bg-surface-50 transition-colors"
                  >
                    <td className="px-5 py-4 text-sm font-mono font-bold text-surface-800">
                      {coupon.code}
                    </td>
                    <td className="px-5 py-4 text-sm text-surface-600">
                      {coupon.type === "percent"
                        ? `${coupon.discount}%`
                        : formatCurrency(coupon.discount)}
                    </td>
                    <td className="px-5 py-4 text-sm text-surface-600">
                      {coupon.minAmount
                        ? formatCurrency(coupon.minAmount)
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-sm text-surface-500">
                      {coupon.expiresAt
                        ? formatDate(coupon.expiresAt)
                        : "No expiry"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                          coupon.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {coupon.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="p-2 text-surface-400 hover:text-primary-600 transition-colors"
                        >
                          <HiOutlinePencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="p-2 text-surface-400 hover:text-red-500 transition-colors"
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
      )}
    </div>
  );
};

export default AdminCoupons;
