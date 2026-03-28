// src/pages/UserDashboard/UserSettings.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Shield, Bell, Smartphone, Save, RefreshCw, Eye, EyeOff } from "lucide-react";
import { getUserSettings, updateUserSettings } from "../../api/userApi.js";
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

const SettingsGroup = ({ icon: Icon, title, description, children }) => (
    <div className="rounded-3xl border border-border bg-white/75 p-8 shadow-card backdrop-blur-xl">
        <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-brand-blue/5 border border-brand-blue/10 flex items-center justify-center text-brand-blue">
                <Icon size={24} />
            </div>
            <div>
                <h2 className="text-xl font-extrabold text-text-title">{title}</h2>
                <p className="text-sm text-text-muted">{description}</p>
            </div>
        </div>
        <div className="space-y-6">{children}</div>
    </div>
);

const SettingItem = ({ label, description, children }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-border last:border-0">
        <div className="flex-1">
            <p className="font-semibold text-text-title">{label}</p>
            <p className="text-sm text-text-muted">{description}</p>
        </div>
        <div className="w-full sm:w-auto">{children}</div>
    </div>
);

const Toggle = ({ value, onChange }) => (
    <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`h-6 w-11 rounded-full relative cursor-pointer transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/20 ${value ? "bg-brand-blue" : "bg-surface-page"
            }`}
    >
        <span
            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-center transition-transform duration-200 ${value ? "translate-x-6" : "translate-x-1"
                }`}
        />
    </button>
);

const UserSettings = () => {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        bio: "",
        phoneNumber: "",
        preferences: {
            notifications: { email: true, push: true, marketing: false },
            privacy: { showProfile: true, showActivity: true },
            theme: "system"
        }
    });

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getUserSettings();
                setProfile(data);
            } catch (err) {
                toast.error("Failed to load profile data");
            } finally {
                setFetching(false);
            }
        };
        load();
    }, []);

    const handleUpdate = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const data = await updateUserSettings(profile);
            setProfile(data);
            toast.success("Settings updated successfully!");
        } catch (err) {
            toast.error("Failed to update settings");
        } finally {
            setLoading(false);
        }
    };

    const updatePreference = (category, key, value) => {
        setProfile(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [category]: {
                    ...prev.preferences[category],
                    [key]: value
                }
            }
        }));
    };

    if (fetching) {
        return (
            <div className="max-w-4xl space-y-6">
                <div className="h-24 w-full rounded-3xl bg-surface-page animate-pulse" />
                <div className="h-64 w-full rounded-3xl bg-surface-page animate-pulse" />
            </div>
        );
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-4xl mx-auto space-y-8 pb-20"
        >
            <motion.header variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-text-title tracking-tight sm:text-4xl">
                        Account Settings
                    </h1>
                    <p className="mt-2 text-text-muted">
                        Manage your personal information and preferences
                    </p>
                </div>
                <button
                    onClick={() => handleUpdate()}
                    disabled={loading}
                    className="btn-primary inline-flex items-center gap-2 px-8 py-4 shadow-card hover:shadow-card-hover disabled:opacity-50"
                >
                    {loading ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </motion.header>

            <div className="grid grid-cols-1 gap-8">
                {/* Profile Section */}
                <motion.section variants={fadeUp}>
                    <SettingsGroup
                        icon={User}
                        title="Public Profile"
                        description="Informations that identify you across the platform."
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-muted pl-1">Full Name</label>
                                <input
                                    className="input"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    placeholder="Your visual name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-muted pl-1">Email Address</label>
                                <input
                                    className="input bg-surface-page/50 text-text-muted cursor-not-allowed"
                                    value={profile.email}
                                    readOnly
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="space-y-2 mt-4">
                            <label className="text-sm font-semibold text-text-muted pl-1">Bio / About Me</label>
                            <textarea
                                className="input min-h-[100px] py-3 resize-none"
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                placeholder="Tell us a little about yourself..."
                            />
                        </div>
                        <div className="space-y-2 mt-4">
                            <label className="text-sm font-semibold text-text-muted pl-1">Phone Number</label>
                            <div className="relative">
                                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                                <input
                                    className="input pl-12"
                                    value={profile.phoneNumber}
                                    onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>
                    </SettingsGroup>
                </motion.section>

                {/* Notifications */}
                <motion.section variants={fadeUp}>
                    <SettingsGroup
                        icon={Bell}
                        title="Notifications"
                        description="Control how and when you receive updates."
                    >
                        <SettingItem
                            label="Email Notifications"
                            description="Get activity updates in your inbox."
                        >
                            <Toggle
                                value={profile.preferences?.notifications?.email}
                                onChange={(v) => updatePreference('notifications', 'email', v)}
                            />
                        </SettingItem>
                        <SettingItem
                            label="Push Notifications"
                            description="Real-time alerts in your browser/device."
                        >
                            <Toggle
                                value={profile.preferences?.notifications?.push}
                                onChange={(v) => updatePreference('notifications', 'push', v)}
                            />
                        </SettingItem>
                        <SettingItem
                            label="Marketing Updates"
                            description="Occasional news and special offers."
                        >
                            <Toggle
                                value={profile.preferences?.notifications?.marketing}
                                onChange={(v) => updatePreference('notifications', 'marketing', v)}
                            />
                        </SettingItem>
                    </SettingsGroup>
                </motion.section>

                {/* Privacy & Appearance */}
                <motion.section variants={fadeUp}>
                    <SettingsGroup
                        icon={Shield}
                        title="Privacy & Experience"
                        description="Manage your visibility and data settings."
                    >
                        <SettingItem
                            label="Public Profile Visibility"
                            description="Allow others to find and view your bio."
                        >
                            <Toggle
                                value={profile.preferences?.privacy?.showProfile}
                                onChange={(v) => updatePreference('privacy', 'showProfile', v)}
                            />
                        </SettingItem>
                        <SettingItem
                            label="Display Theme"
                            description="Choose your preferred interface look."
                        >
                            <select
                                className="select"
                                value={profile.preferences?.theme}
                                onChange={(e) => setProfile({ ...profile, preferences: { ...profile.preferences, theme: e.target.value } })}
                            >
                                <option value="light">Light Mode</option>
                                <option value="dark">Dark Mode</option>
                                <option value="system">System Default</option>
                            </select>
                        </SettingItem>
                    </SettingsGroup>
                </motion.section>
            </div>

            <motion.div variants={fadeUp} className="pt-6 border-t border-border flex justify-between items-center text-xs text-text-muted font-semibold uppercase tracking-widest">
                <span>Last updated: {profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : "Never"}</span>
                <div className="flex gap-4">
                    <button className="hover:text-status-error transition">Delete Account</button>
                    <span className="opacity-30">|</span>
                    <button className="hover:text-brand-blue transition">Terms of Service</button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default UserSettings;
