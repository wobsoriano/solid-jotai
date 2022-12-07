import type { Atom, ExtractAtomValue } from 'jotai/vanilla'
import type { Accessor } from 'solid-js'
import { createEffect, createResource, createSignal, onCleanup } from 'solid-js'
import { createDeepSignal } from './createDeepSignal'
import { useStore } from './Provider'
import { useAtom } from './useAtom'

const isPromise = (x: unknown): x is Promise<unknown> => x instanceof Promise

type Store = ReturnType<typeof useStore>

interface Options {
  store?: Store
  delay?: number
}

const use = <T>(
  promise: Promise<T> & {
    status?: 'pending' | 'fulfilled' | 'rejected'
    value?: T
    reason?: unknown
  },
): T => {
  if (promise.status === 'pending') {
    throw promise
  }
  else if (promise.status === 'fulfilled') {
    return promise.value as T
  }
  else if (promise.status === 'rejected') {
    throw promise.reason
  }
  else {
    promise.status = 'pending'
    promise.then(
      (v) => {
        promise.status = 'fulfilled'
        promise.value = v
      },
      (e) => {
        promise.status = 'rejected'
        promise.reason = e
      },
    )
    throw promise
  }
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
  const [val, setVal] = createSignal(9001)

  if (isPromise(initial)) {
    const [atomValue, { refetch }] = createResource(val, () => initial as any, { storage: createDeepSignal })

    store.sub(atom, () => {
      setVal(9002)
      refetch()
    })

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
