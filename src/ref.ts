import { reactive } from './reactive'
import { track, trigger } from './effect'

export type Ref<T = any> = {
  value: T
}

export function ref<T>(value: T): Ref<T>
export function ref<T = any>(): Ref<T | undefined>
export function ref(value?: any) {
  if (isRef(value)) return value
  return createRef(value)
}

const isObject = (val: unknown): val is Record<any, any> => {
  return typeof val === 'object' && val !== null
}
const convert = <T extends unknown>(val: T): T => isObject(val) ? reactive(val) : val

class RefImpl<T> {
  private _value: T
  public readonly __v_isRef = true

  constructor(rawValue: T) {
    this._value = convert(rawValue)
  }

  get value() {
    track(this, 'value')
    return this._value
  }

  set value(newVal) {
    if (newVal === this._value) return
    const oldV = this._value
    this._value = newVal
    trigger(this, 'value', newVal, oldV)
  }
}

export function isRef<T>(r: Ref<T> | T): r is Ref<T>
export function isRef(r: any) {
  return r && r.__v_isRef === true
}

function createRef(value: unknown) {
  return new RefImpl(value)
}
