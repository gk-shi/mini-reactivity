import { computed } from '@/computed'
import { reactive } from '@/reactive'
import { ref } from '@/ref'

describe('测试 computed 方法', () => {

  it('should computed a reactive object.', () => {
    const r = reactive({ a: 123 })
    const fn = jest.fn(() => r)
    const fn2 = jest.fn(() => r.a)

    const c = computed(fn)
    const c2 = computed(fn2)

    expect(c.value.a).toBe(123)
    expect(c2.value).toBe(123)
    r.a = 456
    expect(c.value.a).toBe(456)
    expect(c2.value).toBe(456)
  })

  it('should computed a ref object.', () => {
    const r = ref(1)
    const fn = jest.fn(() => r)
    const fn2 = jest.fn(() => r.value)

    const c = computed(fn)
    const c2 = computed(fn2)

    expect(c.value.value).toBe(1)
    expect(c2.value).toBe(1)

    r.value = 123
    expect(c.value.value).toBe(123)
    expect(c2.value).toBe(123)
  })
})