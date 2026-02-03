import { FileChange } from "../types";

const MAX_CONTENT_LENGTH = 1000;

function truncateContent(content: string): string {
  if (content.length <= MAX_CONTENT_LENGTH) return content;
  return content.slice(0, MAX_CONTENT_LENGTH) + "\n...truncated";
}

export function generatePrompt(changes: FileChange[]): string {
  const header =
    "Analyze the following code changes and generate a commit message.\n\n" +
    "## Files Changed\n";

  const fileSections = changes.map((change) => {
    const title = `### ${change.file}`;
    const stats = `Added: ${change.additions} lines, Removed: ${change.deletions} lines`;
    const body = truncateContent(change.content);

    return `${title}\n${stats}\n\`\`\`\n${body}\n\`\`\``;
  });

  return header + "\n" + fileSections.join("\n\n") + "\n";
}
