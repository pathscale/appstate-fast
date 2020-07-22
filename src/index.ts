import { onUnmounted, onMounted, ref } from 'vue'

export type Path = ReadonlyArray<string | number>

export type SetStateAction<S> = (S | Promise<S>) | ((prevState: S) => S | Promise<S>)

export type SetPartialStateAction<S> = S extends ReadonlyArray<infer U>
  ? ReadonlyArray<U> | Record<number, U> | ((prevValue: S) => ReadonlyArray<U> | Record<number, U>)
  : S extends Record<string, unknown> | string
  ? Partial<S> | ((prevValue: S) => Partial<S>)
  : S | ((prevState: S) => S)

export type SetInitialStateAction<S> = S | Promise<S> | (() => S | Promise<S>)

const self = Symbol('self')
const selfMethodsID = Symbol('ProxyMarker')
const valueUnusedMarker = Symbol('valueUnusedMarker')
const unmountedMarker = Symbol('unmountedMarker')
export const postpone = Symbol('postpone')
export const none = Symbol('none') as StateValueAtPath
export const devToolsID = Symbol('devTools')

export type InferredStateKeysType<S> = S extends ReadonlyArray<infer _>
  ? ReadonlyArray<number>
  : S extends null
  ? undefined
  : S extends Record<string, unknown>
  ? ReadonlyArray<keyof S>
  : undefined

export type InferredStateOrnullType<S> = S extends undefined
  ? undefined
  : S extends null
  ? null
  : State<S>

export interface PluginStateControl<S> {
  getUntracked(): S
  setUntracked(newValue: SetStateAction<S>): Path[]
  mergeUntracked(mergeValue: SetPartialStateAction<S>): Path[]
  rerender(paths: Path[]): void
}

export interface StateMethods<S> {
  readonly path: Path
  readonly keys: InferredStateKeysType<S>
  readonly value: S
  readonly promised: boolean
  readonly error: StateErrorAtRoot | undefined
  get(): S
  set(newValue: SetStateAction<S>): void
  merge(newValue: SetPartialStateAction<S>): void
  nested<K extends keyof S>(key: K): State<S[K]>
  // TODO: Figure out function types
  // eslint-disable-next-line @typescript-eslint/ban-types
  batch<R, C>(action: (s: State<S>) => R, context?: Exclude<C, Function>): R
  ornull: InferredStateOrnullType<S>
  attach(plugin: () => Plugin): State<S>
  attach(pluginId: symbol): [PluginCallbacks | Error, PluginStateControl<S>]
}

export interface StateMethodsDestroy {
  destroy(): void
}

export type State<S> = StateMethods<S> &
  (S extends ReadonlyArray<infer U>
    ? ReadonlyArray<State<U>>
    : S extends Record<string, unknown>
    ? Omit<
        { readonly [K in keyof Required<S>]: State<S[K]> },
        keyof StateMethods<S> | keyof StateMethodsDestroy
      >
    : Record<string, unknown>)

// TODO: Enumerate all possible types
export type StateValueAtRoot = unknown
// TODO: Enumerate all possible types
export type StateValueAtPath = unknown
// TODO: Enumerate all possible types
export type StateErrorAtRoot = unknown
// TODO: Enumerate all possible types
export type AnyContext = unknown

export interface PluginCallbacksOnSetArgument {
  readonly path: Path
  readonly state?: StateValueAtRoot
  readonly previous?: StateValueAtPath
  readonly value?: StateValueAtPath
  readonly merged?: StateValueAtPath
}

export interface PluginCallbacksOnDestroyArgument {
  readonly state?: StateValueAtRoot
}

export interface PluginCallbacksOnBatchArgument {
  readonly path: Path
  readonly state?: StateValueAtRoot
  readonly context?: AnyContext
}

export interface PluginCallbacks {
  readonly onSet?: (arg: PluginCallbacksOnSetArgument) => void
  readonly onDestroy?: (arg: PluginCallbacksOnDestroyArgument) => void
  readonly onBatchStart?: (arg: PluginCallbacksOnBatchArgument) => void
  readonly onBatchFinish?: (arg: PluginCallbacksOnBatchArgument) => void
}

export interface Plugin {
  readonly id: symbol
  readonly init?: (state: State<StateValueAtRoot>) => PluginCallbacks
}

