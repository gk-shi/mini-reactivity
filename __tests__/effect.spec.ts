import { reactive } from '@/reactive'
import { ref } from '@/ref'
import { effect } from '@/effect'


describe('测试 effect 依赖收集', () => {
  it('should effect with reactive.', () => {
    const r = reactive({
      a: 1
    })

    const fn = jest.fn(() => r.a)
    effect(fn)

    r.a = 123
    expect(fn.mock.calls.length).toBe(2)
    expect(fn.mock.results[0].value).toBe(1)
    expect(fn.mock.results[1].value).toBe(123)
  })

  it('should effect with ref.', () => {
    const r = ref(1)

    const fn = jest.fn(() => r.value)
    effect(fn)

    r.value = 123
    expect(fn.mock.calls.length).toBe(2)
    expect(fn.mock.results[0].value).toBe(1)
    expect(fn.mock.results[1].value).toBe(123)
  })

  it('should not call callback function when set a lazy propertity.', () => {
    const r = ref(1)
    const fn = jest.fn(() => r.value)

    const foo = effect(fn, { lazy: true })

    expect(fn.mock.calls.length).toBe(0)
    r.value = 2
    expect(fn.mock.calls.length).toBe(0)
    r.value = 3
    foo()
    expect(fn.mock.calls.length).toBe(1)
    expect(fn.mock.results[0].value).toBe(3)
  })

  it('should not circularly call the effect function.', () => {
    const r = reactive({ a: 1, b: 2 })
    const fn1 = jest.fn(() => {
      r.a = 4
      return r.b
    })
    const fn2 = jest.fn(() => {
      r.b = 5
      return r.a
    })
    effect(fn1)
    effect(fn2)

    expect(fn1.mock.calls.length).toBe(2)
    expect(fn2.mock.calls.length).toBe(1)
    expect(fn1.mock.results[0].value).toBe(2)
    expect(fn1.mock.results[1].value).toBe(5)
    expect(fn2.mock.results[0].value).toBe(4)
  })
})