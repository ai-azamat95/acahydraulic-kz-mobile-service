import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const gateSource = fs.readFileSync(
  path.resolve("client/public/analytics-gate.js"),
  "utf8"
);

function runGate(
  options: { search?: string; userAgent?: string; webdriver?: boolean } = {}
) {
  const values = new Map<string, string>();
  const windowMock = {
    location: { pathname: "/catalog", search: options.search || "", hash: "" },
    history: { replaceState: () => undefined },
    localStorage: {
      getItem: (key: string) => values.get(key) || null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    },
    navigator: {
      userAgent: options.userAgent || "Mozilla/5.0",
      webdriver: options.webdriver || false,
    },
  } as Record<string, unknown>;

  new Function("window", "URLSearchParams", "document", gateSource)(
    windowMock,
    URLSearchParams,
    { title: "Catalog" }
  );

  return windowMock;
}

describe("analytics traffic gate", () => {
  it("marks the current device as internal from the one-time query flag", () => {
    const windowMock = runGate({ search: "?aca_internal=1" });

    expect(windowMock.__ACA_ANALYTICS_EXCLUDE__).toBe(true);
    expect(windowMock.__ACA_ANALYTICS_EXCLUSION_REASON__).toBe("internal");
    expect(windowMock["ga-disable-G-XZB9KZ4VCH"]).toBe(true);
  });

  it("excludes webdriver and known crawler user agents", () => {
    expect(
      runGate({ webdriver: true }).__ACA_ANALYTICS_EXCLUSION_REASON__
    ).toBe("automated");
    expect(
      runGate({ userAgent: "Googlebot/2.1" }).__ACA_ANALYTICS_EXCLUSION_REASON__
    ).toBe("automated");
  });

  it("keeps normal visitors eligible for analytics", () => {
    expect(runGate().__ACA_ANALYTICS_EXCLUDE__).toBe(false);
  });
});
