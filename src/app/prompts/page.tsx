import { MOCK_PROMPT_HISTORY } from "@/lib/mock-data";
import { PromptHistory } from "@/components/prompt/prompt-history";

export default function PromptsPage() {
  return (
    <div className="flex h-screen flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Prompt History
          </h1>
          <p className="text-xs text-muted-foreground">
            Every prompt your team has run, ready to remix.
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-6">
        <div className="mx-auto max-w-3xl rounded-xl border border-border bg-card">
          <PromptHistory items={MOCK_PROMPT_HISTORY} />
        </div>
      </div>
    </div>
  );
}
