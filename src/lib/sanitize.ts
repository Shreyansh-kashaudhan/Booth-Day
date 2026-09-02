const NAME_MAX = 20;

export function sanitizeDisplayName(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const cleaned = raw.replace(/[<>]/g, "").replace(/\s+/g, " ").trim();
  if (cleaned.length < 1 || cleaned.length > NAME_MAX) return null;
  return cleaned;
}

export function normalizeAnswer(value: string): string {
  return value
    .normalize("NFKC")
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^A-Z0-9]/g, "");
}
