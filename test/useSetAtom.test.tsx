import type { Component, JSX } from 'solid-js'
import { fireEvent, render, waitFor } from '@solidjs/testing-library'
import { it } from 'vitest'
import { atom, useAtomValue, useSetAtom } from '../src'

it('useSetAtom with write without an argument', async () => {
  const countAtom = atom(0)
  const incrementCountAtom = atom(null, (get, set) =>
    set(countAtom, get(countAtom) + 1))

  const Button: Component<{ cb: () => void, children: JSX.Element }> = props => (
    <button onClick={props.cb}>{props.children}</button>
  )

  const Displayer = () => {
    const count = useAtomValue(countAtom)
    return (
      <div>
        count:
        {count()}
      </div>
    )
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
