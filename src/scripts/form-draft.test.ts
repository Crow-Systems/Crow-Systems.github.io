import { describe, it, expect, beforeEach } from "vitest";
import { loadDraft, saveDraft, clearDraft } from "./form-draft";

describe("form-draft", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null when no draft exists", () => {
    expect(loadDraft("nonexistent")).toBeNull();
  });

  it("saves and loads a draft", () => {
    const payload = { values: { name: "Test", email: "t@e.com" } };
    saveDraft("test-draft", payload);
    expect(loadDraft("test-draft")).toEqual(payload);
  });

  it("saves draft with mode", () => {
    const payload = {
      mode: "audio" as const,
      values: { name: "Test" },
    };
    saveDraft("test-draft", payload);
    const loaded = loadDraft("test-draft");
    expect(loaded?.mode).toBe("audio");
  });

  it("overwrites an existing draft", () => {
    saveDraft("test-draft", { values: { name: "First" } });
    saveDraft("test-draft", { values: { name: "Second" } });
    expect(loadDraft("test-draft")?.values.name).toBe("Second");
  });

  it("clears a draft", () => {
    saveDraft("test-draft", { values: { name: "Test" } });
    clearDraft("test-draft");
    expect(loadDraft("test-draft")).toBeNull();
  });

  it("clearing a nonexistent draft does not throw", () => {
    expect(() => clearDraft("nonexistent")).not.toThrow();
  });

  it("returns null for corrupted localStorage data", () => {
    localStorage.setItem("bad-draft", "not-json");
    expect(loadDraft("bad-draft")).toBeNull();
  });

  it("returns null for missing payload key in stored object", () => {
    localStorage.setItem("bad-draft", JSON.stringify({ savedAt: 123 }));
    expect(loadDraft("bad-draft")).toBeNull();
  });

  it("handles empty values object", () => {
    const payload = { values: {} };
    saveDraft("test-draft", payload);
    expect(loadDraft("test-draft")).toEqual(payload);
  });
});