export function createState<S>(initial: SetInitialStateAction<S>): State<S> & StateMethodsDestroy {
  const methods = createStore(initial).toMethods()

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const devtools = createState[devToolsID]
  if (devtools) {
    methods.attach(devtools)
  }

  return methods.self as State<S> & StateMethodsDestroy
}

export function useState<S>(source: SetInitialStateAction<S> | State<S>): State<S> {
  const parentMethods =
    typeof source === 'object' && source !== null
      ? (source[self] as StateMethodsImpl<S> | undefined)
      : undefined

  if (parentMethods) {
    if (parentMethods.isMounted) {
      // Scoped state mount
      return useSubscribedStateMethods<S>(parentMethods.state, parentMethods.path, parentMethods)
        .self
    } else {
      // Global state mount or destroyed link
      const state = ref(parentMethods.state)
      return useSubscribedStateMethods<S>(state.value as Store, parentMethods.path, state.value)
        .self
    }
  } else {
    // Local state mount
    const state = ref(createStore(source))
    const result = useSubscribedStateMethods<S>(state.value as Store, rootPath, state.value)
    onUnmounted(() => state.value.destroy())

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const devtools = useState[devToolsID]
    if (devtools) {
      result.attach(devtools)
    }

    return result.self
  }
}

export interface DevToolsExtensions {
  label(name: string): void
  log(str: string, data?: unknown): void
}

export function devTools<S>(state: State<S>): DevToolsExtensions {
  const plugin = state.attach(devToolsID)
  if (plugin[0] instanceof Error) {
    return emptyDevToolsExtensions
  }
  return plugin[0] as DevToolsExtensions
}

const emptyDevToolsExtensions: DevToolsExtensions = {
  label() {
    /* */
  },
  log() {
    /* */
  },
}

// TODO: Fix error names
/* eslint-disable @typescript-eslint/naming-convention */
enum ErrorId {
  InitStateToValueFromState = 101,
  SetStateToValueFromState = 102,
  GetStateWhenPromised = 103,
  SetStateWhenPromised = 104,
  SetStateNestedToPromised = 105,
  SetStateWhenDestroyed = 106,
  GetStatePropertyWhenPrimitive = 107,
  ToJson_Value = 108,
  ToJson_State = 109,
  GetUnknownPlugin = 120,

  SetProperty_State = 201,
  SetProperty_Value = 202,
  SetPrototypeOf_State = 203,
  SetPrototypeOf_Value = 204,
  PreventExtensions_State = 205,
  PreventExtensions_Value = 206,
  DefineProperty_State = 207,
  DefineProperty_Value = 208,
  DeleteProperty_State = 209,
  DeleteProperty_Value = 210,
  Construct_State = 211,
  Construct_Value = 212,
  Apply_State = 213,
  Apply_Value = 214,
}
/* eslint-enable @typescript-eslint/naming-convention */

class StateInvalidUsageError extends Error {
  constructor(path: Path, id: ErrorId, details?: string) {
    super(
      `Error: HOOKSTATE-${id} [path: /${path.join('/')}${
        details ? `, details: ${details}` : ''
      }]. ` + `See https://hookstate.js.org/docs/exceptions#hookstate-${id}`,
    )
  }
}

interface Subscriber {
  onSet(paths: Path[], actions: (() => void)[]): void
}

interface Subscribable {
  subscribe(l: Subscriber): void
  unsubscribe(l: Subscriber): void
}

const rootPath: Path = []
const destroyedEdition = -1

type Writeable<T> = { -readonly [P in keyof T]: T[P] }

class Store implements Subscribable {
  private _edition = 0

  private readonly _subscribers: Set<Subscriber> = new Set()
  private readonly _setSubscribers: Set<Required<PluginCallbacks>['onSet']> = new Set()
  private readonly _destroySubscribers: Set<Required<PluginCallbacks>['onDestroy']> = new Set()

  private readonly _batchStartSubscribers: Set<
    Required<PluginCallbacks>['onBatchStart']
  > = new Set()

  private readonly _batchFinishSubscribers: Set<
    Required<PluginCallbacks>['onBatchFinish']
  > = new Set()

  private readonly _plugins = new Map<symbol, PluginCallbacks>()

  private _promised?: Promised

  private _batches = 0
  private _batchesPendingPaths?: Path[]
  private _batchesPendingActions?: (() => void)[]

  constructor(private _value: StateValueAtRoot) {
    if (typeof _value === 'object' && Promise.resolve(_value) === _value) {
      this._promised = this.createPromised(_value)
      this._value = none
    } else if (_value === none) {
      this._promised = this.createPromised()
    }
  }

