'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');

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
        return vue.ref(state);
    }
    // Global state
    const value = vue.customRef(track => ({
        get() {
            track();
            return state.value;
        },
        set(newValue) {
            state.value = newValue;
            // triggering is done by global state
        },
    }));
    const trigger = () => vue.triggerRef(value);
    const unsubscribe = state.subscribe(trigger);
    vue.onUnmounted(() => unsubscribe());
    return value;
}

exports.State = State;
exports.createState = createState;
exports.useState = useState;
//# sourceMappingURL=index.js.map
