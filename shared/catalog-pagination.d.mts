export const CATALOG_PAGE_SIZE: 10;
export function catalogPage(search: string): number;
export function catalogPageHref(path: string, search: string, page: number): string;
export function catalogPageNumbers(page: number, pages: number): (number | string)[];
