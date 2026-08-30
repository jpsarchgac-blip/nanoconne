export function useHistoryNav() {
  const route = useRoute()
  const stack = useState<string[]>("nav-stack", () => [])
  const pointer = useState<number>("nav-pointer", () => 0)
  let skipNext = false

  const canBack = computed(() => pointer.value > 0)
  const canForward = computed(() => pointer.value < stack.value.length - 1)

  function ensureInit(path: string) {
    if (stack.value.length === 0) {
      stack.value = [path]
      pointer.value = 0
    }
  }

  function remember(path: string) {
    ensureInit(path)

    if (skipNext) {
      skipNext = false
      return
    }

    if (stack.value[pointer.value] === path) return

    const known = stack.value.indexOf(path)
    if (known >= 0) {
      pointer.value = known
      return
    }

    stack.value = stack.value.slice(0, pointer.value + 1)
    stack.value.push(path)
    pointer.value = stack.value.length - 1
  }

  function back() {
    if (!canBack.value) return
    const prev = pointer.value - 1
    pointer.value = prev
    skipNext = true
    navigateTo(stack.value[prev]!)
  }

  function forward() {
    if (!canForward.value) return
    const next = pointer.value + 1
    pointer.value = next
    skipNext = true
    navigateTo(stack.value[next]!)
  }

  watch(
    () => route.fullPath,
    (path) => {
      remember(path)
    },
    { immediate: true },
  )

  return { canBack, canForward, back, forward }
}
