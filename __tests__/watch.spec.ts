import { reactive } from '@/reactive'
import { ref } from '@/ref'
import { watch } from '@/watch'

describe('测试 watch 方法', () => {

  it('should watch a reactive object.', () => {
    const r = reactive({ a: 1, b: 2 })
    const fn = jest.fn((newV, oldV) => [newV, oldV])

    watch(r, fn)

    r.a = 123
    const [newV1, oldV1] = fn.mock.results[0].value
    expect(fn.mock.calls.length).toBe(1)
    expect(newV1).toEqual({ a: 123, b: 2 })
    expect(oldV1).toEqual({ a: 123, b: 2 })
    expect(newV1).toBe(oldV1)

    r.b = 234
    const [newV2, oldV2] = fn.mock.results[1].value
    expect(fn.mock.calls.length).toBe(2)
    expect(newV2).toEqual({ a: 123, b: 234 })
    expect(oldV2).toEqual({ a: 123, b: 234 })
    expect(newV2).toBe(oldV2)
  })

  it('should watch a reactive object with a getter function.', () => {
    const r = reactive({ a: 1, b: 2 })
    const fn = jest.fn((newV, oldV) => [newV, oldV])

    watch(() => r.a, fn)
    r.a = 123
    r.b = 234

    expect(fn.mock.calls.length).toBe(1)
    expect(fn.mock.results[0].value).toEqual([123, 1])
  })

  it('should watch a ref object.', () => {
    const ref1 = ref(1)
    const fn = jest.fn((newV, oldV) => [newV, oldV])

    watch(ref1, fn)
    ref1.value = 123

    expect(fn.mock.calls.length).toBe(1)
    expect(fn.mock.results[0].value).toEqual([123, 1])
  })

  it('should watch a reactive/ref/getter as a target.', () => {
    const fn1 = () => watch(1, () => {})
    const fn2 = () => watch('1', () => {})

    expect(fn1).toThrowError(/(reactive|ref|getter)/)
    expect(fn2).toThrowError(/(reactive|ref|getter)/)
  })
})