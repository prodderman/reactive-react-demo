import { useEffect, useState, useRef, useMemo } from 'react';
import { isProperty, Property } from '../core';
import { Tick } from '../core/clock';
import { Observer, Subscription } from '../core/observable';

type SubscriptionMap = Map<Property<any>, Subscription>;

const normalizeProps = <T>(object: Record<string, T>) => {
  const obj = {} as any;
  for (const key in object) {
    const prop = object[key];

    if (key === 'children' && Array.isArray(prop)) {
      const normalizedChildren = [];

      for (let idx = 0; idx < prop.length; idx++) {
        const child = prop[idx];
        if (isProperty(child)) {
          normalizedChildren.push(child.get());
        } else {
          normalizedChildren.push(child);
        }
      }
      obj[key] = normalizedChildren;
    } else if (key === '@@tag') {
      continue;
    } else {
      obj[key] = isProperty(prop) ? prop.get() : prop;
    }
  }
  return obj;
};

const getReactiveProps = <T>(props: Record<string, T>): Property<any>[] => {
  const reactiveProps: Property<any>[] = [];

  for (const key in props) {
    const propOrChildren = props[key];
    if (key === 'children' && Array.isArray(propOrChildren)) {
      for (let idx = 0; idx < propOrChildren.length; idx++) {
        const prop = propOrChildren[idx];
        if (isProperty(prop)) {
          reactiveProps.push(prop);
        }
      }
    } else if (isProperty(propOrChildren)) {
      reactiveProps.push(propOrChildren);
    }
  }

  return reactiveProps;
};

const subscribeToNewProps = (
  properties: Property<any>[],
  currentSubscriptionMap: SubscriptionMap,
  observer: Observer<Tick>
) => {
  for (let idx = 0; idx < properties.length; idx++) {
    const property = properties[idx];
    if (!currentSubscriptionMap.has(property)) {
      currentSubscriptionMap.set(property, property.subscribe(observer));
    }
  }
};

const unsubscribeFromOldProps = (
  properties: Property<any>[],
  currentSubscriptionMap: SubscriptionMap
) => {
  for (const [property, subscription] of currentSubscriptionMap) {
    if (!properties.includes(property)) {
      subscription.unsubscribe();
      currentSubscriptionMap.delete(property);
    }
  }
};

const unsubscribeAllProps = (currentSubscriptionMap: SubscriptionMap) => {
  for (const [, subscription] of currentSubscriptionMap) {
    subscription.unsubscribe();
  }
  currentSubscriptionMap.clear();
};

export function useProps<T>(props: Record<string, T>) {
  const subscriptionsRef = useRef<SubscriptionMap>(new Map());
  const [, forceUpdate] = useState<Tick>();

  useEffect(() => {
    const observer = { next: forceUpdate };
    const reactiveProps = getReactiveProps(props);
    unsubscribeFromOldProps(reactiveProps, subscriptionsRef.current);
    subscribeToNewProps(reactiveProps, subscriptionsRef.current, observer);
  }, [props]);

  useEffect(() => () => unsubscribeAllProps(subscriptionsRef.current), []);

  return normalizeProps(props);
}
