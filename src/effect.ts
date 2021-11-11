

// target -> key -> Dep
type Dep = Set<ReactiveEffect>
type KeyToMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyToMap>()

export type EffectOptions = {
  lazy?: boolean,
  scheduler?: (job: ReactiveEffect) => unknown
}
export type ReactiveEffect<T = any> = {
  (): T
  raw: () => T
  _isEffect: true
  options: EffectOptions
}

const effectStack: ReactiveEffect[] = []
let activeEffect: ReactiveEffect

export function track<T>(target: T, key: unknown) {
  if (!activeEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  if (!deps.has(activeEffect)) {
    deps.add(activeEffect)
  }
}

export function trigger<T>(
  target: T,
  key: unknown,
  newVal?: unknown,
  oldVal?: unknown
) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const deps = depsMap.get(key)
  if (!deps) return
  deps.forEach(effect =>
    effect.options.scheduler
    ? effect.options.scheduler(effect)
    : effect())
}


export function effect<T = any>(
  fn: () => T,
  options: EffectOptions = {}
): ReactiveEffect<T> {
  const effect = createReactiveEffect(fn, options)
  if (!options.lazy) effect()
  return effect
}

function createReactiveEffect<T = any>(
  fn: () => T,
  options: EffectOptions = {}
): ReactiveEffect<T> {
  const effect = function () {
    if (!effectStack.includes(effect)) {
      try {
        effectStack.push(effect)
        activeEffect = effect
        return fn()
      } finally {
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
      }
    }
  } as ReactiveEffect
  effect.raw = fn
  effect._isEffect = true
  effect.options = options
  return effect
}