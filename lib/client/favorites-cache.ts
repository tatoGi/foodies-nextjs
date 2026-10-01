let favoriteIds: Promise<Set<number> | null> | null = null;

/** One request per page load for the heart state; null = signed out. */
export function loadFavoriteIds(locale: string): Promise<Set<number> | null> {
  favoriteIds ??= fetch(`/api/account/favorites?locale=${locale}`)
    .then((response) => (response.ok ? response.json() : null))
    .then((data: {items?: {id: number}[]} | null) => (data ? new Set((data.items ?? []).map((item) => item.id)) : null))
    .catch(() => null);
  return favoriteIds;
}

export function storeFavoriteIds(ids: Set<number>) {
  favoriteIds = Promise.resolve(ids);
}
