import { reactive, Target, ReactiveFlags } from '@/reactive'

describe('测试 reactive 响应式', () => {
  it('should return a new proxy object.', () => {
    const obj = { a: 1 }
    const foo = reactive(obj)
    expect(obj).not.toBe(foo)
    expect((foo as Target)[ReactiveFlags.RAW]).toBe(obj)
  })

  it('should proxy object can reflect to raw object.', () => {
    const obj = { a: 1 }
    const foo = reactive(obj)

    expect(obj.a).toBe(1)
    expect(foo.a).toBe(1)

    foo.a = 123

    expect(obj.a).toBe(123)
    expect(foo.a).toBe(123)
  })

  it('should be useful for array.', () => {
    const arr = [1, 2, 3]
    const reactiveArr = reactive(arr)
    expect(arr).not.toBe(reactiveArr)

    expect(arr[0]).toBe(1)
    expect(reactiveArr[0]).toBe(1)
    reactiveArr[0] = 123
    expect(arr[0]).toBe(123)
    expect(reactiveArr[0]).toBe(123)
  })

  it('should return exist reactive object when target is already a reactive object.', () => {
    const r = reactive({ a: 1 })
    const r2 = reactive(r)

    expect(r).toBe(r2)
  })

  it('should return return exist reactive object when target is reactived one more time.', () => {
    const raw = { a: 1 }
    const r = reactive(raw)
    const r2 = reactive(raw)

    expect(r).toBe(r2)
  })
})