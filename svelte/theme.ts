import { derived, type Readable, writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Cookies } from '@sveltejs/kit';
import { getContext, setContext } from 'svelte';

export type Theme = 'dark' | 'light' | 'system';
/** The theme to use when we don't have a preference and don't have a way to find it out, such as on initial server
 * load without any saved preferences. */
const SYSTEM_DEFAULT_THEME: Theme = 'light';
const THEME_COOKIE_NAME = 'theme';
const CONTEXT_KEY = 'themeStore';

export interface ThemeStore extends Writable<Theme> {
  /** A store that resolves the theme to an actual value, not 'system'. */
  resolved(): ResolvedThemeStore;
}
export type ResolvedThemeStore = Readable<Theme>;

/** Create a store for managing dark mode that persists the setting.
 * @param themeFromServer The theme that the server knows about from cookies, if applicable.
 **/
export function createDarkStore(themeFromServer?: Theme): ThemeStore {
  let initialTheme: Theme;
  if (browser) {
    // Save this so that future SSR runs can render properly from the start, if the user hasn't
    // selected a preference.
    const preference = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.cookie = `defaultDarkMode=${preference};max-age=31536000`;

    const storedTheme = window.localStorage.getItem(THEME_COOKIE_NAME) as Theme;
    if (storedTheme) {
      // Sync the cookie to the local storage value, if set.
      document.cookie = `${THEME_COOKIE_NAME}=${storedTheme};max-age=31536000`;
    }

    initialTheme = storedTheme ?? themeFromServer ?? 'system';
  } else {
    initialTheme = themeFromServer ?? 'system';
  }

  let themeStore = writable(initialTheme);

  let s: ThemeStore = {
    ...themeStore,
    resolved() {
      return derived(themeStore, (d) => {
        if (d === 'system') {
          // Calculate the best default value we can.
          if (browser) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          } else {
            // If we get here and we're on the server, then we just don't know, so choose the default.
            return SYSTEM_DEFAULT_THEME;
          }
        } else {
          // The user chose a preference, so we can use that.
          return d;
        }
      });
    },
    set(value: Theme) {
      if (browser) {
        // Save the value as having been explicitly set.
        localStorage.theme = value;
        document.cookie = `theme=${value};max-age=31536000`;
      }
      themeStore.set(value);
    },
  };

  return setContext(CONTEXT_KEY, s);
}

/** Retrieve the theme store from the context. */
export function getThemeStore(): ThemeStore {
  return getContext<ThemeStore>(CONTEXT_KEY);
}

/** When running on the server, try to get the theme from the cookies.
 * Use this in your `+layout.server.ts`. */
export function calculateThemeFromServer(cookies: Cookies): Theme {
  let saved = cookies.get(THEME_COOKIE_NAME) as Theme;
  if (saved && saved !== 'system') {
    return saved;
  }

  let defaultDarkMode = cookies.get('defaultDarkMode');
  if (defaultDarkMode) {
    return defaultDarkMode === 'true' ? 'dark' : 'light';
  }

  return 'system';
}

export function addDarkMode(node: HTMLElement, theme: Theme) {
  node.classList.toggle('dark', theme === 'dark');

  return {
    update(newTheme: Theme) {
      node.classList.toggle('dark', newTheme === 'dark');
    },
  };
}

/* To set up the dark mode support:

## +layout.server.ts

import { calculateThemeFromServer } from '$lib/theme';

export async function load({ cookies }) {
  return {
    theme: calculateThemeFromServer(cookies),
  };
}


## +layout.svelte

<script>
  import { addDarkMode, createDarkStore } from '$lib/theme';
  import '../app.pcss';

  export let data;

  const dark = createDarkStore(data.theme).resolved();
</script>

<!-- Also add it on the body so that it's applied to the background with overscroll -->
<svelte:body use:addDarkMode={$dark} />

<!-- Apply the class manually, not with the action, so that it works in SSR -->
<div id="top" class="w-full min-h-screen h-full overflow-auto" class:dark={$dark === 'dark'}>
  <slot />
</div>

## app.pcss (or the equivalent for your styling)

@layer base {
  * {
    @apply border-border;
  }
  body, #top {
    @apply bg-background text-foreground;
  }
}

## Dark mode switcher example

<script lang="ts">
  import { getDarkStore } from '$lib/theme';

  const dark = getDarkStore();
</script>

<select bind:value={$dark}>
  <option value="light">Light</option>
  <option value="dark">Dark</option>
  <option value="system">System</option>
</select>

*/
