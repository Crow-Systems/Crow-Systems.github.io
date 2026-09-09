import { describe, it, expect } from "vitest";
import { sanitizeHtml } from "./sanitize";

describe("sanitizeHtml", () => {
  it("passes plain text through unchanged", () => {
    expect(sanitizeHtml("Hello world")).toBe("Hello world");
  });

  it("strips script tags entirely", () => {
    expect(sanitizeHtml('before<script>alert("xss")</script>after')).toBe(
      "beforeafter",
    );
  });

  it("strips img tags entirely (not in allowlist)", () => {
    expect(sanitizeHtml('<img src="x" onerror="alert(1)">')).toBe("");
  });

  it("allows br tags", () => {
    expect(sanitizeHtml("line1<br>line2")).toBe("line1<br>line2");
  });

  it("allows em and strong tags", () => {
    expect(sanitizeHtml("<em>italic</em> and <strong>bold</strong>")).toBe(
      "<em>italic</em> and <strong>bold</strong>",
    );
  });

  it("allows span tags with class attribute", () => {
    expect(sanitizeHtml('<span class="highlight">text</span>')).toBe(
      '<span class="highlight">text</span>',
    );
  });

  it("strips class attribute from non-span tags by dropping the tag", () => {
    // div is not in the allowlist, so the whole tag is stripped
    expect(sanitizeHtml('<div class="foo">text</div>')).toBe("text");
  });

  it("strips disallowed tags like div, p, a", () => {
    expect(sanitizeHtml('<div><p>text</p><a href="#">link</a></div>')).toBe(
      "textlink",
    );
  });

  it("strips button tags entirely with inline handlers", () => {
    // button is not in the allowlist; the on* handler regex never sees it
    expect(
      sanitizeHtml('<button onclick="evil()">click</button>'),
    ).toBe("click");
  });

  it("handles nested allowed tags", () => {
    expect(sanitizeHtml("<strong><em>both</em></strong>")).toBe(
      "<strong><em>both</em></strong>",
    );
  });

  it("strips script tags with attributes", () => {
    expect(
      sanitizeHtml('<script src="evil.js"></script>'),
    ).toBe("");
  });

  it("preserves text mixed with allowed tags", () => {
    expect(sanitizeHtml("Hello <strong>world</strong>, welcome<br>here")).toBe(
      "Hello <strong>world</strong>, welcome<br>here",
    );
  });
});
