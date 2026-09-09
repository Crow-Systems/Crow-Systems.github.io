import { describe, it, expect } from "vitest";
import { getLocaleData, getRoutes, getAnchorMap } from "./index";

describe("getLocaleData", () => {
  it("returns English locale for 'en'", () => {
    const data = getLocaleData("en");
    expect(data.nav.about).toBeDefined();
    expect(data.routes.home).toBe("/en/");
  });

  it("returns Spanish locale for 'es'", () => {
    const data = getLocaleData("es");
    expect(data.nav.about).toBeDefined();
    expect(data.routes.home).toBe("/");
  });

  it("returns Spanish for unknown locale", () => {
    const data = getLocaleData("fr");
    expect(data.routes.home).toBe("/");
  });
});

describe("getRoutes", () => {
  it("returns both en and es route maps", () => {
    const routes = getRoutes();
    expect(routes.en).toBeDefined();
    expect(routes.es).toBeDefined();
  });

  it("has matching keys for both locales", () => {
    const routes = getRoutes();
    expect(Object.keys(routes.en).sort()).toEqual(
      Object.keys(routes.es).sort(),
    );
  });
});

describe("getAnchorMap", () => {
  it("returns a bidirectional anchor map", () => {
    const map = getAnchorMap();
    const entries = Object.entries(map);
    expect(entries.length).toBeGreaterThan(0);
  });

  it("maps en anchors to es and back", () => {
    const map = getAnchorMap();
    const enAnchors = Object.values(getLocaleData("en").anchors);
    if (enAnchors.length > 0) {
      const first = enAnchors[0];
      expect(map[`#${first}`]).toBeDefined();
    }
  });
});
