import type { Component } from 'solid-js'
import { Suspense } from 'solid-js'
import { atom } from 'jotai/vanilla'
import { useAtom } from '../src'

const urlAtom = atom('https://jsonplaceholder.typicode.com/todos/1')
const fetchUrlAtom = atom(
  async (get) => {
    const response = await fetch(get(urlAtom))
    return response.json()
  },
)

const randomNumberAtom = atom(0)
const fetchRandomNumberAtom = atom(
  get => get(randomNumberAtom),
  async (_get, set, url: string) => {
    const response = await fetch(url)
    set(randomNumberAtom, (await response.json())[0])
  },
)

const Fetcher: Component = () => {
  const [json, compute] = useAtom(fetchRandomNumberAtom)
  // const [json] = useAtom(fetchUrlAtom)
  return (
    <div>
      {JSON.stringify(json())}
      <button onClick={() => compute('https://www.randomnumberapi.com/api/v1.0/random')}>compute</button>
    </div>
  )
}

const App: Component = () => {
  return (
    <div>
      <Fetcher />
    </div>
  )
}

export default App
