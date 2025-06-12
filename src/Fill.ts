import { RendererProps, RenderElement } from './types';

export default function Fill(props: RendererProps): RenderElement {
  const { image, expr, layer } = props;
  const dataUrl = image(
    expr(layer, "paint", "fill-pattern") as string
  );

  const style: Record<string, any> = {
    width: "100%",
    height: "100%",
    backgroundImage: `url(${dataUrl})`,
    backgroundColor: expr(layer, "paint", "fill-color") as string,
    opacity: expr(layer, "paint", "fill-opacity") as number,
    backgroundSize: "66% 66%",
    backgroundPosition: "center",
  };

  return {
    element: "div",
    attributes: {
      style,
    }
  };
}