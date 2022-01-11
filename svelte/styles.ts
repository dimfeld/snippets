import { derived, Readable, writable, Writable } from 'svelte/store';
import { get } from 'svelte/store';
import { session } from '$app/stores';
import { browser } from '$app/env';

export enum Theme {
  Dark = 'dark',
  Light = 'light',
  System = 'system',
}

export interface DarkModeStore extends Writable<Theme> {
  resolved(): ResolvedDarkModeStore;
}
export type ResolvedDarkModeStore = Readable<boolean>;

export function createDarkStore(): DarkModeStore {
  let initialDarkMode: Theme = Theme.System;

  if (browser) {
    // Save this so that future SSR runs can render properly from the start, if the user hasn't
    // selected a preference.
    document.cookie = `defaultDarkMode=${cssDarkModePreference()};max-age=31536000`;
  }

  if (browser && 'theme' in window.localStorage) {
    initialDarkMode = window.localStorage.theme;
  } else {
    let sess = get(session);
    let { theme } = sess;
    if (theme) {
      initialDarkMode = theme;
    }
  }

  let darkModeStore = writable(initialDarkMode);

  let s = {
    ...darkModeStore,
    resolved() {
      return derived(darkModeStore, (d) => {
        if (d === Theme.System) {
          return cssDarkModePreference();
        } else {
          return d === Theme.Dark;
        }
      });
    },
    set(value: Theme) {
      localStorage.theme = value;
      document.cookie = `theme=${value};max-age=31536000`;
      darkModeStore.set(value);
    },
  };

  return s;
}

export function cssDarkModePreference() {
  if (!browser) {
    let sess = get(session);
    return sess.defaultDarkMode ?? false;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function desktopScreen() {
  return window.matchMedia('(min-width: 84rem)').matches;
}
