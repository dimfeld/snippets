import { Readable, writable } from 'svelte/store';

export interface LoadingStore extends Readable<boolean> {
  add(key: string|Symbol): void;
  delete(key: string|Symbol): void;
}

/** A store used to track multiple parallel operations and return true if any of them are active */
export function loadingStore(): LoadingStore {
  let loading = new Set();

  let store = writable(false);

  return {
    subscribe: store.subscribe,
    add(key: string|Symbol) {
      loading.add(key);
      store.set(loading.size > 0);
    },
    delete(key: string|Symbol) {
      loading.delete(key);
      store.set(loading.size > 0);
    },
  };
}
