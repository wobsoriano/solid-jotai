import { fireEvent, render } from '@solidjs/testing-library'
import { it } from 'vitest'
import { atom, useAtomValue, useSetAtom } from '../src'

it('useAtomValue basic test', async () => {
  const countAtom = atom(0)

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

  await findByText('count: 0')

  fireEvent.click(getByText('dispatch'))

  await findByText('count: 1')
})
