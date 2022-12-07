<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=solid-jotai&background=tiles&project=%20" alt="solid-jotai">
</p>

# solid-jotai

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)

Primitive and flexible state management for Solid based on [Jotai](https://github.com/pmndrs/jotai).

## Quick start

Install it:

```bash
pnpm add jotai solid-jotai
```

Use it:

```tsx
import { atom, useAtom } from 'solid-jotai'

const countAtom = atom(0)

function Counter() {
  const [count, setCount] = useAtom(countAtom)
  return (
    <div>
      <h1>{count()}</h1>
      <button onClick={() => setCount(c => c + 1)}>one up</button>
    </div>
  )
}
```

## Atom

An atom represents a piece of state. All you need is to specify an initial value, which can be primitive values like strings and numbers, objects and arrays. You can create as many primitive atoms as you want.

```ts
import { atom } from 'solid-jotai'

const countAtom = atom(0)
const countryAtom = atom('Japan')
const citiesAtom = atom(['Tokyo', 'Kyoto', 'Osaka'])
const mangaAtom = atom({ 'Dragon Ball': 1984, 'One Piece': 1997, 'Naruto': 1999 })

// Derived atom
const doubledCountAtom = atom(get => get(countAtom) * 2)
```

## Suspense

You can make the read function an async function and use [`<Suspense />`](https://www.solidjs.com/docs/latest/api#suspense):

```tsx
const urlAtom = atom('https://jsonplaceholder.typicode.com/todos')
const fetchUrlAtom = atom(
  async (get) => {
    const response = await fetch(get(urlAtom))
    return await response.json()
  }
)

function TodoList() {
  const [json] = useAtom(fetchUrlAtom)
  // json is a resource so loading, status
  // and error props are available
  return <div>{JSON.stringify(json())}</div>
}

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <TodoList />
    </Suspense>
  )
}
```

Read more about [Jotai](https://github.com/pmndrs/jotai) here.

## License

MIT
