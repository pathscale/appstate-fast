type Path = ReadonlyArray<string | number>;
type SetStateAction<S> = (S | Promise<S>) | ((prevState: S) => S | Promise<S>);
type SetPartialStateAction<S> = S extends ReadonlyArray<infer U> ? ReadonlyArray<U> | Record<number, U> | ((prevValue: S) => ReadonlyArray<U> | Record<number, U>) : S extends Record<string, unknown> | string ? Partial<S> | ((prevValue: S) => Partial<S>) : S | ((prevState: S) => S);
type SetInitialStateAction<S> = S | Promise<S> | (() => S | Promise<S>);
declare const postpone: unique symbol;
declare const none: unknown;
declare const devToolsID: unique symbol;
type InferredStateKeysType<S> = S extends ReadonlyArray<infer _> ? ReadonlyArray<number> : S extends null ? undefined : S extends Record<string, unknown> ? ReadonlyArray<keyof S> : undefined;
type InferredStateOrnullType<S> = S extends undefined ? undefined : S extends null ? null : State<S>;
interface PluginStateControl<S> {
    getUntracked(): S;
    setUntracked(newValue: SetStateAction<S>): Path[];
    mergeUntracked(mergeValue: SetPartialStateAction<S>): Path[];
    rerender(paths: Path[]): void;
}
interface StateMethods<S> {
    readonly path: Path;
    readonly keys: InferredStateKeysType<S>;
    readonly value: S;
    readonly promised: boolean;
    readonly error: StateErrorAtRoot | undefined;
    get(): S;
    set(newValue: SetStateAction<S>): void;
    merge(newValue: SetPartialStateAction<S>): void;
    nested<K extends keyof S>(key: K): State<S[K]>;
    batch<R, C>(action: (s: State<S>) => R, context?: Exclude<C, Function>): R;
    ornull: InferredStateOrnullType<S>;
    attach(plugin: () => Plugin): State<S>;
    attach(pluginId: symbol): [PluginCallbacks | Error, PluginStateControl<S>];
}
interface StateMethodsDestroy {
    destroy(): void;
}
type State<S> = StateMethods<S> & (S extends ReadonlyArray<infer U> ? ReadonlyArray<State<U>> : S extends Record<string, unknown> ? Omit<{
    readonly [K in keyof Required<S>]: State<S[K]>;
}, keyof StateMethods<S> | keyof StateMethodsDestroy> : Record<string, unknown>);
type StateValueAtRoot = unknown;
type StateValueAtPath = unknown;
type StateErrorAtRoot = unknown;
type AnyContext = unknown;
interface PluginCallbacksOnSetArgument {
    readonly path: Path;
    readonly state?: StateValueAtRoot;
    readonly previous?: StateValueAtPath;
    readonly value?: StateValueAtPath;
    readonly merged?: StateValueAtPath;
}
interface PluginCallbacksOnDestroyArgument {
    readonly state?: StateValueAtRoot;
}
interface PluginCallbacksOnBatchArgument {
    readonly path: Path;
    readonly state?: StateValueAtRoot;
    readonly context?: AnyContext;
}
interface PluginCallbacks {
    readonly onSet?: (arg: PluginCallbacksOnSetArgument) => void;
    readonly onDestroy?: (arg: PluginCallbacksOnDestroyArgument) => void;
    readonly onBatchStart?: (arg: PluginCallbacksOnBatchArgument) => void;
    readonly onBatchFinish?: (arg: PluginCallbacksOnBatchArgument) => void;
}
interface Plugin {
    readonly id: symbol;
    readonly init?: (state: State<StateValueAtRoot>) => PluginCallbacks;
}
declare function createState<S>(initial: SetInitialStateAction<S>): State<S> & StateMethodsDestroy;
declare function useState<S>(source: SetInitialStateAction<S> | State<S>): State<S>;
interface DevToolsExtensions {
    label(name: string): void;
    log(str: string, data?: unknown): void;
}
declare function devTools<S>(state: State<S>): DevToolsExtensions;
export { Path, SetStateAction, SetPartialStateAction, SetInitialStateAction, postpone, none, devToolsID, InferredStateKeysType, InferredStateOrnullType, PluginStateControl, StateMethods, StateMethodsDestroy, State, StateValueAtRoot, StateValueAtPath, StateErrorAtRoot, AnyContext, PluginCallbacksOnSetArgument, PluginCallbacksOnDestroyArgument, PluginCallbacksOnBatchArgument, PluginCallbacks, Plugin, createState, useState, DevToolsExtensions, devTools };
