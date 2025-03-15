import { Show, Suspense } from 'solid-js'
import { animated as a, createSpring } from 'solid-spring'
import { atom, Provider, useAtom } from '../src'

const postId = atom(9001)
const postData = atom(async (get) => {
  const id = get(postId)
  const response = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
  )
  return await response.json() as {
    by: string
    time: number
    title: string
    url: string
    text: string
  }
})

function Id() {
  const [id] = useAtom(postId)
  const props = createSpring(() => ({ from: { id: 0 }, id: id(), reset: true }))
  return <a.h1>{props().id.to(Math.round)}</a.h1>
}

function Next() {
  const [, set] = useAtom(postId)
  return (
    <button onClick={() => set(x => x + 1)}>
      <div>→</div>
    </button>
  )
}

function PostTitle() {
  const [post] = useAtom(postData)
  return (
    <Show when={post()}>
      <h2>{post()?.by}</h2>
      <h6>{new Date(post()!.time * 1000).toLocaleDateString('en-US')}</h6>
      {post()?.title && <h4>{post()?.title}</h4>}
      <a href={post()?.url}>{post()?.url}</a>
      <p>{post()?.text}</p>
    </Show>
  )
}

export default function App() {
  return (
    <Provider>
      <Id />
      <div>
        <Suspense fallback={<h2>Loading...</h2>}>
          <PostTitle />
        </Suspense>
      </div>
      <Next />
    </Provider>
  )
}
