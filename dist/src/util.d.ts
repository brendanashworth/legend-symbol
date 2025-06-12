import { ExpressionContext, ExpressionHandler, TransformRequestOptions } from './types';
export declare function exprHandler({ zoom }: ExpressionContext): ExpressionHandler;
export declare function mapImageToDataURL(map: any, icon: string): string | undefined;
export declare const cache: {
    add: (key: string, value: any) => void;
    fetch: (key: string) => any;
    release: (key: string) => void;
};
export declare function loadImage(url: string, { transformRequest }: TransformRequestOptions): Promise<HTMLImageElement>;
export declare function loadJson(url: string, { transformRequest }: TransformRequestOptions): Promise<any>;
//# sourceMappingURL=util.d.ts.map