import type {
  Atom,
  ExtractAtomArgs,
  ExtractAtomResult,
  ExtractAtomValue,
  WritableAtom,
} from 'jotai/vanilla'
import type { Accessor, Resource } from 'solid-js'
import { useAtomValue } from './useAtomValue'
import { useSetAtom } from './useSetAtom'

type SetAtom<Args extends unknown[], Result> = (...args: Args) => Result

type Options = Parameters<typeof useAtomValue>[1]

export type AwaitedAccessorOrResource<Value> = Value extends PromiseLike<any> ? Resource<Awaited<Value>> : Accessor<Awaited<Value>>

export function useAtom<Value, Args extends unknown[], Result>(
  atom: WritableAtom<Value, Args, Result>,
  options?: Options
): [AwaitedAccessorOrResource<Value>, SetAtom<Args, Result>]

export function useAtom<Value>(
  atom: Atom<Value>,
  options?: Options
): [AwaitedAccessorOrResource<Value>, never]

export function useAtom<
  AtomType extends WritableAtom<unknown, unknown[], unknown>,
>(
  atom: AtomType,
  options?: Options
): [
  AwaitedAccessorOrResource<ExtractAtomValue<AtomType>>,
  SetAtom<ExtractAtomArgs<AtomType>, ExtractAtomResult<AtomType>>,
]

export function useAtom<AtomType extends Atom<unknown>>(
  atom: AtomType,
  options?: Options
): [AwaitedAccessorOrResource<ExtractAtomValue<AtomType>>, never]

export function useAtom<Value, Args extends unknown[], Result>(
  atom: Atom<Value> | WritableAtom<Value, Args, Result>,
  options?: Options,
) {
  return [
    useAtomValue(atom, options),
    // We do wrong type assertion here, which results in throwing an error.
    useSetAtom(atom as WritableAtom<Value, Args, Result>, options),
  ]
}