  createPromised(newValue?: StateValueAtPath) {
    const promised = new Promised(
      newValue ? Promise.resolve(newValue) : undefined,

      (r: StateValueAtPath) => {
        if (this.promised === promised && this.edition !== destroyedEdition) {
          this._promised = undefined
          this.set(rootPath, r)
          this.update([rootPath])
        }
      },

      () => {
        if (this.promised === promised && this.edition !== destroyedEdition) {
          this._edition += 1
          this.update([rootPath])
        }
      },

      () => {
        if (
          this._batchesPendingActions &&
          this._value !== none &&
          this.edition !== destroyedEdition
        ) {
          const actions = this._batchesPendingActions
          this._batchesPendingActions = undefined
          actions.forEach(a => a())
        }
      },
    )

    return promised
  }

  get edition() {
    return this._edition
  }

  get promised() {
    return this._promised
  }

  get(path: Path) {
    let result = this._value
    if (result === none) {
      return result
    }
    for (const p of path) {
      result = (result as Record<string, unknown>)[p]
    }
    return result
  }

  set(path: Path, value: StateValueAtPath, mergeValue?: Partial<StateValueAtPath>): Path {
    if (this._edition < 0) {
      throw new StateInvalidUsageError(path, ErrorId.SetStateWhenDestroyed)
    }

    if (path.length === 0) {
      // Root value UPDATE case,

      const onSetArg: Writeable<PluginCallbacksOnSetArgument> = {
        path: path,
        state: value,
        value: value,
        previous: this._value,
        merged: mergeValue,
      }

      if (value === none) {
        this._promised = this.createPromised()
        delete onSetArg.value
        delete onSetArg.state
      } else if (typeof value === 'object' && Promise.resolve(value) === value) {
        this._promised = this.createPromised(value)
        value = none
        delete onSetArg.value
        delete onSetArg.state
      } else if (this._promised && !this._promised.resolver && !this._promised.fullfilled) {
        throw new StateInvalidUsageError(path, ErrorId.SetStateWhenPromised)
      }

      const prevValue = this._value
      if (prevValue === none) {
        delete onSetArg.previous
      }

      this._value = value
      this.afterSet(onSetArg)

      if (prevValue === none && this._value !== none && this.promised && this.promised.resolver) {
        this.promised.resolver()
      }

      return path
    }

    if (typeof value === 'object' && Promise.resolve(value) === value) {
      throw new StateInvalidUsageError(path, ErrorId.SetStateNestedToPromised)
    }

    let target = this._value as Record<string, unknown>
    for (let i = 0; i < path.length - 1; i += 1) {
      target = target[path[i]] as Record<string, unknown>
    }

    const p = path[path.length - 1]
    if (p in target) {
      if (value !== none) {
        // Property UPDATE case
        const prevValue = target[p]
        target[p] = value
        this.afterSet({
          path: path,
          state: this._value,
          value: value,
          previous: prevValue,
          merged: mergeValue,
        })

        return path
      } else {
        // Property DELETE case
        const prevValue = target[p]
        if (Array.isArray(target) && typeof p === 'number') {
          target.splice(p, 1)
        } else {
          delete target[p]
        }
        this.afterSet({
          path: path,
          state: this._value,
          previous: prevValue,
          merged: mergeValue,
        })

        // if an array of object is about to loose existing property
        // we consider it is the whole object is changed
        // which is identified by upper path
        return path.slice(0, -1)
      }
    }

    if (value !== none) {
      // Property INSERT case
      target[p] = value
      this.afterSet({ path, state: this._value, value, merged: mergeValue })
      // if an array of object is about to be extended by new property
      // we consider it is the whole object is changed
      // which is identified by upper path
      return path.slice(0, -1)
    }

    // Non-existing property DELETE case
    // no-op
    return path
  }

  update(paths: Path[]) {
    if (this._batches) {
      this._batchesPendingPaths = this._batchesPendingPaths ?? []
      this._batchesPendingPaths = this._batchesPendingPaths.concat(paths)
      return
    }

    const actions: (() => void)[] = []
    this._subscribers.forEach(s => s.onSet(paths, actions))
    actions.forEach(a => a())
  }

  afterSet(params: PluginCallbacksOnSetArgument) {
    if (this._edition !== destroyedEdition) {
      this._edition += 1
      for (const cb of this._setSubscribers) {
        cb(params)
      }
    }
  }

