import { isProperty } from '../core/property';
import { ProxyTag } from './proxy-tag';

export function wrapJsx<T>(jsx: T): T {
  if (typeof jsx !== 'function') return jsx;

  return function (type: any, props: any, ...rest: any[]) {
    if (typeof type === 'string' && props) {
      let reactive = false;
      for (const key in props) {
        const prop = props[key];
        if (key === 'children' && Array.isArray(prop)) {
          for (let idx = 0; idx < prop.length; idx++) {
            const child = prop[idx];
            if (isProperty(child)) {
              reactive = true;
              break;
            }
          }
        } else if (isProperty(prop)) {
          reactive = true;
          break;
        }
      }

      if (reactive) {
        props['@@tag'] = type;
        return jsx.call(jsx, ProxyTag, props, type);
      }
    }
    return jsx.call(jsx, type, props, ...rest);
  } as any as T;
}
