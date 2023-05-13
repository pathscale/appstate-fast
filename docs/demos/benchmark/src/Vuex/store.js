import { createStore, Store } from "vuex";

const initial = {
    data: Array.from(Array(50).keys()).map((i) =>
        Array.from(Array(50).keys()).map((j) => 0)
    ),
    running: false,
    startTime: new Date().getTime(),
    metrics: {
        totalSum: 0,
        totalCalls: 0,
        elapsed: 0,
        rate: 0,
    },
    largeData: []
}

export default createStore({
    state: { ...initial },
    mutations: {
        start(state) {
            state.running = true;
        },
        stop(state) {
            state.running = false;
        },
        incrementCell(state, { row, column, amount }) {
            state.data[row][column] += amount;
        },
        updateMetrics(state, metrics) {
            state.metrics = {...metrics}
        },
        clear(state) {
            Object.assign(state, initial, { startTime: new Date().getTime() })
        },
        incrementRow(state, {i, v}) {
            state.largeData[i] = v;
        },
        largeIncrement(state, data ) {
            state.largeData = data;
        }
    },
    getters: {
        largeState(state) {
            return state.largeData.length > 10 ? state.largeData.slice(0, 10) : []
        }
    },
    actions: {
        increment({ commit, state }, { row, column, amount }) {
            commit("incrementCell", { row, column, amount })

            const elapsedMs = new Date().getTime() - state.startTime
            commit("updateMetrics", {
                totalSum: state.metrics.totalSum + amount,
                totalCalls: state.metrics.totalCalls + 1,
                elapsed: Math.floor(elapsedMs / 1000),
                rate: Math.floor((state.metrics.totalCalls / elapsedMs) * 1000)
            })
        }
    }
});
