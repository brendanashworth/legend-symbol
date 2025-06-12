import React from 'react';
import { LayerSpecification } from '@maplibre/maplibre-gl-style-spec';
interface LegendSymbolProps {
    sprite?: string;
    zoom: number;
    layer: LayerSpecification;
    transformRequest?: (url: string) => {
        url: string;
        [key: string]: any;
    };
}
export default function LegendSymbolComponent(props: LegendSymbolProps): React.ReactElement | null;
export {};
//# sourceMappingURL=react.d.ts.map