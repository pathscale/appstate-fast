import { Ref } from 'vue';
declare class State<S> {
    value: S;
    private readonly subscribers;
    constructor(value: S);
    _sync(): void;
    subscribe(trigger: () => void): () => void;
}
declare function createState<S>(source: S): State<S>;
declare function useState<S>(state: S | State<S>): Ref<S>;
export { State, createState, useState };
