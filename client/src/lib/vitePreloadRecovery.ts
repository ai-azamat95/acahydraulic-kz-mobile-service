export const VITE_PRELOAD_ERROR_EVENT = "vite:preloadError";
export const PRELOAD_RECOVERY_STORAGE_KEY = "aca:vite-preload-recovery";
export const PRELOAD_RECOVERY_TTL_MS = 30_000;

type RecoveryState = {
  path: string;
  attemptedAt: number;
};

export type PreloadRecoveryHost = {
  location: {
    pathname: string;
    search: string;
    reload: () => void;
  };
  sessionStorage: Pick<Storage, "getItem" | "setItem">;
  addEventListener: (type: string, listener: EventListener) => void;
  removeEventListener: (type: string, listener: EventListener) => void;
};

type InstallOptions = {
  host?: PreloadRecoveryHost;
  now?: () => number;
  ttlMs?: number;
};

function currentPath(host: PreloadRecoveryHost) {
  return `${host.location.pathname}${host.location.search}`;
}

function readRecoveryState(
  host: PreloadRecoveryHost
): RecoveryState | null | undefined {
  try {
    const raw = host.sessionStorage.getItem(PRELOAD_RECOVERY_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<RecoveryState>;
    if (
      typeof parsed.path !== "string" ||
      typeof parsed.attemptedAt !== "number"
    )
      return null;
    return { path: parsed.path, attemptedAt: parsed.attemptedAt };
  } catch {
    // If storage is unavailable, avoid an automatic reload that could loop.
    return undefined;
  }
}

function writeRecoveryState(host: PreloadRecoveryHost, state: RecoveryState) {
  try {
    host.sessionStorage.setItem(
      PRELOAD_RECOVERY_STORAGE_KEY,
      JSON.stringify(state)
    );
    return true;
  } catch {
    return false;
  }
}

export function installVitePreloadRecovery({
  host = window,
  now = Date.now,
  ttlMs = PRELOAD_RECOVERY_TTL_MS,
}: InstallOptions = {}) {
  const onPreloadError: EventListener = event => {
    const path = currentPath(host);
    const attemptedAt = now();
    const previous = readRecoveryState(host);

    if (previous === undefined) return;
    if (previous?.path === path && attemptedAt - previous.attemptedAt < ttlMs)
      return;
    if (!writeRecoveryState(host, { path, attemptedAt })) return;

    event.preventDefault();
    host.location.reload();
  };

  host.addEventListener(VITE_PRELOAD_ERROR_EVENT, onPreloadError);
  return () =>
    host.removeEventListener(VITE_PRELOAD_ERROR_EVENT, onPreloadError);
}

export function isViteChunkLoadError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return /failed to fetch dynamically imported module|importing a module script failed|loading chunk|chunkloaderror|css_chunk_load_failed/i.test(
    message
  );
}
