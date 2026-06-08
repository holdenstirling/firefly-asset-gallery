import { afterEach, describe, expect, it, vi } from "vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MeetingCard } from "@/components/meetings/meeting-card";
import { RecordingControls } from "@/components/meetings/recording-controls";
import { UploadZone } from "@/components/meetings/upload-zone";
import type { Meeting } from "@/lib/types";

const meeting: Meeting = {
  id: "meeting-test",
  title: "Accessibility Audit Walkthrough",
  recordedAt: new Date(Date.now() - 3_600_000).toISOString(),
  durationSeconds: 1200,
};

afterEach(() => {
  vi.useRealTimers();
});

describe("MeetingCard accessibility", () => {
  describe("ARIA", () => {
    it("exposes primary link named by meeting title", () => {
      render(<MeetingCard meeting={meeting} />);
      expect(
        screen.getByRole("link", { name: meeting.title })
      ).toBeInTheDocument();
    });

    it("marks delete control with aria-label", () => {
      render(<MeetingCard meeting={meeting} />);
      expect(
        screen.getByRole("button", { name: `Delete ${meeting.title}` })
      ).toBeInTheDocument();
    });

    it("marks overflow menu trigger with aria-label and aria-expanded", () => {
      render(<MeetingCard meeting={meeting} />);
      const menuButton = screen.getByRole("button", {
        name: `More actions for ${meeting.title}`,
      });
      expect(menuButton).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("keyboard", () => {
    it("activates delete on Enter without opening the meeting link", async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();
      render(<MeetingCard meeting={meeting} onDelete={onDelete} />);

      const deleteButton = screen.getByRole("button", {
        name: `Delete ${meeting.title}`,
      });
      deleteButton.focus();
      await user.keyboard("{Enter}");

      expect(onDelete).toHaveBeenCalledWith(meeting.id);
    });

    it("closes menu on Escape", async () => {
      const user = userEvent.setup();
      render(<MeetingCard meeting={meeting} />);

      const menuButton = screen.getByRole("button", {
        name: `More actions for ${meeting.title}`,
      });
      await user.click(menuButton);
      expect(menuButton).toHaveAttribute("aria-expanded", "true");

      await user.keyboard("{Escape}");
      expect(menuButton).toHaveAttribute("aria-expanded", "false");
    });

    it("navigates menu items with arrow keys", async () => {
      const user = userEvent.setup();
      render(<MeetingCard meeting={meeting} />);

      const menuButton = screen.getByRole("button", {
        name: `More actions for ${meeting.title}`,
      });
      await user.click(menuButton);

      const menu = screen.getByRole("menu", {
        name: `Actions for ${meeting.title}`,
      });
      const items = within(menu).getAllByRole("menuitem");
      expect(items[0]).toHaveAttribute("tabindex", "0");
      expect(items[0]).toHaveFocus();

      await user.keyboard("{ArrowDown}");
      expect(items[1]).toHaveAttribute("tabindex", "0");
      expect(items[0]).toHaveAttribute("tabindex", "-1");
      expect(items[1]).toHaveFocus();

      await user.keyboard("{ArrowUp}");
      expect(items[0]).toHaveAttribute("tabindex", "0");
      expect(items[1]).toHaveAttribute("tabindex", "-1");
      expect(items[0]).toHaveFocus();
    });
  });

  describe("screen reader", () => {
    it("renders timestamp with semantic time element", () => {
      render(<MeetingCard meeting={meeting} />);
      const timestamp = screen.getByText(/\d+[mhd] ago|just now/);
      expect(timestamp.tagName).toBe("TIME");
      expect(timestamp).toHaveAttribute("datetime", meeting.recordedAt);
      expect(timestamp).toHaveClass("text-muted-foreground");
    });
  });
});

describe("RecordingControls accessibility", () => {
  describe("ARIA", () => {
    it("reflects recording state with aria-pressed on record button", async () => {
      const user = userEvent.setup();
      render(<RecordingControls />);

      const recordButton = screen.getByRole("button", { name: "Record" });
      expect(recordButton).toHaveAttribute("aria-pressed", "false");

      await user.click(recordButton);
      expect(recordButton).toHaveAttribute("aria-pressed", "true");
    });

    it("reflects paused state with aria-pressed on pause button", async () => {
      const user = userEvent.setup();
      render(<RecordingControls />);

      await user.click(screen.getByRole("button", { name: "Record" }));

      const pauseButton = screen.getByRole("button", { name: "Pause" });
      expect(pauseButton).toHaveAttribute("aria-pressed", "false");

      await user.click(pauseButton);
      expect(pauseButton).toHaveAttribute("aria-pressed", "true");
    });

    it("labels stop control for icon-only button", () => {
      render(<RecordingControls />);
      expect(
        screen.getByRole("button", { name: "Stop recording" })
      ).toBeInTheDocument();
    });
  });

  describe("keyboard", () => {
    it("toggles recording with Space", async () => {
      const user = userEvent.setup();
      render(<RecordingControls />);

      const recordButton = screen.getByRole("button", { name: "Record" });
      recordButton.focus();
      await user.keyboard(" ");

      expect(recordButton).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("screen reader", () => {
    it("announces recording, paused, and stopped states", async () => {
      const user = userEvent.setup();
      render(<RecordingControls />);

      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Record" }));
      await waitFor(() => expect(liveRegion).toHaveTextContent("Recording"));

      await user.click(screen.getByRole("button", { name: "Pause" }));
      await waitFor(() => expect(liveRegion).toHaveTextContent("Paused"));

      await user.click(screen.getByRole("button", { name: "Stop recording" }));
      await waitFor(() => expect(liveRegion).toHaveTextContent("Stopped"));
    });
  });
});

describe("UploadZone accessibility", () => {
  describe("ARIA", () => {
    it("associates visible label with file input", () => {
      render(<UploadZone />);
      expect(
        screen.getByLabelText("Upload meeting recording")
      ).toBeInTheDocument();
    });

    it("exposes keyboard-activatable drop zone button", () => {
      render(<UploadZone />);
      expect(
        screen.getByRole("button", { name: /drag and drop a recording here/i })
      ).toBeInTheDocument();
    });

    it("includes aria-live region for announcements", () => {
      render(<UploadZone />);
      expect(document.querySelector('[aria-live="polite"]')).toBeInTheDocument();
    });
  });

  describe("keyboard", () => {
    it("opens file picker on Enter", async () => {
      const user = userEvent.setup();
      const clickSpy = vi
        .spyOn(HTMLInputElement.prototype, "click")
        .mockImplementation(() => undefined);

      render(<UploadZone />);
      const dropZone = screen.getByRole("button", {
        name: /drag and drop a recording here/i,
      });
      dropZone.focus();
      await user.keyboard("{Enter}");

      expect(clickSpy).toHaveBeenCalled();
      clickSpy.mockRestore();
    });
  });

  describe("screen reader", () => {
    it("announces drag entered and drag left transitions", async () => {
      render(<UploadZone />);

      const liveRegion = document.querySelector('[aria-live="polite"]');
      const dropZone = screen.getByRole("button", {
        name: /drag and drop a recording here/i,
      });

      fireEvent.dragEnter(dropZone);

      await waitFor(() =>
        expect(liveRegion).toHaveTextContent("Drag entered upload zone")
      );

      fireEvent.dragLeave(dropZone);

      await waitFor(() =>
        expect(liveRegion).toHaveTextContent("Drag left upload zone")
      );
    });

    it("announces upload progress and completion", async () => {
      render(<UploadZone />);

      const liveRegion = document.querySelector('[aria-live="polite"]');
      const input = screen.getByLabelText(
        "Upload meeting recording"
      ) as HTMLInputElement;
      const file = new File(["audio"], "sync.mp3", { type: "audio/mpeg" });

      await userEvent.upload(input, file);

      expect(liveRegion).toHaveTextContent("Upload in progress");

      await waitFor(
        () => expect(liveRegion).toHaveTextContent("Upload complete"),
        { timeout: 1000 }
      );
    });

    it("announces error for unsupported file types", () => {
      render(<UploadZone />);

      const liveRegion = document.querySelector('[aria-live="polite"]');
      const input = screen.getByLabelText(
        "Upload meeting recording"
      ) as HTMLInputElement;
      const file = new File(["text"], "notes.txt", { type: "text/plain" });

      fireEvent.change(input, { target: { files: [file] } });

      expect(liveRegion).toHaveTextContent(
        "Upload failed. Please choose an audio or video file."
      );
    });
  });

  describe("upload lifecycle", () => {
    it("calls onComplete once for overlapping uploads", () => {
      vi.useFakeTimers();
      const onComplete = vi.fn();
      render(<UploadZone onComplete={onComplete} />);
      const input = screen.getByLabelText(
        "Upload meeting recording"
      ) as HTMLInputElement;
      const firstFile = new File(["audio"], "first.mp3", {
        type: "audio/mpeg",
      });
      const secondFile = new File(["audio"], "second.mp3", {
        type: "audio/mpeg",
      });

      fireEvent.change(input, { target: { files: [firstFile] } });
      fireEvent.change(input, { target: { files: [secondFile] } });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(onComplete).toHaveBeenCalledWith("first.mp3");
      vi.useRealTimers();
    });

    it("clears pending upload timers on unmount", () => {
      vi.useFakeTimers();
      const onComplete = vi.fn();
      const { unmount } = render(<UploadZone onComplete={onComplete} />);
      const input = screen.getByLabelText(
        "Upload meeting recording"
      ) as HTMLInputElement;
      const file = new File(["audio"], "sync.mp3", { type: "audio/mpeg" });

      fireEvent.change(input, { target: { files: [file] } });
      unmount();

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(onComplete).not.toHaveBeenCalled();
      vi.useRealTimers();
    });
  });
});
