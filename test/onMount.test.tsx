import { fireEvent, render } from '@solidjs/testing-library'
import { it } from 'vitest'
import { atom, useAtomValue, useSetAtom } from '../src'

it('onMount basic test', async () => {
  const countAtom = atom(0)
  countAtom.onMount = (set) => {
    set(1)
  }

  const Counter = () => {
    const count = useAtomValue(countAtom)
    const setCount = useSetAtom(countAtom)

    return (
      <>
        <div>count: {count()}</div>
        <button onClick={() => setCount(count() + 1)}>dispatch</button>
      </>
    )
  }

  const { findByText, getByText } = render(() => <Counter />)

  await findByText('count: 1')

  fireEvent.click(getByText('dispatch'))

  await findByText('count: 2')
})
