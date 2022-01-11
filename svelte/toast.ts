import { derived, Readable } from 'svelte/store';
import { SvelteToastOptions, toast } from '@zerodevx/svelte-toast';

export function create(message: string, theme: object, options?: SvelteToastOptions) {
  toast.push(message, {
    ...(options ?? {}),
    theme: {
      ...theme,
      ...(options?.theme ?? {}),
    },
  });
}

const themes = {
  success: {
    light: {
      background: '#dcfce7',
      text: '#3f6212',
    },
    dark: {
      background: '#3f6212',
      text: '#dcfce7',
    },
  },
  warning: {
    light: {
      background: 'rgb(255, 251, 235)',
      text: 'rgb(180, 83, 9)',
    },
    dark: {
      background: 'rgb(180, 83, 9)',
      text: 'rgb(255, 251, 235)',
    },
  },
  error: {
    light: {
      background: '#fef2f2',
      text: 'rgb(185, 28, 28)',
    },
    dark: {
      background: 'rgb(185, 28, 28)',
      text: '#fef2f2',
    },
  },
};

export interface Toasts {
  success(message: string): void;
  warning(message: string): void;
  error(message: string): void;
}

export type ToastStore = Readable<Toasts>;

export interface FromResponseOptions {
  response: Response;
  success?: string;
  error?: string;
}

export function toastStore(darkModeStore: Readable<boolean>): ToastStore {
  return derived(darkModeStore, (dark) => {
    function theme(type: keyof typeof themes) {
      const style = dark ? 'dark' : 'light';
      const colors = themes[type][style];

      return {
        '--toastBackground': colors.background,
        '--toastColor': colors.text,
      };
    }

    return {
      success: (message: string) => create(message, theme('success')),
      warning: (message: string) => create(message, theme('warning')),
      error: (message: string) => create(message, theme('error')),
      async fromResponse({ response, success, error }: FromResponseOptions) {
        if (response.ok) {
          this.success(success ?? 'Success!');
        } else {
          if (!error) {
            let resText = await response.text();
            try {
              error = JSON.parse(resText)?.message ?? resText;
            } catch (e) {
              error = resText;
            }
          }
          this.error(error ?? (await response.text()));
        }
      },
    };
  });
}
