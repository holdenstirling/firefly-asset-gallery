"use client";

import { useCallback, useState } from "react";
import type { RecordingState } from "@/lib/types";

export interface RecorderControls {
  status: RecordingState;
  toggleRecord: () => void;
  togglePause: () => void;
  stop: () => void;
}

export function useRecorder(): RecorderControls {
  const [status, setStatus] = useState<RecordingState>("idle");

  const toggleRecord = useCallback(() => {
    setStatus((current) => {
      if (current === "idle") return "recording";
      if (current === "recording") return "idle";
      return "recording";
    });
  }, []);

  const togglePause = useCallback(() => {
    setStatus((current) => {
      if (current === "recording") return "paused";
      if (current === "paused") return "recording";
      return current;
    });
  }, []);

  const stop = useCallback(() => {
    setStatus("idle");
  }, []);

  return { status, toggleRecord, togglePause, stop };
}
