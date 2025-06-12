import Circle from "./Circle";
import Fill from "./Fill";
import Line from "./Line";
import Symbol from "./Symbol";
import { LegendSymbolOptions, RenderElement } from './types';
declare function legendSymbol({ sprite, zoom, layer }: LegendSymbolOptions): RenderElement | null;
export { legendSymbol as default, Circle, Fill, Line, Symbol };
export * from './types';
export * from './util';
//# sourceMappingURL=index.d.ts.map