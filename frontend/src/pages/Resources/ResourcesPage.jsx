// src/pages/Resources/ResourcesPage.jsx
import { useEffect, useState } from "react";
import {
    BookOpen,
    FileText,
    BrainCircuit,
    Search,
    ExternalLink,
    Download,
    Clock,
    Layers
} from "lucide-react";
import api from "../../services/api";
import { motion } from "framer-motion";

const ResourceCard = ({ resource }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group bg-white rounded-3xl border border-border p-6 shadow-card hover:shadow-card-hover transition-all duration-300"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${resource.type === "quiz" ? "bg-amber-50 text-amber-600" :
                    resource.type === "test" ? "bg-rose-50 text-rose-600" :
                        "bg-blue-50 text-blue-600"
                }`}>
                {resource.type === "quiz" ? <BrainCircuit size={24} /> :
                    resource.type === "test" ? <FileText size={24} /> :
                        <BookOpen size={24} />}
            </div>
            <div className="flex gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-surface-page text-text-muted">
                    {resource.difficulty}
                </span>
            </div>
        </div>

        <h3 className="text-lg font-extrabold text-text-title group-hover:text-brand-blue transition-colors mb-2">
            {resource.title}
        </h3>
        <p className="text-sm text-text-body line-clamp-2 mb-6">
            {resource.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
                <Clock size={14} />
                {new Date(resource.createdAt).toLocaleDateString()}
            </div>
            <button className="flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:underline">
                Access Now
                <ExternalLink size={14} />
            </button>
        </div>
    </motion.div>
);

const ResourcesPage = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const [type, setType] = useState("");

    useEffect(() => {
        const fetchResources = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await api.get("/content", { params: { search, type } });
                setResources(res.data.content || []);
                setTotal(res.data.pagination?.total ?? (res.data.content?.length || 0));
            } catch (err) {
                console.error("Failed to fetch resources", err);
                setError(err?.message || "Failed to load resources");
                setResources([]);
                setTotal(0);
            } finally {
                setLoading(false);
            }
        };
        const timer = setTimeout(fetchResources, 400);
        return () => clearTimeout(timer);
    }, [search, type]);

    return (
        <div className="max-w-7xl mx-auto pb-20">
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-text-title tracking-tight sm:text-4xl">
                    Resource Hub
                </h1>
                <p className="mt-2 text-text-body">
                    Explore study materials, practice tests, and AI-curated quizzes provided by admins.
                </p>
            </div>

            {/* Lightweight diagnostics: live API data summary */}
            <div className="mb-6">
                <div className="inline-flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-white/70 px-4 py-2 text-xs font-semibold text-text-muted shadow-card">
                    <span className="uppercase tracking-wide text-[10px] font-black text-text-title">
                        Resource Hub Diagnostics
                    </span>
                    <span className="h-3 w-px bg-border" />
                    <span>
                        Results: <span className="font-bold text-text-title">{loading ? "…" : total}</span>
                    </span>
                    <span className="h-3 w-px bg-border" />
                    <span>
                        Type filter:{" "}
                        <span className="font-mono text-[11px] text-text-title">
                            {type || "ALL"}
                        </span>
                    </span>
                    <span className="h-3 w-px bg-border" />
                    <span>
                        Search:{" "}
                        <span className="font-mono text-[11px] text-text-title">
                            {search || "—"}
                        </span>
                    </span>
                    {error && (
                        <>
                            <span className="h-3 w-px bg-border" />
                            <span className="text-status-error">
                                Error: {error}
                            </span>
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand-blue transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-border bg-white/80 backdrop-blur-sm outline-none focus:border-brand-blue/50 focus:ring-4 focus:ring-brand-blue/5 transition-all"
                    />
                </div>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="px-6 py-3.5 rounded-2xl border border-border bg-white/80 font-bold text-text-title outline-none"
                >
                    <option value="">All Content</option>
                    <option value="study-material">Materials</option>
                    <option value="test">Tests</option>
                    <option value="quiz">Quizzes</option>
                </select>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-64 rounded-3xl bg-white/50 border border-border animate-pulse" />
                    ))}
                </div>
            ) : resources.length === 0 ? (
                <div className="py-24 text-center bg-white/50 rounded-3xl border border-border border-dashed">
                    <Layers className="mx-auto text-text-muted/30 mb-4" size={48} />
                    <p className="text-lg font-bold text-text-title">No resources found</p>
                    <p className="text-text-muted text-sm mt-1">Check back later for new materials.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map(item => <ResourceCard key={item._id} resource={item} />)}
                </div>
            )}
        </div>
    );
};

export default ResourcesPage;
