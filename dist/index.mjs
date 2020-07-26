import { ref, onUnmounted } from 'vue';

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
        this.subscribers.forEach(s => {
            s.ref.value = this.val;
            console.log(s.ref.value);
        });
    }
    update(op) {
        op(this.val);
        this.subscribers.forEach(s => {
            s.ref.value = this.val;
            console.log(s.ref.value);
        });
    }
    subscribe(subscriber) {
        this.subscribers.push(subscriber);
        return () => {
            const index = this.subscribers.indexOf(subscriber);
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
        const subscriber = ref(state.value);
        const unsubscribe = state.subscribe({ ref: subscriber });
        onUnmounted(() => unsubscribe());
        return subscriber;
    }
    else {
        const value = ref(state);
        return value;
    }
}

export { State, createState, useState };
//# sourceMappingURL=index.mjs.map
