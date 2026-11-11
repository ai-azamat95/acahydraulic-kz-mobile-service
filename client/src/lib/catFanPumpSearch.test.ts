import { describe, expect, it } from 'vitest';
import ownerProducts from '@shared/catalog-owner-products.json';
import { catalogMatchesQuery } from './catalogSearch';

const product = ownerProducts.find(row => row.id === '8721030250658')!;

describe('CAT 564-9801 fan pump search', () => {
  it.each(['564-9801', '5649801', 'CAT 5649801', 'насос вентилятора 564-9801'])('finds the existing card by %s', query => {
    expect(product).toBeDefined();
    expect(catalogMatchesQuery(product, query)).toBe(true);
  });

  it('does not match a different pump number', () => {
    expect(catalogMatchesQuery(product, '5649802')).toBe(false);
  });
});
