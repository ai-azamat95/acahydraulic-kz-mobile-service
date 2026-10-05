export type DirectoryModel = { slug: string; label: string; brand: string; count: number };
export function groupCatalogModels<T extends DirectoryModel>(models: T[]): { brand: string; models: T[] }[];
