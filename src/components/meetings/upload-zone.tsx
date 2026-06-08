"use client";

import { useCallback, useId, useRef, useState } from "react";
import { Upload } from "lucide-react";
import type { UploadState } from "@/lib/types";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = ["audio/", "video/"];

function announcementForState(state: UploadState, fileName?: string): string {
  switch (state) {
    case "dragOver":
      return "Drag entered upload zone";
    case "idle":
      return fileName ? "Drag left upload zone" : "";
    case "uploading":
      return "Upload in progress";
    case "complete":
      return "Upload complete";
    case "error":
      return "Upload failed. Please choose an audio or video file.";
    default:
      return "";
  }
}

interface UploadZoneProps {
  onComplete?: (fileName: string) => void;
}

export function UploadZone({ onComplete }: UploadZoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const [state, setState] = useState<UploadState>("idle");
  const [announcement, setAnnouncement] = useState("");

  const updateState = useCallback(
    (next: UploadState, fileName?: string) => {
      setState(next);
      setAnnouncement(announcementForState(next, fileName));
    },
    []
  );

  const startUpload = useCallback(
    (file: File) => {
      const isAccepted = ACCEPTED_TYPES.some((type) => file.type.startsWith(type));

      if (!isAccepted) {
        updateState("error");
        return;
      }

      updateState("uploading", file.name);

      window.setTimeout(() => {
        updateState("complete", file.name);
        onComplete?.(file.name);
      }, 300);
    },
    [onComplete, updateState]
  );

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFilePicker();
    }
  };

  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    dragDepth.current += 1;
    if (dragDepth.current === 1) {
      updateState("dragOver");
    }
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    dragDepth.current -= 1;
    if (dragDepth.current === 0) {
      setState("idle");
      setAnnouncement("Drag left upload zone");
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    dragDepth.current = 0;
    const file = event.dataTransfer.files[0];
    if (!file) return;
    setAnnouncement("File dropped");
    startUpload(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAnnouncement("File dropped");
    startUpload(file);
    event.target.value = "";
  };

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={inputId} className="text-sm font-medium text-foreground">
        Upload meeting recording
      </label>

      <div
        role="button"
        tabIndex={0}
        aria-label="Drag and drop a recording here"
        aria-describedby={`${inputId}-hint`}
        onKeyDown={handleKeyDown}
        onClick={openFilePicker}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          "flex min-h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card px-6 py-8 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          state === "dragOver" && "border-primary bg-primary/5",
          state === "error" && "border-destructive",
          state === "complete" && "border-primary/50"
        )}
      >
        <Upload className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm font-medium text-foreground">
          {state === "uploading"
            ? "Uploading..."
            : state === "complete"
              ? "Upload complete"
              : "Drag and drop a recording here"}
        </p>
        <p id={`${inputId}-hint`} className="text-xs text-muted-foreground">
          or press Enter to browse for audio or video files
        </p>
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="audio/*,video/*"
        className="sr-only"
        onChange={handleFileChange}
      />

      {state === "error" && (
        <p className="text-sm text-destructive" role="alert">
          Upload failed. Please choose an audio or video file.
        </p>
      )}

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
    </div>
  );
}
