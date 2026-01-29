import { FileChange } from "../types";

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