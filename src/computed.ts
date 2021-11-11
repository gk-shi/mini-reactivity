import { effect, ReactiveEffect, track, trigger } from '@/effect'

export type ComputedRef<T> = {
  readonly value: T
}

export type ComputedGetter<T> = () => T

export function computed<T>(getter: ComputedGetter<T>): ComputedRef<T> {
  return new ComputedImpl(getter)
}

class ComputedImpl<T> {
  private _value: T
  private dirty: boolean
  private effect: ReactiveEffect<T>

  constructor(getter: ComputedGetter<T>) {
    this._value = getter()
    this.dirty = true

    this.effect = effect(getter, {
      lazy: true,
      scheduler: () => {
        if (!this.dirty) {
          this.dirty = true
          trigger(this, 'value')
        }
      }
    })
  }

  get value() {
    if (this.dirty) {
      this._value = this.effect()
      this.dirty = false
    }
    track(this, 'value')
    return this._value
  }

  set value(newValue: T) {
    // 暂不考虑设置 setter 的操作
  }
}