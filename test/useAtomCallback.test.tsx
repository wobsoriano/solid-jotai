// https://github.com/pmndrs/jotai/blob/main/tests/react/utils/useAtomCallback.test.tsx
import { it } from 'vitest'
import { createEffect, createSignal } from 'solid-js'
import { fireEvent, render, waitFor } from '@solidjs/testing-library'
import { atom, useAtom } from '../src'
import { useAtomCallback } from '../src/utils'

it('useAtomCallback with get', async () => {
  const countAtom = atom(0)

  const Counter = () => {
    const [count, setCount] = useAtom(countAtom)
    return (
      <>
        <div>atom count: {count()}</div>
        <button onClick={() => setCount(c => c + 1)}>dispatch</button>
      </>
    )
  }

  const Monitor = () => {
    const [count, setCount] = createSignal(0)
    const readCount = useAtomCallback(
      (get) => {
        const currentCount = get(countAtom)
        setCount(currentCount)
        return currentCount
      },
    )
    createEffect(() => {
      const timer = setInterval(() => {
        readCount()
      }, 10)
      return () => {
        clearInterval(timer)
      }
    })
    return (
      <>
        <div>state count: {count()}</div>
      </>
    )
  }

  const Parent = () => {
    return (
      <>
        <Counter />
        <Monitor />
      </>
    )
  }

  const { findByText, getByText } = render(() => <Parent />)

  await findByText('atom count: 0')
  fireEvent.click(getByText('dispatch'))
  await waitFor(() => {
    getByText('atom count: 1')
    getByText('state count: 1')
  })
})

it('useAtomCallback with set and update', async () => {
  const countAtom = atom(0)
  const changeableAtom = atom(0)
  const Counter = () => {
    const [count, setCount] = useAtom(countAtom)
    return (
      <>
        <div>count: {count()}</div>
        <button onClick={() => setCount(c => c + 1)}>dispatch</button>
      </>
    )
  }

  const Monitor = () => {
    const [changeableCount] = useAtom(changeableAtom)
    const changeCount = useAtomCallback(
      (get, set) => {
        const currentCount = get(countAtom)
        set(changeableAtom, currentCount)
        return currentCount
      },
    )
    createEffect(() => {
      const timer = setInterval(() => {
        changeCount()
      }, 10)
      return () => {
        clearInterval(timer)
      }
    })
    return (
      <>
        <div>changeable count: {changeableCount()}</div>
      </>
    )
  }

  const Parent = () => {
    return (
      <>
        <Counter />
        <Monitor />
      </>
    )
  }

  const { findByText, getByText } = render(() => <Parent />)

  await findByText('count: 0')
  fireEvent.click(getByText('dispatch'))
  await waitFor(() => {
    getByText('count: 1')
    getByText('changeable count: 1')
  })
})

it('useAtomCallback with set and update and arg', async () => {
  const countAtom = atom(0)

  const App = () => {
    const [count] = useAtom(countAtom)
    const setCount = useAtomCallback(
      (_get, set, arg: number) => {
        set(countAtom, arg)
        return arg
      },
    )

    return (
      <div>
        <p>count: {count()}</p>
        <button onClick={() => setCount(42)}>dispatch</button>
      </div>
    )
  }

  const { findByText, getByText } = render(() => <App />)

  await findByText('count: 0')
  fireEvent.click(getByText('dispatch'))
  await waitFor(() => {
    getByText('count: 42')
  })
})

it('useAtomCallback with sync atom (#1100)', async () => {
  const countAtom = atom(0)

  const Counter = () => {
    const [count, setCount] = useAtom(countAtom)
    const readCount = useAtomCallback(get => get(countAtom))
    createEffect(() => {
      const promiseOrValue = readCount()
      if (typeof promiseOrValue !== 'number')
        throw new Error('should return number')
    })
    return (
      <>
        <div>atom count: {count()}</div>
        <button onClick={() => setCount(c => c + 1)}>dispatch</button>
      </>
    )
  }

  const { findByText, getByText } = render(() => <Counter />)

  await findByText('atom count: 0')

  fireEvent.click(getByText('dispatch'))
  await findByText('atom count: 1')
})
