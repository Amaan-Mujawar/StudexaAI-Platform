// src/pages/Admin/Users.jsx
// Shared design system: same cards, inputs, buttons, and empty states as User Dashboard.

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Mail,
  Calendar,
  Shield,
  Trash2,
  Lock,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import { getAllUsers, deleteUser, updateUser } from "../../api/adminApi.js";
import toast from "react-hot-toast";

const easePremium = [0.2, 0.8, 0.2, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: easePremium },
  },
};
const container = { hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.02 } } };

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllUsers({ page, limit: 10, search });
      setUsers(data.users ?? []);
      setPagination(data.pagination ?? { total: 0, pages: 1 });
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(), 500);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await deleteUser(id);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === "suspended" ? "active" : "suspended";
    const action = newStatus === "active" ? "activate" : "suspend";
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
    try {
      await updateUser(user._id, { status: newStatus });
      toast.success(`User ${action}d successfully`);
      fetchUsers();
    } catch (err) {
      toast.error(`Failed to ${action} user`);
    }
  };

  const filteredUsers =
    roleFilter === "all"
      ? users
      : users.filter((u) => u.role === roleFilter);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.section variants={fadeUp}>
        <div className="rounded-3xl border border-border bg-white/75 shadow-card backdrop-blur-xl p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-[26px] font-extrabold tracking-tight text-text-title sm:text-[34px]">
                User Management
              </h1>
              <p className="mt-2 text-sm text-text-muted">
                View and manage platform students
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="input w-full pl-12"
                />
              </div>
              <div className="flex rounded-2xl border border-border bg-white shadow-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setRoleFilter("all")}
                  className={`px-4 py-3 text-sm font-semibold transition-colors ${
                    roleFilter === "all"
                      ? "bg-brand-blue/10 text-text-title"
                      : "text-text-muted hover:bg-brand-blue/8"
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setRoleFilter("admin")}
                  className={`px-4 py-3 text-sm font-semibold transition-colors ${
                    roleFilter === "admin"
                      ? "bg-brand-blue/10 text-text-title"
                      : "text-text-muted hover:bg-brand-blue/8"
                  }`}
                >
                  Admins
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section variants={fadeUp}>
        <div className="rounded-3xl border border-border bg-white/75 shadow-card backdrop-blur-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-white/70">
                  <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-wider text-text-muted">
                    User
                  </th>
                  <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-wider text-text-muted">
                    Quizzes Taken
                  </th>
                  <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-wider text-text-muted">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-wider text-text-muted">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-wider text-text-muted text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-8">
                        <div className="flex gap-4 items-center">
                          <div className="w-12 h-12 rounded-full bg-surface-page/70" />
                          <div className="space-y-2">
                            <div className="h-4 w-40 rounded-lg bg-surface-page/70" />
                            <div className="h-3 w-24 rounded bg-surface-page/70" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="dashboard-empty">
                        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-white/70 shadow-card mb-3">
                          <Users className="h-7 w-7 text-text-muted" />
                        </div>
                        <p className="dashboard-empty-title">No users found</p>
                        <p className="dashboard-empty-desc">
                          Try adjusting search or filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="group hover:bg-brand-blue/5 transition-colors duration-200"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg border border-border bg-white shadow-card text-brand-blue">
                            {user.name?.[0] ?? "?"}
                          </div>
                          <div>
                            <p className="font-extrabold text-text-title">
                              {user.name}
                            </p>
                            <div className="flex items-center gap-1.5 text-text-muted text-sm mt-0.5">
                              <Mail size={14} />
                              {user.email}
                              {user.role === "admin" && (
                                <span className="ml-2 px-2 py-0.5 rounded-md bg-brand-blue/10 text-brand-blue text-[11px] font-bold uppercase tracking-wider">
                                  Admin
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-extrabold text-text-title">
                          {user.quizCount ?? 0}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            user.status === "suspended"
                              ? "bg-status-error/10 text-status-error"
                              : "bg-status-success/10 text-status-success"
                          }`}
                        >
                          {user.status === "suspended" ? (
                            <Lock size={12} />
                          ) : (
                            <Shield size={12} />
                          )}
                          {user.status ?? "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-text-muted text-sm">
                          <Calendar size={16} />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(user)}
                            title={
                              user.status === "suspended"
                                ? "Activate User"
                                : "Suspend User"
                            }
                            className={`p-2.5 rounded-xl transition-all ${
                              user.status === "suspended"
                                ? "text-status-success hover:bg-status-success/10"
                                : "text-text-muted hover:text-status-warning hover:bg-status-warning/10"
                            }`}
                          >
                            {user.status === "suspended" ? (
                              <Shield size={18} />
                            ) : (
                              <Lock size={18} />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(user._id)}
                            className="p-2.5 rounded-xl hover:bg-status-error/10 text-text-muted hover:text-status-error transition-all"
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="px-6 py-5 border-t border-border flex items-center justify-between bg-white/50">
              <p className="text-sm font-semibold text-text-muted">
                Showing{" "}
                <span className="font-extrabold text-text-title">{users.length}</span> of{" "}
                <span className="font-extrabold text-text-title">{pagination.total}</span> users
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary p-2 rounded-xl disabled:opacity-30"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex gap-1">
                  {[...Array(pagination.pages)].map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                        page === i + 1
                          ? "bg-brand-blue/10 text-text-title shadow-card"
                          : "text-text-muted hover:bg-brand-blue/8"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setPage((p) => Math.min(pagination.pages, p + 1))
                  }
                  disabled={page === pagination.pages}
                  className="btn-secondary p-2 rounded-xl disabled:opacity-30"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default AdminUsers;
