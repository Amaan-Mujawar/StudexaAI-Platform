// src/pages/Admin/Tickets.jsx
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Ticket,
    Filter,
    RefreshCw,
    X,
    CheckCircle2,
    Clock,
    AlertCircle,
    ChevronRight,
    User,
    Mail,
    Calendar,
    MessageSquare,
    Save,
    UserPlus,
    UserMinus,
    Loader2,
    Bug,
    Lightbulb,
    HelpCircle,
    Trash2,
    Search,
} from "lucide-react";
import { getAllTickets, updateTicket } from "../../api/adminApi.js";
import toast from "react-hot-toast";

/* ─── Helpers ──────────────────────────────────────────── */
const STATUSES = [
    { id: "", label: "All Tickets" },
    { id: "open", label: "Open" },
    { id: "in_progress", label: "In Progress" },
    { id: "resolved", label: "Resolved" },
];

const SUBJECT_META = {
    suggestion: { label: "Suggestion", icon: Lightbulb, color: "text-amber-600 bg-amber-50 border-amber-200" },
    bug: { label: "Bug Report", icon: Bug, color: "text-red-600 bg-red-50 border-red-200" },
    support: { label: "Support", icon: HelpCircle, color: "text-blue-600 bg-blue-50 border-blue-200" },
    privacy: { label: "Data Request", icon: Trash2, color: "text-purple-600 bg-purple-50 border-purple-200" },
};

const STATUS_META = {
    open: { label: "Open", icon: AlertCircle, color: "text-orange-700 bg-orange-50 border-orange-200" },
    in_progress: { label: "In Progress", icon: Clock, color: "text-blue-700 bg-blue-50 border-blue-200" },
    resolved: { label: "Resolved", icon: CheckCircle2, color: "text-green-700 bg-green-50 border-green-200" },
};

const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const formatDateTime = (d) =>
    d ? new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

