import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { updateUserProfile, uploadAvatar } from "../../services/userService";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, userProfile, setUserProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: userProfile?.name || user?.displayName || "",
    email: user?.email || "",
    phone: userProfile?.phone || "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Image size must be less than 2MB");
    }

    setUploading(true);
    const toastId = toast.loading("Uploading avatar...");
    try {
      const url = await uploadAvatar(user.uid, file);
      setUserProfile((prev) => ({ ...prev, avatar: url }));
      toast.success("Avatar updated!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload avatar.", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setUploading(true);
    const toastId = toast.loading("Removing avatar...");
    try {
      await updateUserProfile(user.uid, { avatar: "" });
      setUserProfile((prev) => ({ ...prev, avatar: "" }));
      toast.success("Avatar removed!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove avatar.", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        name: formData.name,
        phone: formData.phone,
      });
      setUserProfile((prev) => ({
        ...prev,
        name: formData.name,
        phone: formData.phone,
      }));
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    }
    setSaving(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-surface-900 mb-6">My Profile</h2>

      <div className="bg-white rounded-2xl border border-surface-100 p-6 sm:p-8">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8">
          {userProfile?.avatar ? (
            <img
              src={userProfile.avatar}
              alt={formData.name}
              className="w-16 h-16 rounded-full object-cover border border-surface-100"
            />
          ) : (
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-2xl font-bold border border-surface-100">
              {formData.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
          <div>
            <p className="text-lg font-semibold text-surface-900 leading-tight">
              {formData.name}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <label className="text-xs text-primary-600 hover:text-primary-700 font-semibold cursor-pointer">
                {uploading ? "Uploading..." : "Change Photo"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={uploading}
                />
              </label>
              {userProfile?.avatar && (
                <>
                  <span className="text-surface-300 text-xs">•</span>
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="text-xs text-red-500 hover:text-red-600 font-semibold cursor-pointer"
                  >
                    Remove
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
          <div>
            <label className="text-sm font-medium text-surface-700 mb-1.5 block">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-surface-700 mb-1.5 block">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm bg-surface-50 text-surface-500 cursor-not-allowed"
            />
            <p className="text-xs text-surface-400 mt-1">
              Email cannot be changed
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-surface-700 mb-1.5 block">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+234..."
              className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-primary-600/20"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
