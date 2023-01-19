import { Tick } from './clock';
import type { Observer, Observable, Subscription } from './observable';

export const propertySymbol = Symbol('property');

export interface Property<T> extends Observable<Tick> {
  readonly get: () => T;
  [propertySymbol]: (next: () => void) => () => void;
}

export const property = <A>(
  get: () => A,
  subscribe: (observer: Observer<Tick>) => Subscription
): Property<A> => ({
  get,
  subscribe,
  [propertySymbol]: (next) => {
    const subscription = subscribe({ next });
    return subscription.unsubscribe;
  },
});

export const isProperty = (entity: any): entity is Property<any> =>
  entity && typeof entity === 'object' && propertySymbol in entity;
