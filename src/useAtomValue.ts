import type { Atom, ExtractAtomValue } from 'jotai/vanilla'
import { createResource, onCleanup } from 'solid-js'
import { createDeepSignal } from './createDeepSignal'
import { useStore } from './Provider'
import type { AwaitedAccessorOrResource } from './useAtom'

function isPromise(x: unknown): x is Promise<unknown> {
  return x instanceof Promise
}

type Store = ReturnType<typeof useStore>

interface Options {
  store?: Store
  // delay?: number
}

export function useAtomValue<Value>(
  atom: Atom<Value>,
  options?: Options
): AwaitedAccessorOrResource<Value>

export function useAtomValue<AtomType extends Atom<unknown>>(
  atom: AtomType,
  options?: Options
): AwaitedAccessorOrResource<ExtractAtomValue<AtomType>>

export function useAtomValue<Value>(atom: Atom<Value>, options?: Options) {
  const store = useStore(options)
  const initial = store.get(atom)

  if (isPromise(initial)) {
    const [atomValue, { refetch }] = createResource(() => store.get(atom), { storage: createDeepSignal })

    const unsub = store.sub(atom, () => refetch())

    onCleanup(() => unsub())

    return atomValue
  }

  const [atomValue, setAtomValue] = createDeepSignal(initial)

  const unsub = store.sub(atom, () => {
    const nextValue = store.get(atom)
    setAtomValue(() => nextValue)
  })

  onCleanup(() => unsub())

  return atomValue
}
