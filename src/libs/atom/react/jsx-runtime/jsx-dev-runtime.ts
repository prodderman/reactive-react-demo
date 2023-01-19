import jsxRuntime from 'react/jsx-dev-runtime';

import { wrapJsx } from '../wrap-jsx';
import type { JSXInternal } from '../types/jsx';

export function jsx(type: any, props?: any, ...rest: any[]) {
  return wrapJsx((jsxRuntime as any).jsx)(type, props, ...rest);
}

export function jsxs(type: any, props?: any, ...rest: any[]) {
  return wrapJsx((jsxRuntime as any).jsxs)(type, props, ...rest);
}

export function jsxDEV(type: any, props?: any, ...rest: any[]) {
  return wrapJsx((jsxRuntime as any).jsxDEV)(type, props, ...rest);
}

export type { JSXInternal as JSX };
