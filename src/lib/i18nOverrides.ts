// src/lib/i18nOverrides.ts

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonValue[];

export type JsonObject = { [key: string]: JsonValue };

export function flattenMessages(
  obj: JsonObject,
  prefix = ""
): Record<string, string> {
  const out: Record<string, string> = {};

  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;

    if (v && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(out, flattenMessages(v as JsonObject, path));
      continue;
    }

    if (typeof v === "string") {
      out[path] = v;
    }
  }

  return out;
}

export function setDeep(obj: JsonObject, path: string, value: string) {
  const parts = path.split(".");
  let cur: JsonObject = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    const next = cur[p];

    if (!next || typeof next !== "object" || Array.isArray(next)) {
      cur[p] = {};
    }

    cur = cur[p] as JsonObject;
  }

  cur[parts[parts.length - 1]] = value;
}

export function applyOverrides(
  base: JsonObject,
  overrides: Record<string, string>
): JsonObject {
  const next = structuredClone(base);
  for (const [key, value] of Object.entries(overrides)) {
    setDeep(next, key, value);
  }
  return next;
}
