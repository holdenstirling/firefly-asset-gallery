"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { MeetingCard } from "@/components/meetings/meeting-card";
import { Button } from "@/components/ui/button";
import { MOCK_MEETINGS } from "@/lib/mock-data";
import { useState } from "react";
import type { Meeting } from "@/lib/types";

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>(MOCK_MEETINGS);

  return (
    <div className="flex h-screen flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Meetings</h1>
          <p className="text-xs text-muted-foreground">
            Browse recordings and upload new meeting audio.
          </p>
        </div>
        <Button asChild>
          <Link href="/meetings/new" className="gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New meeting
          </Link>
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <ul className="mx-auto grid max-w-3xl list-none gap-3 p-0">
          {meetings.map((meeting) => (
            <li key={meeting.id}>
              <MeetingCard
                meeting={meeting}
                onDelete={(id) =>
                  setMeetings((current) => current.filter((item) => item.id !== id))
                }
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
