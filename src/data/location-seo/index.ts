export * from './types';
export * from './batch1';
export * from './batch2';
export * from './batch3';

import { LOCATION_PAGES_BATCH1 } from './batch1';
import { LOCATION_PAGES_BATCH2 } from './batch2';
import { LOCATION_PAGES_BATCH3 } from './batch3';
import { LocationSeoPageData } from './types';

export const ALL_LOCATION_PAGES: LocationSeoPageData[] = [
  ...LOCATION_PAGES_BATCH1,
  ...LOCATION_PAGES_BATCH2,
  ...LOCATION_PAGES_BATCH3,
];

export function getLocationSeoPageBySlug(slug: string): LocationSeoPageData | undefined {
  const cleanSlug = slug.replace(/^\/+|\/+$/g, '');
  return ALL_LOCATION_PAGES.find((p) => p.slug === cleanSlug);
}
