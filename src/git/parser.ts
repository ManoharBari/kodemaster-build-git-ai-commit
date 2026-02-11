import { FileChange } from "../types";

// ─── Noise list ──────────────────────────────────────────────────────────────

const IGNORED_PATTERNS: string[] = [
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "npm-shrinkwrap.json",
  ".DS_Store",
  ".env",
  ".env.local",
  "*.log",
  "dist/",
  "build/",
  ".next/",
];

// ─── parseDiff ───────────────────────────────────────────────────────────────

export function parseDiff(rawDiff: string): FileChange[] {
  // Handle empty input
  if (!rawDiff || !rawDiff.trim()) {
    return [];
  }

  // Split by the diff header, ignore the first empty chunk if any
  const chunks = rawDiff.split("diff --git ").filter(Boolean);

  return chunks.map((chunk) => {
    const lines = chunk.split("\n");

    // Extract filename: a/src/index.ts b/src/index.ts -> src/index.ts
    // More defensive - try multiple patterns
    let file = "unknown";
    const fileMatch = lines[0].match(/a\/(.+?)\s+b\//);
    if (fileMatch) {
      file = fileMatch[1];
    } else {
      // Fallback: if the format is slightly different, try to extract anything
      const simpleFallback = lines[0].match(/([^\s]+)/);
      if (simpleFallback) {
        file = simpleFallback[1].replace(/^a\/|^b\//, "");
      }
    }

    let additions = 0;
    let deletions = 0;

    for (const line of lines) {
      if (line.startsWith("+") && !line.startsWith("+++")) additions++;
      if (line.startsWith("-") && !line.startsWith("---")) deletions++;
    }

    return { file, additions, deletions, content: chunk };
  });
}

// ─── filterChanges ───────────────────────────────────────────────────────────

export function filterChanges(changes: FileChange[]): FileChange[] {
  return changes.filter((change) => !isIgnored(change.file));
}

// ─── isIgnored ───────────────────────────────────────────────────────────────

function isIgnored(filepath: string): boolean {
  // Handle edge case: "unknown" files from parse failures shouldn't be ignored
  if (filepath === "unknown") return false;

  for (const pattern of IGNORED_PATTERNS) {
    // 1. Directory prefix
    if (pattern.endsWith("/")) {
      if (filepath.startsWith(pattern)) return true;
      continue;
    }

    // 2. Wildcard suffix
    if (pattern.startsWith("*")) {
      if (filepath.endsWith(pattern.slice(1))) return true;
      continue;
    }

    // 3. Exact basename
    const basename = filepath.split("/").pop();
    if (basename === pattern) return true;
  }

  return false;
}
