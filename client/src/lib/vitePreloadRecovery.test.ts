import { describe, expect, it, vi } from "vitest";

import {
  installVitePreloadRecovery,
  isViteChunkLoadError,
  PRELOAD_RECOVERY_STORAGE_KEY,
  type PreloadRecoveryHost,
  VITE_PRELOAD_ERROR_EVENT,
} from "./vitePreloadRecovery";

function createHost(pathname = "/catalog/pump", search = "") {
  const events = new EventTarget();
  const values = new Map<string, string>();
  const reload = vi.fn();
  const host: PreloadRecoveryHost = {
    location: { pathname, search, reload },
    sessionStorage: {
      getItem: key => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
    },
    addEventListener: (type, listener) =>
      events.addEventListener(type, listener),
    removeEventListener: (type, listener) =>
      events.removeEventListener(type, listener),
  };

  return { events, host, reload, values };
}

describe("Vite preload recovery", () => {
  it("reloads once for a stale chunk and prevents the original rejection", () => {
    const { events, host, reload, values } = createHost();
    const cleanup = installVitePreloadRecovery({ host, now: () => 1_000 });
    const event = new Event(VITE_PRELOAD_ERROR_EVENT, { cancelable: true });

    events.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(reload).toHaveBeenCalledOnce();
    expect(
      JSON.parse(values.get(PRELOAD_RECOVERY_STORAGE_KEY) ?? "{}")
    ).toEqual({
      path: "/catalog/pump",
      attemptedAt: 1_000,
    });
    cleanup();
  });

  it("does not create a reload loop for the same page", () => {
    const { events, host, reload } = createHost("/catalog/pump", "?q=K5V160");
    let now = 1_000;
    installVitePreloadRecovery({ host, now: () => now, ttlMs: 30_000 });

    events.dispatchEvent(
      new Event(VITE_PRELOAD_ERROR_EVENT, { cancelable: true })
    );
    const repeated = new Event(VITE_PRELOAD_ERROR_EVENT, { cancelable: true });
    now = 2_000;
    events.dispatchEvent(repeated);

    expect(reload).toHaveBeenCalledOnce();
    expect(repeated.defaultPrevented).toBe(false);
  });

  it("allows a later recovery attempt after the guard expires", () => {
    const { events, host, reload } = createHost();
    let now = 1_000;
    installVitePreloadRecovery({ host, now: () => now, ttlMs: 30_000 });

    events.dispatchEvent(
      new Event(VITE_PRELOAD_ERROR_EVENT, { cancelable: true })
    );
    now = 31_001;
    events.dispatchEvent(
      new Event(VITE_PRELOAD_ERROR_EVENT, { cancelable: true })
    );

    expect(reload).toHaveBeenCalledTimes(2);
  });

  it("recognizes browser chunk-load errors", () => {
    expect(
      isViteChunkLoadError(
        new TypeError("Failed to fetch dynamically imported module")
      )
    ).toBe(true);
    expect(
      isViteChunkLoadError(new Error("Importing a module script failed"))
    ).toBe(true);
    expect(isViteChunkLoadError(new Error("Product not found"))).toBe(false);
  });
});
