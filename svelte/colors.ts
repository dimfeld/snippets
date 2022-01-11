import * as d3 from 'd3';

export function randomColor() {
  let h = Math.floor(Math.random() * 360);
  let s = 0.3 + Math.random() * 0.7;
  let l = 0.3 + Math.random() * 0.5;

  return d3.hsl(h, s, l).rgb().formatHex();
}

export function contrastingColor(color: d3.LabColor) {
  const MIN_DIFF = 50;
  const MAX_DIFF = 90;

  let l = color.l;
  let output = 100 - l;
  let contrast = Math.abs(l - output);
  let hoverBgColor: d3.LabColor;
  let textColor: d3.LabColor;
  let hoverTextColor: d3.LabColor;

  const k = Math.min(0.75, Math.max(contrast / 100, 0.25));

  if (l < output) {
    if (contrast < MIN_DIFF) {
      output = l + MIN_DIFF;
    } else if (contrast > MAX_DIFF) {
      output = l + MAX_DIFF;
    }

    textColor = d3.lab(output, color.a, color.b);
    hoverTextColor = textColor.brighter(k);
    hoverBgColor = color.brighter(k);
  } else {
    if (contrast < MIN_DIFF) {
      output = l - MIN_DIFF;
    } else if (contrast > MAX_DIFF) {
      output = l - MAX_DIFF;
    }

    textColor = d3.lab(output, color.a, color.b);
    hoverTextColor = textColor.darker(k);
    hoverBgColor = color.darker(k);
  }

  return {
    textColor: textColor.rgb().toString(),
    bgColor: color.rgb().toString(),
    hoverTextColor: hoverTextColor.rgb().toString(),
    hoverBgColor: hoverBgColor.rgb().toString(),
  };
}