  startBatch(path: Path, options?: { context?: AnyContext }): void {
    this._batches += 1

    const cbArgument: Writeable<PluginCallbacksOnBatchArgument> = {
      path: path,
    }

    if (options && 'context' in options) {
      cbArgument.context = options.context
    }

    if (this._value !== none) {
      cbArgument.state = this._value
    }

    this._batchStartSubscribers.forEach(cb => cb(cbArgument))
  }

  finishBatch(path: Path, options?: { context?: AnyContext }): void {
    const cbArgument: Writeable<PluginCallbacksOnBatchArgument> = {
      path: path,
    }

    if (options && 'context' in options) {
      cbArgument.context = options.context
    }

    if (this._value !== none) {
      cbArgument.state = this._value
    }

    this._batchFinishSubscribers.forEach(cb => cb(cbArgument))

    this._batches -= 1
    if (this._batches === 0) {
      if (this._batchesPendingPaths) {
        const paths = this._batchesPendingPaths
        this._batchesPendingPaths = undefined
        this.update(paths)
      }
    }
  }

  postponeBatch(action: () => void): void {
    this._batchesPendingActions = this._batchesPendingActions ?? []
    this._batchesPendingActions.push(action)
  }

  getPlugin(pluginId: symbol) {
    return this._plugins.get(pluginId)
  }

  register(plugin: Plugin) {
    const existingInstance = this._plugins.get(plugin.id)
    if (existingInstance) {
      return
    }

    const pluginCallbacks = plugin.init ? plugin.init(this.toMethods().self) : {}
    this._plugins.set(plugin.id, pluginCallbacks)

    if (pluginCallbacks.onSet) {
      this._setSubscribers.add(p => pluginCallbacks.onSet?.(p))
    }

    if (pluginCallbacks.onDestroy) {
      this._destroySubscribers.add(p => pluginCallbacks.onDestroy?.(p))
    }

    if (pluginCallbacks.onBatchStart) {
      this._batchStartSubscribers.add(p => pluginCallbacks.onBatchStart?.(p))
    }

    if (pluginCallbacks.onBatchFinish) {
      this._batchFinishSubscribers.add(p => pluginCallbacks.onBatchFinish?.(p))
    }
  }

  toMethods() {
    return new StateMethodsImpl<StateValueAtRoot>(this, rootPath, this.get(rootPath), this.edition)
  }

  subscribe(l: Subscriber) {
    this._subscribers.add(l)
  }

  unsubscribe(l: Subscriber) {
    this._subscribers.delete(l)
  }

  destroy() {
    this._destroySubscribers.forEach(cb => cb(this._value !== none ? { state: this._value } : {}))
    this._edition = destroyedEdition
  }

  toJSON() {
    throw new StateInvalidUsageError(rootPath, ErrorId.ToJson_Value)
  }
}

// TODO: Replace with hooks and refs
class Promised {
  public fullfilled?: true
  public error?: StateErrorAtRoot
  public resolver?: () => void

  constructor(
    public promise: Promise<StateValueAtPath> | undefined,
    onResolve: (r: StateValueAtPath) => void,
    onReject: () => void,
    onPostResolve: () => void,
  ) {
    if (!promise) {
      promise = new Promise<StateValueAtRoot>(resolve => {
        this.resolver = resolve
      })
    }
    this.promise = promise
      .then(r => {
        this.fullfilled = true
        if (!this.resolver) {
          onResolve(r)
        }
      })
      .catch(error => {
        this.fullfilled = true
        this.error = error as Error
        onReject()
      })
      .then(() => onPostResolve())
  }
}

function onSetUsedNoAction() {
  /** no action callback */
}

onSetUsedNoAction[unmountedMarker] = true

