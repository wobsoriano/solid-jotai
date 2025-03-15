import { fireEvent, render, waitFor } from '@solidjs/testing-library'
import { createEffect, Suspense } from 'solid-js'
import { expect, it } from 'vitest'
import { atom, useAtom } from '../src'

it('does not show async stale result', async () => {
  const countAtom = atom(0)
  let resolve2 = () => {}
  const asyncCountAtom = atom(async (get) => {
    await new Promise<void>(r => (resolve2 = r))
    return get(countAtom)
  })

  const committed: number[] = []

  let resolve1 = () => {}
  const Counter = () => {
    const [count, setCount] = useAtom(countAtom)
    const onClick = async () => {
      setCount(c => c + 1)
      await new Promise<void>(r => (resolve1 = r))
      setCount(c => c + 1)
    }
    return (
      <>
        <div>
          count:
          {count()}
        </div>
        <button onClick={onClick}>button</button>
      </>
    )
  }

  const DelayedCounter = () => {
    const [delayedCount] = useAtom(asyncCountAtom)
    createEffect(() => {
      committed.push(delayedCount()!)
    })
    return (
      <div>
        delayedCount:
        {delayedCount()}
      </div>
    )
  }

  const { getByText, findByText } = render(() => (
    <>
      <Counter />
      <Suspense fallback="loading">
        <DelayedCounter />
      </Suspense>
    </>
  ))

  await findByText('loading')
  resolve1()
  resolve2()
  await waitFor(() => {
    getByText('count: 0')
    getByText('delayedCount: 0')
    expect(committed).toEqual([0])
  })

  fireEvent.click(getByText('button'))
  await findByText('loading')
  resolve1()
  resolve2()
  await waitFor(() => {
    getByText('count: 2')
    getByText('delayedCount: 2')
    expect(committed).toEqual([0, 2])
  })
})

it('does not show async stale result on derived atom', async () => {
  const countAtom = atom(0)
  let resolve = () => {}
  const asyncAlwaysNullAtom = atom(async (get) => {
    get(countAtom)
    await new Promise<void>(r => (resolve = r))
    return null
  })
  const derivedAtom = atom(get => get(asyncAlwaysNullAtom))

  const DisplayAsyncValue = () => {
    const [asyncValue] = useAtom(asyncAlwaysNullAtom)

    return (
      <div>
        async value:
        {JSON.stringify(asyncValue())}
      </div>
    )
  }

  const DisplayDerivedValue = () => {
    const [derivedValue] = useAtom(derivedAtom)
    return (
      <div>
        derived value:
        {JSON.stringify(derivedValue())}
      </div>
    )
  }

  const Test = () => {
    const [count, setCount] = useAtom(countAtom)
    return (
      <div>
        <div>
          count:
          {count()}
        </div>
        <Suspense fallback={<div>loading async value</div>}>
          <DisplayAsyncValue />
        </Suspense>
        <Suspense fallback={<div>loading derived value</div>}>
          <DisplayDerivedValue />
        </Suspense>
        <button onClick={() => setCount(c => c + 1)}>button</button>
      </div>
    )
  }

  const { getByText, queryByText } = render(() => <Test />)

  await waitFor(() => {
    getByText('count: 0')
    getByText('loading async value')
    getByText('loading derived value')
  })
  resolve()
  await waitFor(() => {
    expect(queryByText('loading async value')).toBeNull()
    expect(queryByText('loading derived value')).toBeNull()
  })
  await waitFor(() => {
    getByText('async value: null')
    getByText('derived value: null')
  })

  fireEvent.click(getByText('button'))
  await waitFor(() => {
    getByText('count: 1')
    getByText('loading async value')
    getByText('loading derived value')
  })
  resolve()
  await waitFor(() => {
    expect(queryByText('loading async value')).toBeNull()
    expect(queryByText('loading derived value')).toBeNull()
  })
  await waitFor(() => {
    getByText('async value: null')
    getByText('derived value: null')
  })
})

it('works with async get with extra deps', async () => {
  const countAtom = atom(0)
  const anotherAtom = atom(-1)
  let resolve = () => {}
  const asyncCountAtom = atom(async (get) => {
    get(anotherAtom)
    await new Promise<void>(r => (resolve = r))
    return get(countAtom)
  })

  const Counter = () => {
    const [count, setCount] = useAtom(countAtom)
    return (
      <>
        <div>
          count:
          {count()}
        </div>
        <button onClick={() => setCount(c => c + 1)}>button</button>
      </>
    )
  }

  const DelayedCounter = () => {
    const [delayedCount] = useAtom(asyncCountAtom)
    return (
      <div>
        delayedCount:
        {delayedCount()}
      </div>
    )
  }

  const { getByText, findByText } = render(() => (
    <Suspense fallback="loading">
      <Counter />
      <DelayedCounter />
    </Suspense>
  ))

  await findByText('loading')
  resolve()
  await waitFor(() => {
    getByText('count: 0')
    getByText('delayedCount: 0')
  })

  fireEvent.click(getByText('button'))
  await findByText('loading')
  resolve()
  await waitFor(() => {
    getByText('count: 1')
    getByText('delayedCount: 1')
  })
})

it('reuses promises on initial read', async () => {
  let invokeCount = 0
  let resolve = () => {}
  const asyncAtom = atom(async () => {
    invokeCount += 1
    await new Promise<void>(r => (resolve = r))
    return 'ready'
  })

  const Child = () => {
    const [str] = useAtom(asyncAtom)
    return <div>{str()}</div>
  }

  const { findByText, findAllByText } = render(() => (
    <Suspense fallback="loading">
      <Child />
      <Child />
    </Suspense>
  ))

  await findByText('loading')
  resolve()
  await findAllByText('ready')
  expect(invokeCount).toBe(1)
})

it('uses multiple async atoms at once', async () => {
  const resolve: (() => void)[] = []
  const someAtom = atom(async () => {
    await new Promise<void>(r => resolve.push(r))
    return 'ready'
  })
  const someAtom2 = atom(async () => {
    await new Promise<void>(r => resolve.push(r))
    return 'ready2'
  })

  const Component = () => {
    const [some] = useAtom(someAtom)
    const [some2] = useAtom(someAtom2)
    return (
      <>
        <div>
          {some()}
          {' '}
          {some2()}
        </div>
      </>
    )
  }

  const { getByText, findByText } = render(() => (
    <Suspense fallback="loading">
      <Component />
    </Suspense>
  ))

  await findByText('loading')
  await waitFor(() => {
    resolve.splice(0).forEach(fn => fn())
    getByText('ready ready2')
  })
})
