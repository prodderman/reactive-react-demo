import { createElement as ReactCreateElement } from 'react';

import { wrapJsx } from './wrap-jsx';
import { JSXInternal } from './types/jsx';

export namespace RAtom {
  export import JSX = JSXInternal;

  export function createElement(type: any, props?: any, ...rest: any[]) {
    return wrapJsx(ReactCreateElement)(type, props, ...rest);
  }
}
