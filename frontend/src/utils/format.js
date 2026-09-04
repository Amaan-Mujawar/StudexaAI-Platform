// src/utils/format.js

export const clamp = (n, min = 0, max = 100) => {
  const num = Number(n);
  if (!Number.isFinite(num)) return min;
  return Math.min(max, Math.max(min, num));
};

export const formatNumber = (n) => {
  const num = Number(n);
  if (!Number.isFinite(num)) return "0";
  return new Intl.NumberFormat(undefined).format(num);
};

export const formatCompactNumber = (n) => {
  const num = Number(n);
  if (!Number.isFinite(num)) return "0";
  return new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
};

export const formatPercent = (n, decimals = 0) => {
  const num = Number(n);
  if (!Number.isFinite(num)) return "0%";
  return `${num.toFixed(decimals)}%`;
};

export const formatCooldownMMSS = (seconds) => {
  const s = Math.max(0, Number(seconds) || 0);
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

export const safeDivide = (a, b, fallback = 0) => {
  const numA = Number(a);
  const numB = Number(b);
  if (!Number.isFinite(numA) || !Number.isFinite(numB) || numB === 0)
    return fallback;
  return numA / numB;
};

export const getInitials = (nameOrEmail = "") => {
  const s = String(nameOrEmail || "").trim();
  if (!s) return "U";

  const parts = s
    .replace(/[@.]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const a = (parts[0]?.[0] || "U").toUpperCase();
  const b = (parts[1]?.[0] || "").toUpperCase();

  return (a + b).slice(0, 2);
};

export default {
  clamp,
  formatNumber,
  formatCompactNumber,
  formatPercent,
  formatCooldownMMSS,
  safeDivide,
  getInitials,
};
