export type Predicate<T> = (value: T) => boolean;
export type ArrayPredicate<T> = (value: T, index: number, array: T[]) => boolean;

export type DistributiveOmit<T, K extends keyof T> = T extends unknown
    ? Omit<T, K>
    : never;

export type DistributivePick<T, K extends keyof T> = T extends unknown
    ? Pick<T, K>
    : never;

export type PickPartial<T, K extends keyof T> = Partial<Pick<T, K>>;

export type DistributivePickPartial<T, K extends keyof T> = T extends unknown
  ? PickPartial<T, K>
  : never;

export type SomePartial<T, K extends keyof T> = Omit<T, K> & PickPartial<T, K>;

export type DistributiveSomePartial<T, K extends keyof T> = T extends unknown
  ? SomePartial<T, K>
  : never;

export type SomeOmitSomePartial<
  T,
  Rem extends keyof T,
  Part extends keyof T
> = Omit<T, Rem | Part> & PickPartial<T, Part>;

export type DistributiveSomeOmitSomePartial<
  T,
  Rem extends keyof T,
  Part extends keyof T
> = T extends unknown ? SomeOmitSomePartial<T, Rem, Part> : never;
