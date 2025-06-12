import {
  expression,
  latest,
  function as styleFunction
} from '@maplibre/maplibre-gl-style-spec';

import {
  ExpressionContext,
  ExpressionHandler,
  TransformRequestOptions,
  CacheObject,
  CancellablePromise
} from './types';
import { LayerSpecification } from '@maplibre/maplibre-gl-style-spec';

const PROP_MAP: [string, string?][] = [
  ["background"],
  ["circle"],
  ["fill-extrusion"],
  ["fill"],
  ["heatmap"],
  ["hillshade"],
  ["line"],
  ["raster"],
  ["icon", "symbol"],
  ["text", "symbol"],
];

export function exprHandler({ zoom }: ExpressionContext): ExpressionHandler {
  function prefixFromProp(prop: string): string | null {
    const out = PROP_MAP.find(def => {
      const type = def[0];
      return prop.startsWith(type);
    });
    return out ? (out[1] || out[0]) : null;
  }

  return function (layer: LayerSpecification & { [key: string]: any }, type: 'layout' | 'paint', prop: string): any {
    const prefix = prefixFromProp(prop);
    const specItem = (latest as any)[`${type}_${prefix}`][prop];
    const dflt = specItem.default;

    if (!layer[type]) {
      return dflt;
    }

    const input = (layer[type] as Record<string, any>)[prop];

    const objType = typeof(input);
    if (objType === "undefined") {
      return specItem.default;
    }
    else if (typeof(input) === "object") {
      let expr: any;
      if (Array.isArray(input)) {
        if (specItem.type === "array") {
          return input;
        }
        else {
          expr = expression.createExpression(input).value;
        }
      }
      else {
        expr = styleFunction.createFunction(input, specItem);
      }
      if (!expr.evaluate) {
        return null;
      }

      const result = expr.evaluate({ zoom }, {});
      if (result) {
        return (result.name || result);
      }
      else {
        return null;
      }
    }
    else {
      return input;
    }
  }
}

export function mapImageToDataURL(map: any, icon: string): string | undefined {
  if (!icon) {
    return undefined;
  }

  const image = map.style.imageManager.images[icon];
  if (!image) {
    return undefined;
  }

  const canvasEl = document.createElement("canvas");
  canvasEl.width = image.data.width;
  canvasEl.height = image.data.height;
  const ctx = canvasEl.getContext("2d")!;
  ctx.putImageData(
    new ImageData(
      Uint8ClampedArray.from(image.data.data),
      image.data.width, image.data.height
    ),
    0, 0
  );

  return canvasEl.toDataURL();
}

const dataStore = new Map<string, CacheObject>();

export const cache = {
  add: (key: string, value: any): void => {
    if (dataStore.has(key)) {
      throw new Error(`Cache already contains '${key}'`);
    }
    dataStore.set(key, {
      value,
      count: 1
    });
  },
  fetch: (key: string): any => {
    const cacheObj = dataStore.get(key);
    if (cacheObj) {
      cacheObj.count++;
      return cacheObj.value;
    }
  },
  release: (key: string): void => {
    const cacheObj = dataStore.get(key);
    if (!cacheObj) {
      throw new Error(`No such key in cache '${key}'`);
    }
    cacheObj.count--;

    if (cacheObj.count === 0) {
      dataStore.delete(key);
    }
  },
};

function loadImageViaTag(url: string): CancellablePromise<HTMLImageElement> {
  let cancelled = false;
  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      if (!cancelled) resolve(img);
    }
    img.onerror = e => {
      if (!cancelled) reject(e);
    };
    img.src = url;
  }) as CancellablePromise<HTMLImageElement>;
  
  promise.cancel = () => {
    cancelled = true;
  }
  return promise;
}

function removeUrl(obj: Record<string, any>): Record<string, any> {
  obj = { ...obj };
  delete obj['url'];
  return obj;
}

function loadImageViaFetch(url: string, init: RequestInit): Promise<HTMLImageElement> {
  return fetch(url, init)
    .then(res => res.blob())
    .then(blob => URL.createObjectURL(blob))
    .then(url => loadImageViaTag(url));
}

export function loadImage(url: string, { transformRequest }: TransformRequestOptions): Promise<HTMLImageElement> {
  const fetchObj = { ...transformRequest(url) };

  if (fetchObj.headers) {
    return loadImageViaFetch(url, removeUrl(fetchObj));
  }
  else {
    return loadImageViaTag(url);
  }
}

export function loadJson(url: string, { transformRequest }: TransformRequestOptions): Promise<any> {
  const fetchObj = { ...transformRequest(url) };
  return fetch(fetchObj.url, removeUrl(fetchObj)).then(res => res.json());
}