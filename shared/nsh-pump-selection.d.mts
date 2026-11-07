export type NshPumpCopy = {
  heading: string; intro: string; action: string; other: string; note: string;
  request: string; requestOther: string; details: string;
};
export const nshPumpSeries: { id: string; name: string }[];
export function nshPumpCopy(language?: string): NshPumpCopy;
export function nshPumpRequestHref(seriesId: string, language?: string): string;
export function renderNshPumpSelection(language?: string): string;
