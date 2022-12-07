import type { Component, JSX } from 'solid-js'
import { createContext, useContext } from 'solid-js'
import { createStore, getDefaultStore } from 'jotai/vanilla'

type Store = ReturnType<typeof createStore>

const StoreContext = createContext<Store | undefined>(undefined)

interface Options {
  store?: Store
  children?: JSX.Element
}

export const useStore = (options?: Options) => {
  const store = useContext(StoreContext)
  return options?.store || store || getDefaultStore()
}

export const Provider: Component<Options> = (props) => {
  const storeRef = props.store || createStore()
  return (
    <StoreContext.Provider value={storeRef}>
      {props.children}
    </StoreContext.Provider>
  )
}
