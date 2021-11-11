import { ref } from '@/ref'
import { ReactiveFlags, Target } from '@/reactive'

describe('测试 ref 响应式', () => {
  it('should return a object with a propertity named "value".', () => {
    const ref1 = ref(1)
    expect(ref1.value).toBe(1)

    ref1.value = 123
    expect(ref1.value).toBe(123)
  })

  it('should be realized with reactive when value is a object.', () => {
    const foo = { a: 1 }

    const ref1 = ref(foo)
    expect(ref1.value).not.toBe(foo)
    expect((ref1.value as Target)[ReactiveFlags.RAW]).toBe(foo)
  })

  it('should return exist ref object when value is already a ref object.', () => {
    const r = ref(1)
    const r2 = ref(r)

    expect(r).toBe(r2)
  })
})