interface CacheEntry {
  response?: any;
  fetch?: Promise<any>;
}

const singleCacheEntry: CacheEntry = {
  response: undefined,
  fetch: undefined,
};

export function createResource(fetch: () => Promise<any>) {
  if (singleCacheEntry.response) {
    return singleCacheEntry.response;
  }

  throw (singleCacheEntry.fetch = fetch()
    .then(response => response.json())
    .then(response => (singleCacheEntry.response = response)));
}
