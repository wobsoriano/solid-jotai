// https://github.com/pmndrs/jotai/blob/main/src/react/utils/useAtomCallback.ts
import type { Getter, Setter } from 'jotai/vanilla'
import { atom, useSetAtom } from '../'

type Options = Parameters<typeof useSetAtom>[1]

export function useAtomCallback<Result, Args extends unknown[]>(
  callback: (get: Getter, set: Setter, ...arg: Args) => Result,
  options?: Options,
): (...args: Args) => Result {
  const anAtom = atom(null, (get, set, ...args: Args) => callback(get, set, ...args))
  return useSetAtom(anAtom, options)
}
