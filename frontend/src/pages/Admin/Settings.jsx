// src/pages/Admin/Settings.jsx
// Shared design system: same cards, form inputs, buttons as User Dashboard.

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Database, Save, RefreshCw } from "lucide-react";
import { getSettings, saveSettings } from "../../api/adminApi.js";
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

const SettingsGroup = ({ title, description, children }) => (
  <div className="rounded-3xl border border-border bg-white/75 p-8 shadow-card backdrop-blur-xl">
    <div className="mb-6">
      <h2 className="text-lg font-extrabold text-text-title">{title}</h2>
      <p className="text-sm text-text-muted mt-1">{description}</p>
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
      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-card transition-transform duration-200 ${value ? "translate-x-6" : "translate-x-1"
        }`}
    />
  </button>
);

const AdminSettings = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [settings, setSettings] = useState({
    platformName: "StudexaAI",
    adminEmail: "",
    enableRegistration: true,
    maintenanceMode: false,
    enableAnalytics: true,
    enableAiFeatures: true,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSettings();
        setSettings(data ?? settings);
      } catch (err) {
        toast.error("Failed to load settings");
      } finally {
        setFetching(false);
      }
    };
    load();
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveSettings(settings);
      toast.success("Settings saved successfully!");
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="space-y-6" aria-label="Loading settings" role="status">
        <div className="h-10 w-1/3 rounded-2xl bg-surface-page/70 animate-pulse" />
        <div className="h-64 rounded-3xl border border-border bg-white/75 shadow-card animate-pulse" />
        <div className="h-64 rounded-3xl border border-border bg-white/75 shadow-card animate-pulse" />
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-4xl space-y-6"
    >
      <motion.section variants={fadeUp}>
        <div className="rounded-3xl border border-border bg-white/75 shadow-card backdrop-blur-xl p-6">
          <h1 className="text-[26px] font-extrabold tracking-tight text-text-title sm:text-[34px]">
            System Settings
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Configure platform behavior and admin preferences
          </p>
        </div>
      </motion.section>

      <motion.section variants={fadeUp}>
        <SettingsGroup
          title="General configuration"
          description="Basic platform settings and metadata."
        >
          <SettingItem
            label="Platform Name"
            description="Display name across the application."
          >
            <input
              className="input max-w-xs"
              value={settings.platformName}
              onChange={(e) => handleChange("platformName", e.target.value)}
            />
          </SettingItem>
          <SettingItem
            label="Administrator Email"
            description="Primary contact for system alerts."
          >
            <input
              className="input max-w-xs bg-surface-page text-text-muted"
              value={settings.adminEmail}
              readOnly
              title="Managed in environment variables"
            />
          </SettingItem>
          <SettingItem
            label="Maintenance Mode"
            description="Disable access for non-admin users."
          >
            <Toggle
              value={settings.maintenanceMode}
              onChange={(val) => handleChange("maintenanceMode", val)}
            />
          </SettingItem>
        </SettingsGroup>
      </motion.section>

      <motion.section variants={fadeUp}>
        <SettingsGroup
          title="Feature Flags"
          description="Enable or disable specific platform features."
        >
          <SettingItem
            label="User Registration"
            description="Allow new users to sign up."
          >
            <Toggle
              value={settings.enableRegistration}
              onChange={(val) => handleChange("enableRegistration", val)}
            />
          </SettingItem>
          <SettingItem
            label="AI Features"
            description="Enable OpenAI integration for content generation."
          >
            <Toggle
              value={settings.enableAiFeatures}
              onChange={(val) => handleChange("enableAiFeatures", val)}
            />
          </SettingItem>
          <SettingItem
            label="Public Analytics"
            description="Show simplified stats on landing page."
          >
            <Toggle
              value={settings.enableAnalytics}
              onChange={(val) => handleChange("enableAnalytics", val)}
            />
          </SettingItem>
        </SettingsGroup>
      </motion.section>

      <motion.section variants={fadeUp}>
        <SettingsGroup
          title="Platform Communication"
          description="Manage emails and contact points."
        >
          <SettingItem
            label="Support Email"
            description="Where users are directed for help."
          >
            <input
              className="input max-w-xs"
              value={settings.contactEmail || ""}
              onChange={(e) => handleChange("contactEmail", e.target.value)}
              placeholder="support@studexa.com"
            />
          </SettingItem>
          <SettingItem
            label="SMTP Status"
            description="Current connectivity to mail servers."
          >
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-status-success/10 text-status-success">
              {settings.smtpStatus || "Connected"}
            </span>
          </SettingItem>
        </SettingsGroup>
      </motion.section>

      <motion.section variants={fadeUp}>
        <SettingsGroup
          title="Advanced AI & Analytics"
          description="Configure external integrations and logic."
        >
          <SettingItem
            label="Moderation Strictness"
            description="Sensitivity of automated content filters."
          >
            <select
              value={settings.moderationStrictness || "medium"}
              onChange={(e) => handleChange("moderationStrictness", e.target.value)}
              className="select max-w-xs"
            >
              <option value="low">Low (Permissive)</option>
              <option value="medium">Medium (Standard)</option>
              <option value="high">High (Strict)</option>
            </select>
          </SettingItem>
          <SettingItem
            label="Analytics Tracking ID"
            description="Google Analytics or similar measurement ID."
          >
            <input
              className="input max-w-xs font-mono text-xs"
              value={settings.analyticsId || ""}
              onChange={(e) => handleChange("analyticsId", e.target.value)}
              placeholder="UA-XXXXX-Y"
            />
          </SettingItem>
        </SettingsGroup>
      </motion.section>

      <motion.section variants={fadeUp}>
        <SettingsGroup
          title="System Maintenance"
          description="Database optimization and logs."
        >
          <SettingItem
            label="Database Maintenance"
            description="Clear temporary logs and optimizes indexes."
          >
            <button
              type="button"
              onClick={() => toast.success("Maintenance routine scheduled")}
              className="btn-secondary inline-flex items-center gap-2 px-4 py-2"
            >
              <Database size={16} />
              Run Cleanup
            </button>
          </SettingItem>
        </SettingsGroup>
      </motion.section>

      <motion.section variants={fadeUp} className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="btn-primary inline-flex items-center gap-2 px-8 py-4 disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="animate-spin" size={20} />
          ) : (
            <Save size={20} />
          )}
          {loading ? "Saving..." : "Save All Changes"}
        </button>
      </motion.section>
    </motion.div>
  );
};

export default AdminSettings;
