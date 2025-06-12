import { RendererProps, RenderElement } from './types';

export default function Line(props: RendererProps): RenderElement {
  const { layer, image, expr } = props;
  const linePatternDataUrl = image(
    expr(layer, "paint", "line-pattern") as string
  );

  const style = {
    stroke: linePatternDataUrl ? `url(#img1)` : expr(layer, "paint", "line-color") as string,
    strokeWidth: Math.max(2, Math.min(
      expr(layer, "paint", "line-width") as number,
      8
    )),
    strokeOpacity: expr(layer, "paint", "line-opacity") as number,
    strokeDasharray: expr(layer, "paint", "line-dasharray") as string | number[],
  };
  
  const sw = style.strokeWidth;

  return {
    element: "svg",
    attributes: {
      viewBox: "0 0 20 20",
      xmlns: "http://www.w3.org/2000/svg"
    },
    children: [
      {
        element: "defs",
        attributes: {
          key: "defs",
        },
        children: [
          {
            element: "pattern",
            attributes: {
              key: "pattern",
              id: "img1",
              x: 0,
              y: 0,
              width: style.strokeWidth,
              height: style.strokeWidth,
              patternUnits: "userSpaceOnUse",
              patternTransform: `translate(${-(sw/2)} ${-(sw/2)}) rotate(45)`
            },
            children: [
              {
                element: "image",
                attributes: {
                  key: "img",
                  xlinkHref: linePatternDataUrl,
                  x: 0,
                  y: 0,
                  width: style.strokeWidth,
                  height: style.strokeWidth,
                }
              }
            ]
          }
        ]
      },
      {
        element: "path",
        attributes: {
          key: "path",
          style: {
            stroke: style.stroke,
            strokeWidth: style.strokeWidth,
            strokeOpacity: style.strokeOpacity,
            strokeDasharray: style.strokeDasharray
          },
          d: "M0 20 L 20 0",
        }
      }
    ]
  };
}