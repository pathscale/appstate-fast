import { Ref } from 'vue';
declare class State<S> {
    private val;
    private readonly subscribers;
    constructor(value: S);
    get value(): S;
    set(value: S): void;
    update(op: (value: S) => void): void;
    subscribe(subscriber: {
        ref: Ref<S>;
    }): () => void;
}
declare function createState<S>(source: S): State<S>;
declare function useState<S>(state: S | State<S>): Ref<S>;
export { State, createState, useState };
