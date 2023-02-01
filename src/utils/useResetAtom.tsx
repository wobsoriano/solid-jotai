import type { WritableAtom } from 'jotai/vanilla'
import { RESET } from 'jotai/vanilla/utils'
import { useSetAtom } from '../useSetAtom'

type Options = Parameters<typeof useSetAtom>[1]

export function useResetAtom(
  anAtom: WritableAtom<unknown, [typeof RESET], unknown>,
  options?: Options,
) {
  const setAtom = useSetAtom(anAtom, options)
  const resetAtom = () => setAtom(RESET)
  return resetAtom
}
