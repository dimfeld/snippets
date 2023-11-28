import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { derived } from 'svelte/store';

export type QsValue = string | number | boolean | null | string[] | number[];

export interface GotoOptions {
  replaceState?: boolean;
  noScroll?: boolean;
  keepFocus?: boolean;
  invalidateAll?: boolean;
  state?: any;
}

export function updateSearchParams(
  searchParams: URLSearchParams,
  input: URLSearchParams | Record<string, QsValue>
) {
  let iterator = input instanceof URLSearchParams ? input.entries() : Object.entries(input);
  for (let [key, value] of iterator) {
    if (Array.isArray(value)) {
      searchParams.set(key, value[0].toString());
      for (let v of value.slice(1)) {
        searchParams.append(key, v.toString());
      }
    } else if (value === null) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value.toString());
    }
  }

  searchParams.sort();
  return searchParams;
}

export function queryStringStore() {
  return derived(page, (p) => {
    return {
      set(params: URLSearchParams | Record<string, QsValue>, options?: GotoOptions) {
        let qs: string;
        if (params instanceof URLSearchParams) {
          params.sort();
          qs = params.toString();
        } else {
          let newQuery = new URLSearchParams();
          updateSearchParams(newQuery, params);
          qs = newQuery.toString();
        }
        goto('?' + qs.toString(), options);
      },
      update(params: URLSearchParams | Record<string, QsValue>, options?: GotoOptions) {
        let newQuery = new URLSearchParams(p.query);
        updateSearchParams(newQuery, params);
        goto('?' + newQuery.toString(), options);
      },
    };
  });
}
