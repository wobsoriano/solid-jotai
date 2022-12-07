import type {
  Atom,
  ExtractAtomArgs,
  ExtractAtomResult,
  ExtractAtomValue,
  WritableAtom,
} from 'jotai/vanilla'
import type { Accessor } from 'solid-js'
import { useAtomValue } from './useAtomValue'
import { useSetAtom } from './useSetAtom'

type SetAtom<Args extends unknown[], Result> = (...args: Args) => Result

type Options = Parameters<typeof useAtomValue>[1]

export function useAtom<Value, Args extends unknown[], Result>(
  atom: WritableAtom<Value, Args, Result>,
  options?: Options
): [Accessor<Awaited<Value>>, SetAtom<Args, Result>]

export function useAtom<Value>(
  atom: Atom<Value>,
  options?: Options
): [Accessor<Awaited<Value>>, never]

export function useAtom<
  AtomType extends WritableAtom<unknown, unknown[], unknown>,
>(
  atom: AtomType,
  options?: Options
): [
  Accessor<Awaited<ExtractAtomValue<AtomType>>>,
  SetAtom<ExtractAtomArgs<AtomType>, ExtractAtomResult<AtomType>>,
]

export function useAtom<AtomType extends Atom<unknown>>(
  atom: AtomType,
  options?: Options
): [Accessor<Awaited<ExtractAtomValue<AtomType>>>, never]

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
