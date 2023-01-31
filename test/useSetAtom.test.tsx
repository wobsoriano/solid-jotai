import { render, fireEvent, waitFor } from '@solidjs/testing-library'
import { it } from 'vitest'
import { atom, useAtomValue, useSetAtom } from '../src'
import type { JSX } from 'solid-js'

it('useSetAtom with write without an argument', async () => {
  const countAtom = atom(0)
  const incrementCountAtom = atom(null, (get, set) =>
    set(countAtom, get(countAtom) + 1)
  )

  const Button = ({ cb, children }: { cb: () => void; children: JSX.Element }) => (
    <button onClick={cb}>{children}</button>
  )

  const Displayer = () => {
    const count = useAtomValue(countAtom)
    return <div>count: {count}</div>
  }

  const Updater = () => {
    const setCount = useSetAtom(incrementCountAtom)
    return <Button cb={setCount}>increment</Button>
  }

  const Parent = () => {
    return (
      <>
        <Displayer />
        <Updater />
      </>
    )
  }
  const { getByText } = render(() => <Parent />)

  await waitFor(() => {
    getByText('count: 0')
  })
  fireEvent.click(getByText('increment'))
  await waitFor(() => {
    getByText('count: 1')
  })
})
