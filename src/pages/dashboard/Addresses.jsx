import { useState, useEffect } from "react";
import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";
import { useAuth } from "../../contexts/AuthContext";
import {
  getUserProfile,
  saveAddress,
  deleteAddress,
} from "../../services/userService";
import toast from "react-hot-toast";

const Addresses = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    label: "",
    address: "",
    city: "",
    state: "",
    phone: "",
  });

  useEffect(() => {
    const load = async () => {
      if (user) {
        const profile = await getUserProfile(user.uid);
        setAddresses(profile?.addresses || []);
      }
    };
    load();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.address || !formData.city || !formData.state) {
      return toast.error("Please fill in required fields");
    }
    try {
      await saveAddress(user.uid, formData);
      const profile = await getUserProfile(user.uid);
      setAddresses(profile?.addresses || []);
      setFormData({ label: "", address: "", city: "", state: "", phone: "" });
      setShowForm(false);
      toast.success("Address added!");
    } catch {
      toast.error("Failed to save address");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAddress(user.uid, id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Address removed");
    } catch {
      toast.error("Failed to remove address");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-surface-900">Saved Addresses</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors"
        >
          <HiOutlinePlus className="w-4 h-4" />
          Add Address
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-2xl border border-surface-100 p-6 mb-6"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-surface-700 mb-1.5 block">
                Label
              </label>
              <input
                type="text"
                name="label"
                value={formData.label}
                onChange={handleChange}
                placeholder="e.g. Home, Office"
                className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-surface-700 mb-1.5 block">
                Street Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-surface-700 mb-1.5 block">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-surface-700 mb-1.5 block">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-surface-700 mb-1.5 block">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors"
            >
              Save Address
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 border border-surface-200 text-surface-600 text-sm font-medium rounded-xl hover:bg-surface-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Address list */}
      {addresses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-surface-100">
          <p className="text-surface-500">No saved addresses yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white rounded-2xl border border-surface-100 p-5 relative group"
            >
              {addr.label && (
                <span className="inline-block px-2.5 py-0.5 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full mb-2">
                  {addr.label}
                </span>
              )}
              <p className="text-sm text-surface-700">{addr.address}</p>
              <p className="text-sm text-surface-500">
                {addr.city}, {addr.state}
              </p>
              {addr.phone && (
                <p className="text-sm text-surface-500 mt-1">{addr.phone}</p>
              )}
              <button
                onClick={() => handleDelete(addr.id)}
                className="absolute top-4 right-4 p-2 text-surface-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                aria-label="Delete address"
              >
                <HiOutlineTrash className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Addresses;
