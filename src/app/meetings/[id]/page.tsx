"use client";

import Link from "next/link";
import { use } from "react";
import { ArrowLeft } from "lucide-react";
import { RecordingControls } from "@/components/meetings/recording-controls";
import { findMeetingById } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/utils";

interface MeetingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function MeetingDetailPage({ params }: MeetingDetailPageProps) {
  const { id } = use(params);
  const meeting = findMeetingById(id);

  if (!meeting) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 px-6">
        <p className="text-sm text-muted-foreground">Meeting not found.</p>
        <Link
          href="/meetings"
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          Back to meetings
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="shrink-0 border-b border-border px-6 py-4">
        <Link
          href="/meetings"
          className="mb-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to meetings
        </Link>
        <h1 className="text-xl font-semibold tracking-tight">{meeting.title}</h1>
        <time
          dateTime={meeting.recordedAt}
          className="mt-1 block text-xs text-muted-foreground"
        >
          Recorded {formatRelativeTime(meeting.recordedAt)}
        </time>
      </header>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
        <section aria-labelledby="recording-controls-heading">
          <h2
            id="recording-controls-heading"
            className="mb-3 text-sm font-semibold text-foreground"
          >
            Recording controls
          </h2>
          <RecordingControls />
        </section>
      </div>
    </div>
  );
}
