import type { Atom, ExtractAtomValue } from 'jotai/vanilla'
import type { Accessor } from 'solid-js'
import { createResource, createSignal, onCleanup } from 'solid-js'
import { createDeepSignal } from './createDeepSignal'
import { useStore } from './Provider'

const isPromise = (x: unknown): x is Promise<unknown> => x instanceof Promise

type Store = ReturnType<typeof useStore>

interface Options {
  store?: Store
  delay?: number
}

export function useAtomValue<Value>(
  atom: Atom<Value>,
  options?: Options
): Accessor<Awaited<Value>>

export function useAtomValue<AtomType extends Atom<unknown>>(
  atom: AtomType,
  options?: Options
): Accessor<Awaited<ExtractAtomValue<AtomType>>>

export function useAtomValue<Value>(atom: Atom<Value>, options?: Options) {
  const store = useStore(options)
  const initial = store.get(atom)
  const [count, setCount] = createSignal(0)

  if (isPromise(initial)) {
    const [atomValue] = createResource(count, () => store.get(atom), { storage: createDeepSignal })

    const unsub = store.sub(atom, () => {
      setCount(prev => (prev + 1))
    })

    onCleanup(unsub)

    return atomValue
  }

  const [atomValue, setAtomValue] = createDeepSignal(initial)

  const unsub = store.sub(atom, () => {
    const nextValue = store.get(atom)
    setAtomValue(() => nextValue)
  })

  onCleanup(unsub)

  return atomValue
}
