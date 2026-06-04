import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { formatDate } from "../../utils/helpers";
import Loader from "../../components/common/Loader";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(data);
      } catch {
        setUsers([]);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <Loader text="Loading users..." />;

  return (
    <div>
      <h2 className="text-xl font-bold text-surface-900 mb-6">
        Users ({users.length})
      </h2>

      {users.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-surface-100">
          <p className="text-surface-500">No users found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-surface-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-surface-500 uppercase border-b border-surface-100">
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-surface-50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">
                          {u.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <span className="text-sm font-medium text-surface-800">
                          {u.name || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-surface-600">
                      {u.email}
                    </td>
                    <td className="px-5 py-4 text-sm text-surface-600">
                      {u.phone || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-full capitalize ${
                          u.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-surface-100 text-surface-600"
                        }`}
                      >
                        {u.role || "customer"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-surface-500">
                      {formatDate(u.createdAt)}
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

export default AdminUsers;
