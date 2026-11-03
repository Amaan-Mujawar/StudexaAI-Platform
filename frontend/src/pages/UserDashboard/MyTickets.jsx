// src/pages/UserDashboard/MyTickets.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Ticket,
    AlertCircle,
    Clock,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Bug,
    Lightbulb,
    HelpCircle,
    Trash2,
    MessageSquare,
    RefreshCw,
    Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getMyTickets } from "../../api/ticketsApi.js";
import toast from "react-hot-toast";

/* ─── Helpers ──────────────────────────────────────────── */
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

/* ─── Ticket Card ───────────────────────────────────────── */
const TicketCard = ({ ticket }) => {
    const [expanded, setExpanded] = useState(false);
    const subjectMeta = SUBJECT_META[ticket.subject] || SUBJECT_META.support;
    const statusMeta = STATUS_META[ticket.status] || STATUS_META.open;
    const SubjectIcon = subjectMeta.icon;

    return (
        <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden transition hover:shadow-card-hover">
            {/* Top row */}
            <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left"
            >
                <div className={`shrink-0 grid h-10 w-10 place-items-center rounded-xl border ${subjectMeta.color}`}>
                    <SubjectIcon className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-text-muted">{ticket.ticketNumber}</span>
                        <Badge meta={subjectMeta} />
                        <Badge meta={statusMeta} />
                    </div>
                    <p className="text-xs text-text-muted">Submitted {formatDate(ticket.createdAt)}</p>
                </div>

                {expanded ? (
                    <ChevronUp className="h-4 w-4 text-text-muted shrink-0" />
                ) : (
                    <ChevronDown className="h-4 w-4 text-text-muted shrink-0" />
                )}
            </button>

            {/* Expanded content */}
            {expanded && (
                <div className="border-t border-border px-5 pt-4 pb-5 space-y-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2">
                            Your Message
                        </p>
                        <div className="rounded-xl bg-surface-page border border-border px-4 py-3">
                            <p className="text-sm leading-relaxed text-text-body whitespace-pre-wrap">
                                {ticket.message}
                            </p>
                        </div>
                    </div>

                    {ticket.status === "resolved" && ticket.resolutionNote && (
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2">
                                ✓ Resolution from StudexaAI Team
                            </p>
                            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                                <p className="text-sm leading-relaxed text-green-800 whitespace-pre-wrap">
                                    {ticket.resolutionNote}
                                </p>
                            </div>
                            {ticket.resolvedAt && (
                                <p className="mt-2 text-[11px] font-semibold text-text-muted">
                                    Resolved on {formatDate(ticket.resolvedAt)}
                                </p>
                            )}
                        </div>
                    )}

                    {ticket.status !== "resolved" && (
                        <div className="rounded-xl border border-brand-blue/20 bg-brand-blue/3 px-4 py-3">
                            <p className="text-xs font-semibold text-brand-blue">
                                {ticket.status === "in_progress"
                                    ? "⚡ Our team is currently working on your ticket. We'll email you once resolved."
                                    : "🕑 Your ticket is in the queue. We'll review it and get back to you via email."}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

/* ─── Main Page ─────────────────────────────────────────── */
const easePremium = [0.2, 0.8, 0.2, 1];
const fadeUp = {
    hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: easePremium } },
};
const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.02 } },
};

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const data = await getMyTickets();
            setTickets(data.tickets || []);
        } catch (err) {
            toast.error("Failed to load your tickets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            {/* Header */}
            <motion.section variants={fadeUp}>
                <div className="relative overflow-hidden rounded-3xl border border-border bg-white/75 shadow-card backdrop-blur-xl">
                    <div className="pointer-events-none absolute inset-0 bg-brand-blue/3" />
                    <div className="relative p-6 sm:p-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-3 py-1.5 text-xs font-semibold text-text-muted shadow-card">
                                    <Ticket className="h-4 w-4 text-brand-blue" />
                                    Support
                                </div>
                                <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-text-title sm:text-3xl">
                                    My Tickets
                                </h1>
                                <p className="mt-1 text-sm text-text-muted">
                                    Track the status of your submitted support requests.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={load}
                                    className="btn-secondary inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Refresh
                                </button>
                                <Link
                                    to="/dashboard/tickets/new"
                                    className="btn-primary inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold"
                                >
                                    <Plus className="h-4 w-4" />
                                    New Ticket
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Tickets list */}
            <motion.section variants={fadeUp}>
                {loading ? (
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-20 w-full animate-pulse rounded-2xl bg-white border border-border" />
                        ))}
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="rounded-3xl border border-border bg-white/75 p-12 text-center shadow-card backdrop-blur-xl">
                        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-border bg-surface-page">
                            <MessageSquare className="h-6 w-6 text-text-muted" />
                        </div>
                        <p className="text-lg font-extrabold text-text-title">No tickets yet</p>
                        <p className="mt-2 text-sm text-text-muted max-w-xs mx-auto">
                            Click "Submit a Ticket" below to create your first support request.
                        </p>
                        <Link
                            to="/dashboard/tickets/new"
                            className="btn-primary mt-6 inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold"
                        >
                            <Plus className="h-4 w-4" />
                            Submit a Ticket
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {tickets.map((ticket) => (
                            <TicketCard key={ticket._id} ticket={ticket} />
                        ))}
                    </div>
                )}
            </motion.section>
        </motion.div>
    );
};

export default MyTickets;
