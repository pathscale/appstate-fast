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
    // if (state instanceof State) {
    //   const value = ref(state.value) as Ref<S>
    //   const set = (newValue: S) => {
    //     value.value = newValue
    //     triggerRef(value)
    //   }
    //   const unsubscribe = state.subscribe(set)
    //   onUnmounted(() => unsubscribe())
    //   return { state: readonly(value) as Ref<S>, set }
    // } else {
    //   const value = ref(state) as Ref<S>
    //   const set = (newValue: S) => {
    //     value.value = newValue
    //     triggerRef(value)
    //   }
    //   return { state: readonly(value) as Ref<S>, set }
    // }
    vue.onMounted(() => console.log('mounted!'));
    vue.onUnmounted(() => console.log('unmounted!'));
    return {
        state: vue.readonly({}),
        set: () => {
            /**/
        },
    };
}

exports.State = State;
exports.createState = createState;
exports.useState = useState;
//# sourceMappingURL=index.js.map
