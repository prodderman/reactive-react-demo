import { memo } from 'react';
import jsxRuntime from 'react/jsx-runtime';
import { Property } from '../core';
import { useProps } from './use-props';

interface Props {
  ['@@tag']: string;
  [key: string]: any | Property<any>;
}

const ProxyTag = memo((props: Props) => {
  const tag = props['@@tag'];
  const normalizedProps = useProps(props);
  return (jsxRuntime as any).jsxs(tag, normalizedProps, tag);
});

ProxyTag.displayName = 'ProxyTag';

export { ProxyTag };
