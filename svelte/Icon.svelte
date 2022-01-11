<script lang="ts">
  import type { Icon } from './icons';

  let classNames = 'inline';
  export { classNames as class };
  export let sizeClasses : string|undefined = undefined;
  export let viewBox : string | undefined = undefined;
  export let fill : string | undefined = undefined;
  export let stroke: string | undefined = undefined;
  export let icon: string | Icon;

  $: iconContents = typeof icon === 'object' ? icon.icon : icon;
  $: finalFill = fill ?? (icon as Icon)?.fill ?? 'currentColor';
  $: finalStroke = stroke ?? (icon as Icon)?.stroke;
  $: finalViewBox = viewBox ?? (icon as Icon)?.viewBox ?? '0 0 20 20';
  $: finalClassNames = `${sizeClasses ?? (icon as Icon)?.sizeClasses ?? ''} ${classNames}`
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  class={finalClassNames}
  fill={finalFill}
  stroke={finalStroke}
  viewBox={finalViewBox}
  {...$$restProps}
>
  {@html iconContents}
</svg>
