import { createElement, useState, useEffect } from 'react';
import legendSymbol from '../src/index';
import { cache, loadImage, loadJson } from '../src/util';
function attrReplace(attrs) {
    const out = {};
    Object.entries(attrs).forEach(([k, v]) => {
        k = k.replace(/-./g, (i) => {
            return i.slice(1).toUpperCase();
        });
        out[k] = v;
    });
    return out;
}
function asReact(tree) {
    if (!tree) {
        console.log("null tree");
        return null;
    }
    console.log('Converting tree:', tree);
    const result = createElement(tree.element, attrReplace(tree.attributes), (tree.children ? tree.children.map(asReact) : undefined));
    console.log('Result:', result);
    return result;
}
const transformRequestFallback = (url) => {
    return { url: url };
};
export default function LegendSymbolComponent(props) {
    console.log("LegendSymbolComponent", props);
    const { zoom, layer } = props;
    const spriteUrl = props.sprite;
    const [sprite, setSprite] = useState(null);
    const transformRequest = props.transformRequest || transformRequestFallback;
    useEffect(() => {
        let promise;
        if (spriteUrl) {
            const fetchObj = transformRequest(spriteUrl);
            const existing = cache.fetch(fetchObj.url);
            if (existing) {
                existing.then(([image, json]) => {
                    setSprite({
                        image,
                        json
                    });
                });
            }
            else {
                promise = Promise.all([
                    loadImage(spriteUrl + '@2x.png', { transformRequest }),
                    loadJson(spriteUrl + '.json', { transformRequest }),
                ]);
                cache.add(spriteUrl, promise);
                promise.then(([image, json]) => {
                    setSprite({
                        image,
                        json
                    });
                });
                return () => {
                    cache.release(spriteUrl);
                };
            }
        }
    }, [spriteUrl, transformRequest]);
    const tree = legendSymbol({ sprite: sprite || undefined, zoom, layer });
    console.log('legendSymbol returned:', tree);
    console.log('tree type:', typeof tree);
    console.log('tree keys:', tree ? Object.keys(tree) : 'null');
    return asReact(tree);
}