class StateMethodsImpl<S>
  implements StateMethods<S>, StateMethodsDestroy, Subscribable, Subscriber {
  isMounted: boolean
  private subscribers: Set<Subscriber> | undefined
  private childrenCache: Record<string | number, StateMethodsImpl<StateValueAtPath>> | undefined
  private selfCache: State<S> | undefined
  private valueCache: StateValueAtPath = valueUnusedMarker

  constructor(
    public readonly state: Store,
    public readonly path: Path,
    private valueSource: S,
    private valueEdition: number,
  ) {
    this.isMounted = false
    onMounted(() => (this.isMounted = true))
    onUnmounted(() => (this.isMounted = false))
  }

  getUntracked(allowPromised?: boolean) {
    if (this.valueEdition !== this.state.edition) {
      this.valueSource = this.state.get(this.path) as S
      this.valueEdition = this.state.edition

      if (this.isMounted) {
        // this link is still mounted to a component
        // populate cache again to ensure correct tracking of usage
        // when React scans which states to rerender on update
        if (this.valueCache !== valueUnusedMarker) {
          this.valueCache = valueUnusedMarker
          this.get(true) // renew cache to keep it marked used
        }
      } else {
        // This link is not mounted to a component
        // for example, it might be global link or
        // a link which has been discarded after rerender
        // but still captured by some callback or an effect.
        // If we are here and if it was mounted before,
        // it means it has not been garbage collected
        // when a component unmounted.
        // We take this opportunity to clean up caches
        // to avoid memory leaks via stale children states cache.
        this.valueCache = valueUnusedMarker
        delete this.childrenCache
        delete this.selfCache
      }
    }
    if (this.valueSource === none && !allowPromised) {
      if (this.state.promised?.error) {
        throw this.state.promised.error
      }
      throw new StateInvalidUsageError(this.path, ErrorId.GetStateWhenPromised)
    }
    return this.valueSource
  }

  get(allowPromised?: boolean) {
    const currentValue = this.getUntracked(allowPromised)
    if (this.valueCache === valueUnusedMarker) {
      if (Array.isArray(currentValue)) {
        this.valueCache = this.valueArrayImpl(currentValue)
      } else if (typeof currentValue === 'object' && currentValue !== null) {
        this.valueCache = this.valueObjectImpl(currentValue as Record<string, unknown>)
      } else {
        this.valueCache = currentValue
      }
    }
    return this.valueCache as S
  }

  get value(): S {
    return this.get()
  }

  setUntracked(newValue: SetStateAction<S>, mergeValue?: Partial<StateValueAtPath>): [Path] {
    if (typeof newValue === 'function') {
      newValue = (newValue as (prevValue: S) => S)(this.getUntracked())
    }

    if (typeof newValue === 'object' && newValue !== null && newValue[selfMethodsID]) {
      throw new StateInvalidUsageError(this.path, ErrorId.SetStateToValueFromState)
    }

    return [this.state.set(this.path, newValue, mergeValue)]
  }

  set(newValue: SetStateAction<S>) {
    this.state.update(this.setUntracked(newValue))
  }

  mergeUntracked(sourceValue: SetPartialStateAction<S>): Path[] {
    const currentValue = this.getUntracked()

    if (typeof sourceValue === 'function') {
      // TODO: Proper types
      sourceValue = sourceValue(currentValue) as SetPartialStateAction<S>
    }

    let updatedPaths: [Path]
    let deletedOrInsertedProps = false

    if (Array.isArray(currentValue)) {
      if (Array.isArray(sourceValue)) {
        return this.setUntracked((currentValue.concat(sourceValue) as unknown) as S, sourceValue)
      } else {
        const deletedIndexes: number[] = []

        for (const i of Object.keys(sourceValue).sort()) {
          const index = Number(i)
          // TODO: Proper types
          const newPropValue = sourceValue[index] as unknown
          if (newPropValue === none) {
            deletedOrInsertedProps = true
            deletedIndexes.push(index)
          } else {
            deletedOrInsertedProps = deletedOrInsertedProps || !(index in currentValue)
            currentValue[index] = newPropValue
          }
        }

        // indexes are ascending sorted as per above
        // so, delete one by one from the end
        // this way index positions do not change
        for (const p of deletedIndexes.reverse()) {
          currentValue.splice(p, 1)
        }
        updatedPaths = this.setUntracked(currentValue, sourceValue)
      }
    } else if (typeof currentValue === 'object' && currentValue !== null) {
      Object.keys(sourceValue).forEach(key => {
        // TODO: Proper types
        const newPropValue = sourceValue[key] as unknown
        if (newPropValue === none) {
          deletedOrInsertedProps = true
          delete currentValue[key]
        } else {
          deletedOrInsertedProps = deletedOrInsertedProps || !(key in currentValue)
          currentValue[key] = newPropValue
        }
      })
      updatedPaths = this.setUntracked(currentValue, sourceValue)
    } else if (typeof currentValue === 'string') {
      return this.setUntracked(((currentValue + String(sourceValue)) as unknown) as S, sourceValue)
    } else {
      return this.setUntracked(sourceValue as S)
    }

    if (updatedPaths.length !== 1 || updatedPaths[0] !== this.path || deletedOrInsertedProps) {
      return updatedPaths
    }

    const updatedPath = updatedPaths[0]
    return Object.keys(sourceValue).map(p => updatedPath.slice().concat(p))
  }

  merge(sourceValue: SetPartialStateAction<S>) {
    this.state.update(this.mergeUntracked(sourceValue))
  }

  nested<K extends keyof S>(key: K): State<S[K]> {
    return this.child(key as string | number).self as State<S[K]>
  }

  rerender(paths: Path[]) {
    this.state.update(paths)
  }

  destroy(): void {
    this.state.destroy()
  }

  subscribe(l: Subscriber) {
    if (this.subscribers === undefined) {
      this.subscribers = new Set()
    }
    this.subscribers.add(l)
  }

  unsubscribe(l: Subscriber) {
    this.subscribers?.delete(l)
  }

  onSet(paths: Path[], actions: (() => void)[]): boolean {
    const update = () => {
      for (const path of paths) {
        const firstChildKey = path[this.path.length]

        if (firstChildKey === undefined) {
          if (this.valueCache !== valueUnusedMarker) {
            return true
          }
        } else {
          const firstChildValue = this.childrenCache?.[firstChildKey]
          if (firstChildValue?.onSet(paths, actions)) {
            return true
          }
        }
      }

      return false
    }

    const updated = update()
    if (!updated && this.subscribers !== undefined) {
      for (const s of this.subscribers) {
        s.onSet(paths, actions)
      }
    }

    return updated
  }

  get keys(): InferredStateKeysType<S> {
    const value = this.get()

    if (Array.isArray(value)) {
      return (Object.keys(value)
        .map(i => Number(i))
        .filter(i => Number.isInteger(i)) as unknown) as InferredStateKeysType<S>
    }

    if (typeof value === 'object' && value !== null) {
      return (Object.keys(value) as unknown) as InferredStateKeysType<S>
    }

    return undefined as InferredStateKeysType<S>
  }

  child(key: number | string) {
    // if this state is not mounted to a hook,
    // we do not cache children to avoid unnecessary memory leaks
    if (this.isMounted) {
      this.childrenCache = this.childrenCache ?? {}
      const cachehit = this.childrenCache[key]
      if (cachehit) {
        return cachehit
      }
    }

    const r = new StateMethodsImpl(
      this.state,
      this.path.slice().concat(key),
      this.valueSource[key],
      this.valueEdition,
    )

    if (this.childrenCache) {
      this.childrenCache[key] = r as StateMethodsImpl<unknown>
    }

    return r as StateMethodsImpl<unknown>
  }

  private valueArrayImpl(currentValue: StateValueAtPath[]): S {
    return (proxyWrap(
      this.path,
      currentValue as Record<symbol, unknown>,
      () => currentValue,

      (target: unknown, key: PropertyKey) => {
        if (key === 'length') {
          return (target as []).length
        }

        if (key in Array.prototype) {
          return Array.prototype[key] as unknown
        }

        if (key === selfMethodsID) {
          return this
        }

        if (typeof key === 'symbol') {
          // allow clients to associate hidden cache with state values
          // TODO: Figure out symbol indexing
          return (target as Record<symbol, unknown>)[key] as unknown
        }

        const index = Number(key)
        if (!Number.isInteger(index)) {
          return
        }

        return this.child(index).get()
      },

      (target: unknown, key: PropertyKey, value: StateValueAtPath) => {
        if (typeof key === 'symbol') {
          // allow clients to associate hidden cache with state values
          // TODO: Figure out symbol indexing
          ;(target as Record<symbol, unknown>)[key] = value
          return true
        }
        throw new StateInvalidUsageError(this.path, ErrorId.SetProperty_Value)
      },

      true,
    ) as unknown) as S
  }

  private valueObjectImpl(currentValue: Record<string, unknown>): S {
    return (proxyWrap(
      this.path,
      currentValue,
      () => currentValue,

      (target: unknown, key: PropertyKey) => {
        if (key === selfMethodsID) {
          return this
        }

        if (typeof key === 'symbol') {
          // allow clients to associate hidden cache with state values
          // TODO: Figure out symbol indexing
          return (target as Record<symbol, unknown>)[key] as unknown
        }
        return this.child(key).get()
      },

      (target: unknown, key: PropertyKey, value: StateValueAtPath) => {
        if (typeof key === 'symbol') {
          // allow clients to associate hidden cache with state values
          // TODO: Figure out symbol indexing
          ;(target as Record<symbol, unknown>)[key] = value
          return true
        }
        throw new StateInvalidUsageError(this.path, ErrorId.SetProperty_Value)
      },

      true,
    ) as unknown) as S
  }

  get self(): State<S> {
    if (this.selfCache) {
      return this.selfCache
    }

    const getter = (_: unknown, key: PropertyKey) => {
      if (key === self) {
        return this
      }

      if (typeof key === 'symbol') {
        return
      }

      if (key === 'toJSON') {
        throw new StateInvalidUsageError(this.path, ErrorId.ToJson_State)
      }

      switch (key) {
        case 'path':
          return this.path
        case 'keys':
          return this.keys
        case 'value':
          return this.value
        case 'ornull':
          return this.ornull
        case 'promised':
          return this.promised
        case 'error':
          return this.error
        case 'get':
          return () => this.get()
        case 'set':
          return (p: SetStateAction<S>) => this.set(p)
        case 'merge':
          return (p: SetPartialStateAction<S>) => this.merge(p)
        case 'nested':
          return (p: keyof S) => this.nested(p)
        case 'batch':
          // TODO: Figure out function types
          // eslint-disable-next-line @typescript-eslint/ban-types
          return <R, C>(action: () => R, context: Exclude<C, Function>) =>
            this.batch(action, context)
        case 'attach':
          return (p: symbol) => this.attach(p)
        case 'destroy': {
          return () => this.destroy()
        }
        default:
        // fall down
      }

      const currentValue = this.get()

      if (
        // if currentValue is primitive type
        (typeof currentValue !== 'object' || currentValue === null) &&
        // if promised, it will be none
        currentValue !== none
      ) {
        throw new StateInvalidUsageError(this.path, ErrorId.GetStatePropertyWhenPrimitive)
      }

      if (Array.isArray(currentValue)) {
        if (key === 'length') {
          return currentValue.length
        }
        if (key in Array.prototype) {
          return Array.prototype[key] as unknown
        }
        const index = Number(key)
        if (!Number.isInteger(index)) {
          return
        }
        return this.nested(index as keyof S)
      }

      return this.nested(key.toString() as keyof S)
    }

    this.selfCache = (proxyWrap(
      this.path,
      this.valueSource as Record<string, unknown>,
      () => {
        this.get() // get latest & mark used
        return this.valueSource
      },
      getter,
      () => {
        throw new StateInvalidUsageError(this.path, ErrorId.SetProperty_State)
      },
      false,
    ) as unknown) as State<S>

    return this.selfCache
  }

  get promised() {
    const currentValue = this.get(true) // marks used
    if (currentValue === none && this.state.promised && !this.state.promised.fullfilled) {
      return true
    }
    return false
  }

  get error() {
    const currentValue = this.get(true) // marks used

    if (currentValue === none) {
      if (this.state.promised?.fullfilled) {
        return this.state.promised.error
      }
      this.get() // will throw 'read while promised' exception
    }

    return
  }

  // TODO: Figure out function types
  // eslint-disable-next-line @typescript-eslint/ban-types
  batch<R, C>(action: (s: State<S>) => R, context?: Exclude<C, Function>): R {
    const opts = { context }
    try {
      this.state.startBatch(this.path, opts)
      const result = action(this.self)

      if (((result as unknown) as symbol) === postpone) {
        this.state.postponeBatch(() => this.batch(action, context))
      }

      return result
    } finally {
      this.state.finishBatch(this.path, opts)
    }
  }

  get ornull(): InferredStateOrnullType<S> {
    const value = this.get()
    if (value === null || value === undefined) {
      return value as InferredStateOrnullType<S>
    }
    return this.self as InferredStateOrnullType<S>
  }

  attach(plugin: () => Plugin): State<S>
  attach(pluginId: symbol): [PluginCallbacks | Error, PluginStateControl<S>]
  attach(p: (() => Plugin) | symbol): State<S> | [PluginCallbacks | Error, PluginStateControl<S>] {
    if (typeof p === 'function') {
      const pluginMeta = p()
      this.state.register(pluginMeta)
      return this.self
    } else {
      const plugin =
        this.state.getPlugin(p) ??
        new StateInvalidUsageError(this.path, ErrorId.GetUnknownPlugin, p.toString())

      return [plugin, this]
    }
  }
}

