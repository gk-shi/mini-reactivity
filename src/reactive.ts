import { track, trigger } from './effect'

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  RAW = '__v_raw'
}

export interface Target {
  [ReactiveFlags.IS_REACTIVE]?: boolean
  [ReactiveFlags.RAW]?: any
}

export const reactiveMap = new WeakMap<Target, any>()

export type Reactive<T> = T extends object ? T : unknown

export function reactive<T extends object>(target: T): Reactive<T>
export function reactive(target: object) {
  if (target && (target as Target)[ReactiveFlags.IS_REACTIVE]) return target
  if (reactiveMap.get(target)) return reactiveMap.get(target)
  const proxy = createReactiveObject(target, true)
  reactiveMap.set(target, proxy)
  return proxy
}

function createReactiveObject(
  target: Target,
  isReactive: boolean
) {
  const proxy = new Proxy(target, {
    get(target, key, receiver: object) {
      if (key === ReactiveFlags.IS_REACTIVE) {
        return isReactive
      } else if (key === ReactiveFlags.RAW) {
        return target
      }
      const res = Reflect.get(target, key, receiver)
      track(target, key)
      return res
    },

    set(target, key, value: unknown, receiver: object): boolean {
      const oldVal = (target as any)[key]
      const res = Reflect.set(target, key, value, receiver)
      trigger(target, key, value, oldVal)
      return res
    }
  })
  return proxy
}


export function isReactive(r: unknown): boolean {
  return r !== null && (r as any)[ReactiveFlags.IS_REACTIVE]
}

