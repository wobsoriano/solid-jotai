import { expect, test } from 'vitest'
import { render } from 'solid-js/web'
import { atom, useAtom } from '../src'

test('should function correct when rendering in solid', () => {
  const div = document.createElement('div')
  const countAtom = atom(0)
  const doubledCountAtom = atom(get => get(countAtom) * 2)

  render(() => {
    const [count, setCount] = useAtom(countAtom)
    const [doubled] = useAtom(doubledCountAtom)

    function increase() {
      setCount(prev => prev + 1)
    }

    expect(count()).toBe(0)
    increase()
    increase()
    increase()
    return <span>{count()} - {doubled()}</span>
  }, div)
  expect(div.innerHTML).toBe('<span>3 - 6</span>')
})
