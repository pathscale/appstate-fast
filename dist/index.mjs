import { ref, onUnmounted, triggerRef } from 'vue';

class State {
    constructor(value) {
        this.val = value;
        this.subscribers = [];
    }
    get value() {
        return this.val;
    }
    set(value) {
        this.val = value;
        this.subscribers.forEach(s => s(this.val));
    }
    update(op) {
        this.val = op(this.val);
        this.subscribers.forEach(s => s(this.val));
    }
    subscribe(sub) {
        this.subscribers.push(sub);
        return () => {
            const index = this.subscribers.indexOf(sub);
            if (index !== -1) {
                this.subscribers.splice(index, 1);
            }
        };
    }
}
function createState(source) {
    const state = new State(source);
    return state;
}
function useState(state) {
    if (state instanceof State) {
        const value = ref(state.value);
        const get = () => value.value;
        const set = (newValue) => {
            value.value = newValue;
            triggerRef(value);
        };
        const unsubscribe = state.subscribe(set);
        onUnmounted(() => unsubscribe());
        return { set, get };
    }
    else {
        const value = ref(state);
        const get = () => value.value;
        const set = (newValue) => {
            value.value = newValue;
            triggerRef(value);
        };
        return { set, get };
    }
}

export { State, createState, useState };
//# sourceMappingURL=index.mjs.map
