import Circle from "./Circle";
import Fill from "./Fill";
import Line from "./Line";
import Symbol from "./Symbol";
import { exprHandler } from './util';
import { LegendSymbolOptions, RenderElement, RendererProps } from './types';
import { LayerSpecification } from '@maplibre/maplibre-gl-style-spec';

function extractPartOfImage(img: HTMLImageElement, { x, y, width, height }: { x: number; y: number; width: number; height: number }): string {
  const dpi = 2;
  const el = document.createElement('canvas');
  el.width = width * dpi;
  el.height = height * dpi;
  const ctx = el.getContext('2d')!;
  ctx.drawImage(img,
    x * dpi, y * dpi, width * dpi, height * dpi,
    0, 0, width * dpi, height * dpi
  );
  return el.toDataURL();
}

function legendSymbol({ sprite, zoom, layer }: LegendSymbolOptions): RenderElement | null {
  const TYPE_MAP: Record<LayerSpecification['type'], (props: RendererProps) => RenderElement | null> = {
    "circle": Circle,
    "symbol": Symbol,
    "line": Line,
    "fill": Fill,
    "background": () => null,
    "heatmap": () => null,
    "fill-extrusion": () => null,
    "raster": () => null,
    "hillshade": () => null,
    "color-relief": () => null,
  };

  const handler = TYPE_MAP[layer.type];
  const expr = exprHandler({ zoom });
  const image = (imgKey: string): string | null => {
    // if (sprite && sprite.json) {
    //   const dimensions = sprite.json[imgKey];
    //   if (dimensions) {
    //     return extractPartOfImage(sprite.image, dimensions);
    //   }
    // }
    return null;
  };

  if (handler) {
    return handler({ layer, expr, image });
  }
  else {
    return null;
  }
}

export { legendSymbol as default, Circle, Fill, Line, Symbol };
export * from './types';
export * from './util';