function proxyWrap(
  path: Path,
  targetBootstrap: Record<string, unknown>,
  targetGetter: () => unknown,
  propertyGetter: (unused: unknown, key: PropertyKey) => unknown,
  propertySetter: (unused: unknown, p: PropertyKey, value: unknown, receiver: unknown) => boolean,
  isValueProxy: boolean,
) {
  const onInvalidUsage = (op: ErrorId) => {
    throw new StateInvalidUsageError(path, op)
  }

  if (typeof targetBootstrap !== 'object' || targetBootstrap === null) {
    targetBootstrap = {}
  }

  // TODO: Figure out proxy types
  return new Proxy(targetBootstrap, {
    get: propertyGetter,
    set: propertySetter,

    getPrototypeOf: () => {
      // should satisfy the invariants:
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getPrototypeOf#Invariants
      const targetReal = targetGetter()
      if (targetReal === undefined || targetReal === null) {
        return null
      }
      return Object.getPrototypeOf(targetReal) as Record<string, unknown>
    },

    isExtensible: () => {
      // should satisfy the invariants:
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/isExtensible#Invariants
      return true // required to satisfy the invariants of the getPrototypeOf
    },

    getOwnPropertyDescriptor: (_, p) => {
      const targetReal = targetGetter()
      if (targetReal === undefined || targetReal === null) {
        return
      }

      const origin = Object.getOwnPropertyDescriptor(targetReal, p)
      if (origin && Array.isArray(targetReal) && p in Array.prototype) {
        return origin
      }

      return (
        origin && {
          configurable: true, // JSON.stringify() does not work for an object without it
          enumerable: origin.enumerable,
          get: () => propertyGetter(targetReal, p),
          set: undefined,
        }
      )
    },

    has: (_, p) => {
      if (typeof p === 'symbol') {
        return false
      }
      const targetReal = targetGetter()
      if (typeof targetReal === 'object' && targetReal !== null) {
        return p in targetReal
      }
      return false
    },

    enumerate: () => {
      const targetReal = targetGetter()
      if (Array.isArray(targetReal)) {
        return Object.keys(targetReal).concat('length')
      }
      if (targetReal === undefined || targetReal === null) {
        return []
      }
      return Object.keys(targetReal as Record<string, unknown>)
    },

    ownKeys: () => {
      const targetReal = targetGetter()
      if (Array.isArray(targetReal)) {
        return Object.keys(targetReal).concat('length')
      }
      if (targetReal === undefined || targetReal === null) {
        return []
      }
      return Object.keys(targetReal as Record<string, unknown>)
    },

    apply: () => onInvalidUsage(isValueProxy ? ErrorId.Apply_State : ErrorId.Apply_Value),

    preventExtensions: () =>
      onInvalidUsage(
        isValueProxy ? ErrorId.PreventExtensions_State : ErrorId.PreventExtensions_Value,
      ),

    setPrototypeOf: () =>
      onInvalidUsage(isValueProxy ? ErrorId.SetPrototypeOf_State : ErrorId.SetPrototypeOf_Value),

    deleteProperty: () =>
      onInvalidUsage(isValueProxy ? ErrorId.DeleteProperty_State : ErrorId.DeleteProperty_Value),

    defineProperty: () =>
      onInvalidUsage(isValueProxy ? ErrorId.DefineProperty_State : ErrorId.DefineProperty_Value),

    construct: () =>
      onInvalidUsage(isValueProxy ? ErrorId.Construct_State : ErrorId.Construct_Value),
  })
}

function createStore<S>(initial: SetInitialStateAction<S>): Store {
  let initialValue: S | Promise<S> = initial as S | Promise<S>

  if (typeof initial === 'function') {
    initialValue = (initial as () => S | Promise<S>)()
  }

  if (typeof initialValue === 'object' && initialValue !== null && initialValue[selfMethodsID]) {
    throw new StateInvalidUsageError(rootPath, ErrorId.InitStateToValueFromState)
  }

  return new Store(initialValue)
}

function useSubscribedStateMethods<S>(state: Store, path: Path, subscribeTarget: Subscribable) {
  const link = new StateMethodsImpl<S>(state, path, state.get(path) as S, state.edition)
  onMounted(() => subscribeTarget.subscribe(link))
  onUnmounted(() => subscribeTarget.unsubscribe(link))
  return link
}
