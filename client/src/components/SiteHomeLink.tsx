import type { AnchorHTMLAttributes } from "react";
import { useRouter } from "wouter";

/** Return to a fresh homepage document, including after a catalogue deployment. */
export default function SiteHomeLink(props: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const { base } = useRouter();
  return <a {...props} href={`${base}/`} />;
}
