import { render, waitFor } from '@solidjs/testing-library'
import { it } from 'vitest'
import { atom, createStore, Provider, useAtom } from '../src'

it('uses initial values from provider', async () => {
  const countAtom = atom(1)
  const petAtom = atom('cat')

  const Display = () => {
    const [count] = useAtom(countAtom)
    const [pet] = useAtom(petAtom)

    return (
      <>
        <p>
          count:
          {count()}
        </p>
        <p>
          pet:
          {pet()}
        </p>
      </>
    )
  }

  const store = createStore()
  store.set(countAtom, 0)
  store.set(petAtom, 'dog')

  const { getByText } = render(() => (
    <Provider store={store}>
      <Display />
    </Provider>
  ))

  await waitFor(() => {
    getByText('count: 0')
    getByText('pet: dog')
  })
})

it('only uses initial value from provider for specific atom', async () => {
  const countAtom = atom(1)
  const petAtom = atom('cat')

  const Display = () => {
    const [count] = useAtom(countAtom)
    const [pet] = useAtom(petAtom)

    return (
      <>
        <p>
          count:
          {count()}
        </p>
        <p>
          pet:
          {pet()}
        </p>
      </>
    )
  }

  const store = createStore()
  store.set(petAtom, 'dog')

  const { getByText } = render(() => (
    <Provider store={store}>
      <Display />
    </Provider>
  ))

  await waitFor(() => {
    getByText('count: 1')
    getByText('pet: dog')
  })
})

it('renders correctly without children', () => {
  render(() => <Provider />)
})
