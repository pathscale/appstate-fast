'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');

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
        const subscriber = vue.ref(state.value);
        const unsubscribe = state.subscribe({ ref: subscriber });
        vue.onUnmounted(() => unsubscribe());
        return subscriber;
    }
    else {
        const value = vue.ref(state);
        return value;
    }
}

exports.State = State;
exports.createState = createState;
exports.useState = useState;
//# sourceMappingURL=index.js.map
