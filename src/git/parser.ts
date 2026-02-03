import { FileChange } from "../types";

const IGNORED_PATTERNS: string[] = [
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "npm-shrinkwrap.json",
  ".DS_Store",
  ".env",
  ".env.local",
  "*.log", // any .log file
  "dist/", // anything inside dist/
  "build/", // anything inside build/
  ".next/", // Next.js build output
];

export function parseDiff(rawDiff: string): FileChange[] {
  // Split by the diff header, ignore the first empty chunk if any
  const chunks = rawDiff.split("diff --git ").filter(Boolean);

  return chunks.map((chunk) => {
    const lines = chunk.split("\n");
    // Extract filename: a/src/index.ts b/src/index.ts -> src/index.ts
    const fileMatch = lines[0].match(/a\/(.+) b\//);
    const file = fileMatch ? fileMatch[1] : "unknown";

    let additions = 0;
    let deletions = 0;

    for (const line of lines) {
      if (line.startsWith("+") && !line.startsWith("+++")) additions++;
      if (line.startsWith("-") && !line.startsWith("---")) deletions++;
    }

    return { file, additions, deletions, content: chunk };
  });
}

export function filterChanges(changes: FileChange[]): FileChange[] {
  return changes.filter((change) => !isIgnored(change.file));
}

function isIgnored(filepath: string): boolean {
  for (const pattern of IGNORED_PATTERNS) {
    // 1. Directory prefix  →  "dist/"  catches  "dist/bundle.js"
    if (pattern.endsWith("/")) {
      if (filepath.startsWith(pattern)) return true;
      continue;
    }

    // 2. Wildcard suffix  →  "*.log"  catches  "errors.log"
    if (pattern.startsWith("*")) {
      if (filepath.endsWith(pattern.slice(1))) return true;
      continue;
    }

    // 3. Exact basename  →  "package-lock.json"  catches  "packages/app/package-lock.json"
    const basename = filepath.split("/").pop();
    if (basename === pattern) return true;
  }

  return false;
}
