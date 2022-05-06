<script lang="ts">
  import Icon from './Icon.svelte';
  import { chevronDownOutline, type Icon as IconData } from './icons';
  import Button from './Button.svelte';
  import { showTippy, type Position } from './tippy';
  import { focus } from 'focus-svelte';

  export let open = false;
  export let disabled = false;
  export let position: Position = 'bottom-end';
  export let label: string | undefined = undefined;
  export let pad = true;
  export let arrow: IconData | undefined | null | false = chevronDownOutline;
  export let closeOnClickInside = true;

  let classNames = '';
  export { classNames as class };

  let dropdownButton: HTMLDivElement;

  $: open = open && !disabled;

  function clicked() {
    if (closeOnClickInside && open) {
      open = false;
    }
  }
</script>

<div class="relative inline-block text-left">
  <div
    aria-expanded={open}
    aria-haspopup="true"
    bind:this={dropdownButton}
    on:click={() => (open = !open)}
  >
    <slot name="button">
      <Button {disabled} class={classNames}>
        <div class="flex space-x-1 items-center">
          <span>{label}</span>
          {#if arrow}<Icon icon={arrow} class="w-5 h-5" />{/if}
        </div>
      </Button>
    </slot>
  </div>

  {#if open && dropdownButton}
    <div
      use:showTippy={{
        trigger: dropdownButton,
        position,
        interactive: true,
        role: 'menu',
        close: () => (open = false),
      }}
      on:click={clicked}
    >
      <div
        use:focus={{ enabled: true }}
        class:py-2={pad}
        class="rounded-md shadow-lg bg-white dark:bg-black ring-1 ring-black dark:ring-gray-200 ring-opacity-5 focus:outline-none"
      >
        <slot />
      </div>
    </div>
  {/if}
</div>
