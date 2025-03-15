import type { Component, JSX } from 'solid-js'
import { createStore, getDefaultStore } from 'jotai/vanilla'
import { createContext, useContext } from 'solid-js'

type Store = ReturnType<typeof createStore>

const StoreContext = createContext<Store | undefined>(undefined)

interface Options {
  store?: Store
  children?: JSX.Element
}

export function useStore(options?: Options) {
  const store = useContext(StoreContext)
  return options?.store || store || getDefaultStore()
}

export const Provider: Component<Options> = (props) => {
  let storeRef

  if (!props.store && !storeRef)
    storeRef = createStore()

  return (
    <StoreContext.Provider value={props.store || storeRef}>
      {props.children}
    </StoreContext.Provider>
  )
}
