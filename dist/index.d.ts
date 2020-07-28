import { Ref } from 'vue';
declare class State<S> {
    private val;
    private readonly subscribers;
    constructor(value: S);
    get value(): S;
    set(value: S): void;
    update(op: (value: S) => S): void;
    subscribe(sub: (value: S) => void): () => void;
}
declare function createState<S>(source: S): State<S>;
interface StateMethods<S> {
    state: Ref<S>;
    set: (value: S) => void;
}
declare function useState<S>(state: S | State<S>): StateMethods<S>;
export { State, createState, useState };
