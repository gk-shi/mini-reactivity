import { isReactive } from '@/reactive'
import { isRef } from '@/ref'
import { effect, ReactiveEffect } from '@/effect'


export function watch<T>(
  target: T | (() => T),
  cb: <K, V>(newValue?: K, oldValue?: V) => unknown
) {
  if (typeof target !== 'function'
    && !isReactive(target)
    && !isRef(target)) {
    throw new Error('被观察的目标必须是 reactive object / ref / getter 函数')
  }
  let getter: () => any
  if (isReactive(target)) {
    getter = () => traverse(target as object)
  } else if (isRef(target)) {
    getter = () => target.value
  } else {
    getter = target as (() => T)
  }

  let oldValue: T

  const scheduler = (job: ReactiveEffect) => {
    const newValue = job()
    if (cb) cb(newValue, oldValue)
    oldValue = newValue
  }

  const run = effect(getter, {
    lazy: true,
    scheduler
  })

  oldValue = run()
}


function traverse(value: object) {
  if (typeof value !== 'object') return value
  for (let key in value) {
    traverse((value as any)[key])
  }

  return value
}