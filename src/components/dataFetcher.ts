interface CacheEntry<T> {
  response: T;
  fetch: Promise<Response>;
}

const cache: { [key: string]: CacheEntry<any> } = {};

export function createResource<T>(fetch: Promise<Response>, key: string): T {
  let cachedItem = cache[key];

  if (cachedItem && cachedItem.response) {
    return cachedItem.response;
  }

  cache[key] = {
    fetch: fetch
      .then(response => response.json())
      .then(response => (cache[key].response = response)),
    response: undefined,
  };

  throw fetch;
}
