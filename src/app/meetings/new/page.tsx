"use client";

import { useRouter } from "next/navigation";
import { UploadZone } from "@/components/meetings/upload-zone";

export default function NewMeetingPage() {
  const router = useRouter();

  return (
    <div className="flex h-screen flex-col">
      <header className="shrink-0 border-b border-border px-6 py-4">
        <h1 className="text-xl font-semibold tracking-tight">New meeting</h1>
        <p className="text-xs text-muted-foreground">
          Upload a recording to add it to your meeting library.
        </p>
      </header>

      <div className="flex flex-1 items-start justify-center overflow-y-auto px-6 py-8">
        <div className="w-full max-w-lg">
          <UploadZone
            onComplete={() => {
              router.push("/meetings");
            }}
          />
        </div>
      </div>
    </div>
  );
}
