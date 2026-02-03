import dotenv from "dotenv";

dotenv.config();

function validateConfig(): void {
  if (!process.env.OPENAI_API_KEY) {
    console.error(
      "Fatal: OPENAI_API_KEY is not set.\n" +
        "\n" +
        "  1. Create a .env file in the project root.\n" +
        "  2. Add:  OPENAI_API_KEY=sk-...\n" +
        "  3. Restart the CLI.\n",
    );
    process.exit(1);
  }
}

validateConfig();

export const config = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
};
