import { Readable, writable } from 'svelte/store';

export interface LoadingStore extends Readable<boolean> {
  add(key: string): void;
  delete(key: string): void;
}

export function loadingStore(): LoadingStore {
  let loading = new Set();

  let store = writable(false);

  return {
    subscribe: store.subscribe,
    add(key: string) {
      loading.add(key);
      store.set(loading.size > 0);
    },
    delete(key: string) {
      loading.delete(key);
      store.set(loading.size > 0);
    },
  };
}
