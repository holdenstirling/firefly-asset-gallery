"use client";

import { useMemo } from "react";
import { Circle, Pause, Square } from "lucide-react";
import { useRecorder } from "@/hooks/use-recorder";
import type { RecordingState } from "@/lib/types";
import { Button } from "@/components/ui/button";

function statusAnnouncement(status: RecordingState): string {
  switch (status) {
    case "recording":
      return "Recording";
    case "paused":
      return "Paused";
    default:
      return "Stopped";
  }
}

export function RecordingControls() {
  const { status, toggleRecord, togglePause, stop } = useRecorder();
  const announcement = statusAnnouncement(status);

  const isRecording = status === "recording";
  const isPaused = status === "paused";

  const statusText = useMemo(() => {
    if (isRecording) return "Recording in progress";
    if (isPaused) return "Recording paused";
    return "Recording stopped";
  }, [isPaused, isRecording]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={isRecording ? "destructive" : "default"}
          aria-pressed={isRecording}
          aria-label="Record"
          onClick={toggleRecord}
          className="gap-2"
        >
          <Circle className="h-4 w-4 fill-current" aria-hidden="true" />
          {isRecording ? "Recording" : "Record"}
        </Button>

        <Button
          type="button"
          variant="secondary"
          aria-pressed={isPaused}
          aria-label="Pause"
          disabled={status === "idle"}
          onClick={togglePause}
          className="gap-2"
        >
          <Pause className="h-4 w-4" aria-hidden="true" />
          Pause
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Stop recording"
          disabled={status === "idle"}
          onClick={stop}
        >
          <Square className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      <p className="text-sm text-foreground" aria-hidden="true">
        {statusText}
      </p>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
    </div>
  );
}
