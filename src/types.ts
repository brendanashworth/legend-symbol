export interface StyleSpec {
  [key: string]: any;
}

// Re-export MapLibre GL types
import type { LayerSpecification, SpriteSpecification } from '@maplibre/maplibre-gl-style-spec';


export interface SpriteDimensions {
  x: number;
  y: number;
  width: number;
  height: number;
  pixelRatio?: number;
}

export interface ExpressionContext {
  zoom: number;
}

export type ExpressionHandler = (layer: LayerSpecification, type: 'layout' | 'paint', prop: string) => any;

export interface RendererProps {
  layer: LayerSpecification;
  expr: ExpressionHandler;
  image: (imgKey: string) => string | null;
}

export interface RenderElement {
  element: string;
  attributes: { [key: string]: any };
  children?: RenderElement[];
}

export interface LegendSymbolOptions {
  sprite?: SpriteSpecification;
  zoom: number;
  layer: LayerSpecification;
}

export interface TransformRequestOptions {
  transformRequest: (url: string) => { [key: string]: any };
}

export interface CacheObject {
  value: any;
  count: number;
}

export interface CancellablePromise<T> extends Promise<T> {
  cancel: () => void;
}