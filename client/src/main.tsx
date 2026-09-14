import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import superjson from "superjson";
import App from "./App";
import { getLoginUrl } from "./const";
import "./index.css";
import "./i18n";

const queryClient = new QueryClient();

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

// Warm the catalogue after the homepage has had time to paint. This keeps the
// homepage critical path small, but makes the common "Home -> Parts" journey
// feel instant on mobile. Only the catalogue code and first small index chunk
// are prefetched; the 10k+ product index is still deferred until the page opens.
if (typeof window !== "undefined" && window.location.pathname === "/") {
  const connection = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;

  const avoidPrefetch = connection?.saveData || connection?.effectiveType === "2g";
  if (!avoidPrefetch) {
    window.setTimeout(() => {
      void import("./pages/Catalog");
      void fetch("/catalog-data/manifest.json", { cache: "no-cache" })
        .then((response) => (response.ok ? response.json() : null))
        .then((manifest: { importedAt?: string } | null) => {
          if (!manifest) return;
          const suffix = manifest.importedAt
            ? `?v=${encodeURIComponent(manifest.importedAt)}`
            : "";
          return fetch(`/catalog-data/search-index-001.json${suffix}`, {
            cache: "force-cache",
          });
        })
        .catch(() => undefined);
    }, 1800);
  }
}

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </QueryClientProvider>
  </trpc.Provider>
);
