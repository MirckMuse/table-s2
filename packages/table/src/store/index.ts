export type StoreKey = any;

export class Store {
  private store = new Map<StoreKey, unknown>()

  set<T extends StoreKey>(key: T, value: StoreKey[T]) {
    return this.store.set(key, value)
  }

  public get<T extends StoreKey>(
    key: T,
    defaultValue?: StoreKey[T],
  ): StoreKey[T] {
    const value = this.store.get(key);

    return (value as StoreKey[T]) ?? defaultValue;
  }

  public clear() {
    this.store.clear();
  }

  public size() {
    return this.store.size;
  }
}