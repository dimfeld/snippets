<script context="module" lang="ts">
  export type ModalOpener<DIALOGINPUT, DIALOGRESULT> = (
    data: DIALOGINPUT
  ) => Promise<DIALOGRESULT | undefined>;
  export type ModalCloser<DIALOGRESULT> = (result?: DIALOGRESULT) => void;
</script>

<script lang="ts">
  /** @component This is currently mostly taken apart, but presents a dialog which can be opened with a function call
  * and then return a Promise that resolves with some value. I've found this to be useful sometimes in simplifying modal
  * usage. */

  type DIALOGINPUT = $$Generic;
  type DIALOGRESULT = $$Generic;


  let promiseResolve: ((value?: DIALOGRESULT) => void) | undefined;
  let openInput: DIALOGINPUT;

  export function open(data: DIALOGINPUT): Promise<DIALOGRESULT | undefined> {
    if (promiseResolve) {
      // Resolve any existing promise in case something else tries to open this modal while it's already open.
      promiseResolve();
    }

    openInput = data;
    let p = new Promise<DIALOGRESULT | undefined>((resolve) => (promiseResolve = resolve));
    return p;
  }

  export function close(value?: DIALOGRESULT) {
    promiseResolve?.(value);
    promiseResolve = undefined;
  }
</script>

<slot name="opener" {open} />

{#if promiseResolve}
  <!-- TODO replace this with my new preferred way of doing modals, using shadcn-svelte or something. -->
{/if}
