interface CacheEntry {
  response: any;
  error: any;
  fetch: Promise<Response>;
}

const cache: { [key: string]: CacheEntry } = {};

export function createResource<T>(fetch: Promise<Response>, key: string): T {
  const cacheEntry = cache[key];

  if (cacheEntry) {
    if (cacheEntry.response) {
      return cacheEntry.response;
    }

    if (cacheEntry.error) {
      throw cacheEntry.error;
    }
  }

  cache[key] = {
    fetch: fetch
      .then(response => response.json())
      .then(response => (cache[key].response = response))
      .catch(error => (cache[key].error = error)),
    response: undefined,
    error: undefined,
  };

  throw fetch;
}
