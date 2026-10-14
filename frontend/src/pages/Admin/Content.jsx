// src/pages/Admin/Content.jsx
// Shared design system: same cards, form inputs, buttons, empty state as User Dashboard.

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Search,
  FileText,
  BookOpen,
  BrainCircuit,
  Edit3,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Save,
  Layers,
  FileUp,
} from "lucide-react";
import {
  getAllContent,
  createContent,
  updateContent,
  deleteContent,
} from "../../api/adminApi.js";
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
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.02 } },
};

const AdminContent = () => {
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [editingContent, setEditingContent] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [formData, setFormData] = useState({
    title: "",
    type: "study-material",
    description: "",
    body: "",
    topic: "",
    difficulty: "medium",
    fileUrl: "",
    status: "published",
    isPublic: true,
  });

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllContent({ search, type, page, limit: 10 });
      setContentList(data.content ?? []);
      setPagination(data.pagination ?? { total: 0, pages: 1 });
    } catch (err) {
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  }, [search, type, page]);

  useEffect(() => {
    const timer = setTimeout(() => fetchContent(), 500);
    return () => clearTimeout(timer);
  }, [fetchContent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(editingContent ? "Updating..." : "Creating...");
    try {
      if (editingContent) {
        await updateContent(editingContent._id, formData);
        toast.success("Content updated successfully", { id: loadingToast });
      } else {
        await createContent(formData);
        toast.success("Content created successfully", { id: loadingToast });
      }
      setFormData({
        title: "",
        type: "study-material",
        description: "",
        body: "",
        topic: "",
        difficulty: "medium",
        fileUrl: "",
        status: "published",
        isPublic: true,
      });
      setEditingContent(null);
      setIsFormOpen(false);
      fetchContent();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Something went wrong", {
        id: loadingToast,
      });
    }
  };

  const handleEdit = (item) => {
    setEditingContent(item);
    setFormData({
      title: item.title,
      type: item.type,
      description: item.description ?? "",
      body: item.body ?? "",
      topic: item.topic ?? "",
      difficulty: item.difficulty ?? "medium",
      fileUrl: item.fileUrl ?? "",
      status: item.status ?? "published",
      isPublic: item.isPublic ?? true,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure? This will remove the content immediately.")
    )
      return;
    try {
      await deleteContent(id);
      toast.success("Content deleted");
      fetchContent();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.section variants={fadeUp}>
        <div className="rounded-3xl border border-border bg-white/75 shadow-card backdrop-blur-xl p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-[26px] font-extrabold tracking-tight text-text-title sm:text-[34px]">
                Content Management
              </h1>
              <p className="mt-2 text-sm text-text-muted">
                Organize study materials, tests, and AI resources
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <motion.section variants={fadeUp} className="lg:col-span-7 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search title or topic..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="input pl-12"
              />
            </div>
            <div className="w-full md:w-48">
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setPage(1);
                }}
                className="select px-4 py-3"
              >
                <option value="">All Types</option>
                <option value="study-material">Study Material</option>
                <option value="test">Tests</option>
                <option value="quiz">Quizzes</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-28 rounded-3xl border border-border bg-white/75 shadow-card animate-pulse"
                />
              ))
            ) : contentList.length === 0 ? (
              <div className="dashboard-empty rounded-3xl border border-border bg-white/70 shadow-card py-20">
                <Layers className="mx-auto h-10 w-10 text-text-muted mb-4" />
                <p className="dashboard-empty-title">No content found</p>
                <p className="dashboard-empty-desc">
                  Matching your criteria. Try a different search or create new.
                </p>
              </div>
            ) : (
              contentList.map((item) => (
                <div
                  key={item._id}
                  className="group p-5 rounded-3xl border border-border bg-white/75 shadow-card backdrop-blur-xl transition-all duration-200 hover:shadow-card-hover hover:border-brand-blue/20"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div
                        className={`hidden sm:flex p-4 rounded-2xl h-fit border border-border bg-white shadow-card ${item.type === "quiz"
                          ? "text-status-warning"
                          : item.type === "test"
                            ? "text-status-error"
                            : "text-brand-blue"
                          }`}
                      >
                        {item.type === "quiz" ? (
                          <BrainCircuit size={24} />
                        ) : item.type === "test" ? (
                          <FileText size={24} />
                        ) : (
                          <BookOpen size={24} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] uppercase font-extrabold tracking-widest px-2 py-0.5 rounded-md bg-surface-page text-text-muted">
                            {item.type}
                          </span>
                          <span className="text-[10px] uppercase font-extrabold tracking-widest px-2 py-0.5 rounded-md bg-brand-blue/10 text-brand-blue">
                            {item.difficulty}
                          </span>
                          <span className={`text-[10px] uppercase font-extrabold tracking-widest px-2 py-0.5 rounded-md ${item.status === 'published' ? 'bg-status-success/10 text-status-success' : 'bg-text-muted/10 text-text-muted'}`}>
                            {item.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-extrabold text-text-title group-hover:text-brand-blue transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-text-muted line-clamp-1 mt-1">
                          {item.description}
                        </p>
                        <p className="text-xs text-text-muted mt-2 font-mono bg-surface-page w-fit px-2 py-0.5 rounded">
                          {item.topic ?? "Uncategorized"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="p-2.5 rounded-xl hover:bg-brand-blue/8 text-text-muted hover:text-brand-blue transition-all"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item._id)}
                        className="p-2.5 rounded-xl hover:bg-status-error/10 text-text-muted hover:text-status-error transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {pagination.pages > 1 && (
            <div className="p-4 rounded-2xl border border-border bg-white/75 shadow-card flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary p-2 rounded-xl disabled:opacity-30"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm font-bold text-text-muted">
                Page {page} of {pagination.pages}
              </span>
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
          )}
        </motion.section>

        <motion.section
          variants={fadeUp}
          className={`lg:col-span-5 sticky top-8 transition-all duration-300 ${isFormOpen
            ? "opacity-100"
            : "opacity-0 translate-x-4 pointer-events-none hidden lg:block lg:opacity-100 lg:translate-x-0 lg:pointer-events-auto"
            }`}
        >
          <form
            onSubmit={handleSubmit}
            className="p-8 rounded-3xl border border-border bg-white/75 shadow-card backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-2xl border border-border bg-white shadow-card flex items-center justify-center text-brand-blue">
                {editingContent ? (
                  <Edit3 size={20} />
                ) : (
                  <FileUp size={20} />
                )}
              </div>
              <h2 className="text-lg font-extrabold text-text-title">
                {editingContent ? "Edit Content" : "Create New Content"}
              </h2>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-muted pl-1">
                  Title
                </label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="input"
                  placeholder="Enter content title..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-muted pl-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="select"
                  >
                    <option value="study-material">Study Material</option>
                    <option value="test">Test</option>
                    <option value="quiz">Quiz</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-muted pl-1">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({ ...formData, difficulty: e.target.value })
                    }
                    className="select"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-muted pl-1">
                  Topic
                </label>
                <input
                  value={formData.topic}
                  onChange={(e) =>
                    setFormData({ ...formData, topic: e.target.value })
                  }
                  className="input"
                  placeholder="e.g. Mathematics, AI Foundations"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-muted pl-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={2}
                  className="input w-full resize-none"
                  placeholder="Brief overview of the content..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-muted pl-1">
                  Content Body (Markdown/JSON)
                </label>
                <textarea
                  required
                  value={formData.body}
                  onChange={(e) =>
                    setFormData({ ...formData, body: e.target.value })
                  }
                  rows={6}
                  className="input w-full resize-none font-mono text-sm"
                  placeholder="Paste your content structure here..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-muted pl-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="select"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-muted pl-1">
                    Visibility
                  </label>
                  <select
                    value={String(formData.isPublic)}
                    onChange={(e) =>
                      setFormData({ ...formData, isPublic: e.target.value === "true" })
                    }
                    className="select"
                  >
                    <option value="true">Public</option>
                    <option value="false">Private</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="btn-primary w-full py-4 mt-4 flex items-center justify-center gap-2"
              >
                <Save size={20} />
                {editingContent ? "Update Content" : "Publish Content"}
              </button>
            </div>
          </form>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default AdminContent;