/* ─── Badge ─────────────────────────────────────────────── */
const Badge = ({ meta }) => {
    if (!meta) return null;
    const Icon = meta.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${meta.color}`}>
            <Icon className="h-3 w-3" />
            {meta.label}
        </span>
    );
};

/* ─── Detail Slide-over ─────────────────────────────────── */
const TicketDetail = ({ ticket, onClose, onSave }) => {
    const [status, setStatus] = useState(ticket.status);
    const [note, setNote] = useState(ticket.resolutionNote || "");
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave(ticket._id, { status, resolutionNote: note });
            onClose();
        } finally {
            setSaving(false);
        }
    };

    const subjectMeta = SUBJECT_META[ticket.subject] || SUBJECT_META.support;
    const statusMeta = STATUS_META[status] || STATUS_META.open;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-end"
            style={{ backdropFilter: "blur(4px)", background: "rgba(15,23,42,0.35)" }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl"
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white/95 px-6 py-4 backdrop-blur-xl">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted">Ticket Detail</p>
                        <h2 className="mt-0.5 text-lg font-extrabold text-text-title">{ticket.ticketNumber}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface-page transition hover:bg-red-50 hover:text-red-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex flex-1 flex-col gap-6 p-6">
                    {/* Meta info */}
                    <div className="rounded-2xl border border-border bg-surface-page p-5 space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge meta={subjectMeta} />
                            <Badge meta={{ ...STATUS_META[ticket.status], label: STATUS_META[ticket.status]?.label }} />
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <User className="h-4 w-4 text-text-muted mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold text-text-muted">Submitted by</p>
                                    <p className="text-sm font-bold text-text-title">{ticket.name}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Mail className="h-4 w-4 text-text-muted mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold text-text-muted">Email</p>
                                    <p className="text-sm font-bold text-text-title break-all">{ticket.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar className="h-4 w-4 text-text-muted mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold text-text-muted">Submitted</p>
                                    <p className="text-sm font-semibold text-text-body">{formatDateTime(ticket.createdAt)}</p>
                                </div>
                            </div>
                            {ticket.resolvedAt && (
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs font-semibold text-text-muted">Resolved</p>
                                        <p className="text-sm font-semibold text-text-body">{formatDateTime(ticket.resolvedAt)}</p>
                                    </div>
                                </div>
                            )}
                            {ticket.assignedTo && (
                                <div className="flex items-start gap-3 sm:col-span-2">
                                    <UserPlus className="h-4 w-4 text-brand-blue mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs font-semibold text-text-muted">Assigned to</p>
                                        <p className="text-sm font-semibold text-text-title">{ticket.assignedTo}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Message */}
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-text-muted" />
                            <p className="text-xs font-bold uppercase tracking-widest text-text-muted">User's Message</p>
                        </div>
                        <div className="rounded-2xl border border-border bg-surface-page px-5 py-4">
                            <p className="text-sm leading-relaxed text-text-body whitespace-pre-wrap">{ticket.message}</p>
                        </div>
                    </div>

                    {/* Assignment */}
                    <div className="rounded-2xl border border-border bg-surface-page p-5 space-y-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-text-muted">Assignment</p>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => onSave(ticket._id, { assignedTo: "me" })}
                                className="btn-secondary inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold"
                            >
                                <UserPlus className="h-3.5 w-3.5" />
                                Assign to me
                            </button>
                            {ticket.assignedTo && (
                                <button
                                    type="button"
                                    onClick={() => onSave(ticket._id, { assignedTo: "" })}
                                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-xs font-semibold text-text-muted hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                >
                                    <UserMinus className="h-3.5 w-3.5" />
                                    Unassign
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Admin Controls */}
                    <div className="rounded-2xl border border-brand-blue/20 bg-brand-blue/3 p-5 space-y-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-brand-blue">Admin Actions</p>

                        {/* Status selector */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-title">Update Status</label>
                            <div className="flex flex-wrap gap-2">
                                {STATUSES.filter(s => s.id).map((s) => (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => setStatus(s.id)}
                                        className={`rounded-full border px-4 py-1.5 text-xs font-bold transition ${status === s.id
                                                ? STATUS_META[s.id]?.color + " shadow-sm"
                                                : "border-border bg-white text-text-muted hover:border-brand-blue/30"
                                            }`}
                                    >
                                        {STATUS_META[s.id]?.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Resolution note */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-title">
                                Resolution Note
                                {status === "resolved" && <span className="ml-1.5 text-xs text-text-muted font-normal">(Sent to user via email)</span>}
                            </label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                rows={4}
                                placeholder="Describe what was done to resolve this issue..."
                                className="input w-full resize-none py-3 text-sm"
                            />
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="btn-primary inline-flex w-full items-center justify-center gap-2 py-3 text-sm font-bold disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {saving
                                ? "Saving..."
                                : status === "resolved"
                                    ? "Resolve & Notify User via Email"
                                    : "Save Changes"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

/* ─── Main Page ─────────────────────────────────────────── */
const easePremium = [0.2, 0.8, 0.2, 1];
const fadeUp = {
    hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: easePremium } },
};
const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.02 } },
};

const AdminTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [counts, setCounts] = useState({ open: 0, in_progress: 0, resolved: 0 });
    const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("");
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(null);

    const load = useCallback(async (filter = activeFilter, page = 1) => {
        setLoading(true);
        try {
            const data = await getAllTickets({ status: filter, page, limit: 15 });
            setTickets(data.tickets || []);
            setCounts(data.counts || { open: 0, in_progress: 0, resolved: 0 });
            setPagination(data.pagination || { total: 0, page: 1, pages: 1 });
        } catch (err) {
            toast.error("Failed to load tickets");
        } finally {
            setLoading(false);
        }
    }, [activeFilter]);

    useEffect(() => { load(); }, []);

    const handleFilterChange = (f) => {
        setActiveFilter(f);
        load(f, 1);
    };

    const handleUpdate = async (id, updates) => {
        try {
            const updated = await updateTicket(id, updates);
            toast.success(
                updates.status === "resolved"
                    ? "✓ Ticket resolved — notification email sent to user"
                    : "Ticket updated successfully"
            );
            load(activeFilter, pagination.page);
            if (selected?._id === id && updated?.ticket) {
                setSelected(updated.ticket);
            }
        } catch (err) {
            toast.error(err?.message || "Failed to update ticket");
            throw err;
        }
    };

    const filteredTickets = search.trim()
        ? tickets.filter(t =>
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.email.toLowerCase().includes(search.toLowerCase()) ||
            t.ticketNumber?.toLowerCase().includes(search.toLowerCase()) ||
            t.message.toLowerCase().includes(search.toLowerCase())
        )
        : tickets;

    return (
        <>
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-6"
            >
                {/* Header */}
                <motion.section variants={fadeUp}>
                    <div className="relative overflow-hidden rounded-3xl border border-border bg-white/75 shadow-card backdrop-blur-xl">
                        <div className="pointer-events-none absolute inset-0 bg-brand-blue/3" />
                        <div className="relative p-6 sm:p-8">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-3 py-1.5 text-xs font-semibold text-text-muted shadow-card">
                                        <Ticket className="h-4 w-4 text-brand-blue" />
                                        Support Tickets
                                    </div>
                                    <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-text-title sm:text-3xl">
                                        Ticket Management
                                    </h1>
                                    <p className="mt-1 text-sm text-text-muted">
                                        Review, manage, and resolve user support requests.
                                    </p>
                                </div>

                                {/* Counts */}
                                <div className="flex flex-wrap gap-3">
                                    <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-2 text-center">
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-orange-600">Open</p>
                                        <p className="text-xl font-extrabold text-orange-700 tabular-nums">{counts.open}</p>
                                    </div>
                                    <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-center">
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">In Progress</p>
                                        <p className="text-xl font-extrabold text-blue-700 tabular-nums">{counts.in_progress}</p>
                                    </div>
                                    <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-2 text-center">
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-green-600">Resolved</p>
                                        <p className="text-xl font-extrabold text-green-700 tabular-nums">{counts.resolved}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Filter + Search */}
                <motion.section variants={fadeUp}>
                    <div className="rounded-3xl border border-border bg-white/75 p-5 shadow-card backdrop-blur-xl">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            {/* Filter tabs */}
                            <div className="flex flex-wrap gap-2">
                                {STATUSES.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => handleFilterChange(s.id)}
                                        className={`rounded-full border px-4 py-2 text-xs font-bold transition ${activeFilter === s.id
                                                ? "border-brand-blue/40 bg-brand-blue/8 text-brand-blue"
                                                : "border-border bg-white text-text-muted hover:border-brand-blue/20 hover:text-text-title"
                                            }`}
                                    >
                                        <span className="flex items-center gap-1.5">
                                            <Filter className="h-3 w-3" />
                                            {s.label}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Search + Refresh */}
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search tickets..."
                                        className="input pl-9 py-2 text-sm w-52"
                                    />
                                </div>
                                <button
                                    onClick={() => load(activeFilter, pagination.page)}
                                    className="btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm"
                                    disabled={loading}
                                >
                                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Ticket List */}
                <motion.section variants={fadeUp}>
                    <div className="rounded-3xl border border-border bg-white/75 shadow-card backdrop-blur-xl overflow-hidden">
                        {loading ? (
                            <div className="flex flex-col gap-3 p-6">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-16 w-full animate-pulse rounded-2xl bg-surface-page" />
                                ))}
                            </div>
                        ) : filteredTickets.length === 0 ? (
                            <div className="py-16 text-center">
                                <Ticket className="mx-auto h-10 w-10 text-text-muted/30 mb-3" />
                                <p className="text-sm font-semibold text-text-muted">No tickets found</p>
                                <p className="text-xs text-text-muted/60 mt-1">
                                    {activeFilter ? `No ${activeFilter.replace("_", " ")} tickets yet.` : "No tickets have been submitted yet."}
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {filteredTickets.map((ticket) => {
                                    const subjectMeta = SUBJECT_META[ticket.subject] || SUBJECT_META.support;
                                    const statusMeta = STATUS_META[ticket.status] || STATUS_META.open;
                                    const SubjectIcon = subjectMeta.icon;

                                    return (
                                        <button
                                            key={ticket._id}
                                            type="button"
                                            onClick={() => setSelected(ticket)}
                                            className="group w-full flex items-center gap-4 px-6 py-4 text-left transition hover:bg-brand-blue/3"
                                        >
                                            {/* Icon */}
                                            <div className={`shrink-0 grid h-10 w-10 place-items-center rounded-xl border ${subjectMeta.color}`}>
                                                <SubjectIcon className="h-4 w-4" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <span className="text-xs font-bold text-text-muted">{ticket.ticketNumber}</span>
                                                    <Badge meta={subjectMeta} />
                                                    <Badge meta={statusMeta} />
                                                </div>
                                                <p className="text-sm font-bold text-text-title truncate">{ticket.name}</p>
                                                <p className="text-xs text-text-muted truncate">{ticket.email} · {formatDate(ticket.createdAt)}</p>
                                            </div>

                                            {/* Arrow */}
                                            <ChevronRight className="h-4 w-4 text-text-muted opacity-0 transition group-hover:opacity-100" />
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && pagination.pages > 1 && (
                            <div className="flex items-center justify-between border-t border-border px-6 py-4">
                                <p className="text-xs font-semibold text-text-muted">
                                    Page {pagination.page} of {pagination.pages} · {pagination.total} total
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        disabled={pagination.page <= 1}
                                        onClick={() => load(activeFilter, pagination.page - 1)}
                                        className="btn-secondary px-4 py-2 text-xs disabled:opacity-40"
                                    >
                                        Prev
                                    </button>
                                    <button
                                        disabled={pagination.page >= pagination.pages}
                                        onClick={() => load(activeFilter, pagination.page + 1)}
                                        className="btn-secondary px-4 py-2 text-xs disabled:opacity-40"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.section>
            </motion.div>

            {/* Detail Slide-over */}
            <AnimatePresence>
                {selected && (
                    <TicketDetail
                        ticket={selected}
                        onClose={() => setSelected(null)}
                        onSave={handleUpdate}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default AdminTickets;
