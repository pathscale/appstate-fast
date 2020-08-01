import { ref, customRef, onUnmounted, triggerRef } from 'vue';

class State {
    constructor(value) {
        this.value = value;
        this.subscribers = [];
    }
    _sync() {
        this.subscribers.forEach(s => s());
    }
    subscribe(trigger) {
        this.subscribers.push(trigger);
        return () => {
            const index = this.subscribers.indexOf(trigger);
            if (index !== -1) {
                this.subscribers.splice(index, 1);
            }
        };
    }
}
function createState(source) {
    const state = new State(source);
    const proxy = new Proxy(state, {
        set(obj, prop, value) {
            obj[prop] = value;
            if (prop === 'value') {
                obj._sync();
            }
            return true;
        },
    });
    return proxy;
}
function useState(state) {
    if (!(state instanceof State)) {
        // Local state
        return ref(state);
    }
    // Global state
    const value = customRef(track => ({
        get() {
            track();
            return state.value;
        },
        set(newValue) {
            state.value = newValue;
            // triggering is done by global state
        },
    }));
    const trigger = () => triggerRef(value);
    const unsubscribe = state.subscribe(trigger);
    onUnmounted(() => unsubscribe());
    return value;
}

export { State, createState, useState };
//# sourceMappingURL=index.mjs.map
