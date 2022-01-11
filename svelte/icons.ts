export interface Icon {
  fill?: string;
  stroke?: string;
  icon: string;
  viewBox: string;
  sizeClasses: string;
}

const solidSizeClasses = "h-5 w-5";
const heroiconsSolidViewBox = "0 0 20 20";
const outlineSizeClasses = "h-6 w-6";
const heroiconsOutlineViewBox = "0 0 24 24";

export const checkSolid: Icon = {
  sizeClasses: solidSizeClasses,
  viewBox: heroiconsSolidViewBox,
  icon: ` <path
   fill-rule="evenodd"
   d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
   clip-rule="evenodd"
 />`,
};

export const chevronDownOutline: Icon = {
  sizeClasses: outlineSizeClasses,
  viewBox: heroiconsOutlineViewBox,
  icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />`,
  fill: 'none',
  stroke: 'currentColor',
};

export const chevronRightOutline: Icon = {
  sizeClasses: outlineSizeClasses,
  viewBox: heroiconsOutlineViewBox,
  icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />`,
  fill: 'none',
  stroke: 'currentColor',
};

export const pencilSolid: Icon= {
  sizeClasses: solidSizeClasses,
  viewBox: heroiconsSolidViewBox,
  icon: `<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />`,
  stroke: 'currentColor',
}

export const plusSolid: Icon = {
  sizeClasses: solidSizeClasses,
  viewBox: heroiconsSolidViewBox,
  icon: ` <path
     fill-rule="evenodd"
     d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
     clip-rule="evenodd"
     />`
}

export const xSolid: Icon = {
  sizeClasses: solidSizeClasses,
  viewBox: heroiconsSolidViewBox,
  icon: `<path
     fill-rule="evenodd"
     d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
     clip-rule="evenodd"
   />`
}
