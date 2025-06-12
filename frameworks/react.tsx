import React, { createElement, useState, useEffect } from 'react';
import legendSymbol from '../src/index';
import { cache, loadImage, loadJson } from '../src/util';
import { RenderElement } from '../src/types';
import { LayerSpecification, SpriteSpecification } from '@maplibre/maplibre-gl-style-spec';

interface LegendSymbolProps {
  sprite?: string;
  zoom: number;
  layer: LayerSpecification;
  transformRequest?: (url: string) => { url: string; [key: string]: any };
}

function attrReplace(attrs: { [key: string]: any }): { [key: string]: any } {
  const out: { [key: string]: any } = {};
  Object.entries(attrs).forEach(([k, v]) => {
    k = k.replace(/-./g, (i) => {
      return i.slice(1).toUpperCase();
    });
    out[k] = v;
  });
  return out;
}

function asReact(tree: RenderElement | null): React.ReactElement | null {
  if (!tree) {
    console.log("null tree");
    return null;
  }
  console.log('Converting tree:', tree);
  const result = createElement(
    tree.element,
    attrReplace(tree.attributes),
    (tree.children ? tree.children.map(asReact) : undefined)
  );
  console.log('Result:', result);
  return result;
}

const transformRequestFallback = (url: string) => {
  return { url: url };
};

export default function LegendSymbolComponent(props: LegendSymbolProps): React.ReactElement | null {
  console.log("LegendSymbolComponent", props);
  const { zoom, layer } = props;
  const spriteUrl = props.sprite;
  const [sprite, setSprite] = useState<SpriteSpecification | null>(null);

  const transformRequest = props.transformRequest || transformRequestFallback;

  useEffect(() => {
    let promise;
    if (spriteUrl) {
      const fetchObj = transformRequest(spriteUrl);
      const existing = cache.fetch(fetchObj.url);
      if (existing) {
        existing.then(([image, json]: [HTMLImageElement, any]) => {
          setSprite({
            image,
            json
          } as unknown as SpriteSpecification);
        });
      }
      else {
        promise = Promise.all([
          loadImage(spriteUrl + '@2x.png', { transformRequest }),
          loadJson(spriteUrl + '.json', { transformRequest }),
        ]);
        cache.add(spriteUrl, promise);
        promise.then(([image, json]: [HTMLImageElement, any]) => {
          setSprite({
            image,
            json
          } as unknown as SpriteSpecification);
        });

        return () => {
          cache.release(spriteUrl);
        }
      }
    }
  }, [spriteUrl, transformRequest]);

  const tree = legendSymbol({ sprite: sprite || undefined, zoom, layer });
  console.log('legendSymbol returned:', tree);
  console.log('tree type:', typeof tree);
  console.log('tree keys:', tree ? Object.keys(tree) : 'null');
  return asReact(tree);
}