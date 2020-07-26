import { ref, Ref, onUnmounted } from 'vue'

export class State<S> {
  private val: S
  private readonly subscribers: { ref: Ref<S> }[]

  constructor(value: S) {
    this.val = value
    this.subscribers = []
  }

  get value(): S {
    return this.val
  }

  set(value: S): void {
    this.val = value
    this.subscribers.forEach(s => {
      s.ref.value = this.val
      console.log(s.ref.value)
    })
  }

  update(op: (value: S) => void): void {
    op(this.val)
    this.subscribers.forEach(s => {
      s.ref.value = this.val
      console.log(s.ref.value)
    })
  }

  subscribe(subscriber: { ref: Ref<S> }): () => void {
    this.subscribers.push(subscriber)
    return () => {
      const index = this.subscribers.indexOf(subscriber)
      if (index !== -1) {
        this.subscribers.splice(index, 1)
      }
    }
  }
}

export function createState<S>(source: S): State<S> {
  const state = new State(source)
  return state
}

export function useState<S>(state: S | State<S>): Ref<S> {
  if (state instanceof State) {
    const subscriber = ref(state.value) as Ref<S>
    const unsubscribe = state.subscribe({ ref: subscriber })
    onUnmounted(() => unsubscribe())
    return subscriber
  } else {
    const value = ref(state) as Ref<S>
    return value
  }
}
