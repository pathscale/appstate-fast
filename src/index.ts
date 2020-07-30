import { ref, Ref, onUnmounted, customRef, triggerRef } from 'vue'

export class State<S> {
  value: S
  private readonly subscribers: (() => void)[]

  constructor(value: S) {
    this.value = value
    this.subscribers = []
  }

  _sync(): void {
    this.subscribers.forEach(s => s())
  }

  subscribe(trigger: () => void): () => void {
    this.subscribers.push(trigger)
    return () => {
      const index = this.subscribers.indexOf(trigger)
      if (index !== -1) {
        this.subscribers.splice(index, 1)
      }
    }
  }
}

export function createState<S>(source: S): State<S> {
  const state = new State(source)

  const proxy = new Proxy(state, {
    set(obj, prop, value) {
      obj[prop] = value as unknown

      if (prop === 'value') {
        obj._sync()
      }

      return true
    },
  })

  return proxy
}

export function useState<S>(state: S | State<S>): Ref<S> {
  if (!(state instanceof State)) {
    // Local state
    return ref(state) as Ref<S>
  }

  // Global state
  const value = customRef(track => ({
    get() {
      track()
      return state.value
    },

    set(newValue: S) {
      state.value = newValue
      // triggering is done by global state
    },
  }))

  const trigger = () => triggerRef(value)
  const unsubscribe = state.subscribe(trigger)
  onUnmounted(() => unsubscribe())

  return value
}
