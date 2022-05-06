import tippy, { type Plugin } from 'tippy.js/headless';

export type Position =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'auto'
  | 'auto-start'
  | 'auto-end';

export interface TippyOptions {
  trigger?: HTMLElement;
  position: Position;
  fixed?: boolean;
  interactive?: boolean;
  role?: string;
  closeOnEsc?: boolean;
  close?: () => void;
}

export function showTippy(
  node: HTMLDivElement,
  {
    trigger,
    position,
    fixed,
    interactive,
    role,
    close,
    closeOnEsc = true,
  }: TippyOptions
) {
  let tippyInstance = tippy(trigger ?? node.parentElement ?? node, {
    interactive: interactive ?? false,
    animation: false,
    hideOnClick: 'toggle',
    trigger: 'manual',
    maxWidth: 'none',
    placement: position,
    role,
    plugins: [closeOnEsc ? closeOnEscPlugin : null].filter(Boolean) as Plugin[],
    showOnCreate: true,
    popperOptions: {
      strategy: fixed ? 'fixed' : 'absolute',
      modifiers: [{ name: 'flip' }, { name: 'preventOverflow' }],
    },
    render(_instance) {
      return { popper: node };
    },
    onClickOutside: close,
  });

  return {
    destroy() {
      tippyInstance?.destroy();
    },
  };
}
const closeOnEscPlugin: Plugin = {
  name: 'closeOnEscPlugin',
  defaultValue: true,
  fn({ hide }) {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        hide();
      }
    }

    return {
      onShow() {
        document.addEventListener('keydown', onKeyDown);
      },
      onHide() {
        document.removeEventListener('keydown', onKeyDown);
      },
    };
  },
};
