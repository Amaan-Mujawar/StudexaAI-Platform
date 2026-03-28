// src/utils/cx.js

const isString = (v) => typeof v === "string";
const isNumber = (v) => typeof v === "number" && Number.isFinite(v);
const isArray = Array.isArray;

const flatten = (input, out) => {
  if (!input) return;

  if (isString(input)) {
    const v = input.trim();
    if (v) out.push(v);
    return;
  }

  if (isNumber(input)) {
    out.push(String(input));
    return;
  }

  if (isArray(input)) {
    for (const item of input) flatten(item, out);
    return;
  }

  if (typeof input === "object") {
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key) && input[key]) {
        const v = key.trim();
        if (v) out.push(v);
      }
    }
  }
};

/**
 * cx(...)
 * - Handles strings, arrays, objects, nested conditions safely.
 * - Similar to clsx/classnames but without dependencies.
 */
export const cx = (...args) => {
  const out = [];
  for (const arg of args) flatten(arg, out);
  return out.join(" ");
};

export default cx;
