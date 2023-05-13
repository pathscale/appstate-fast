import { defineStore } from 'pinia'

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
    }
}

export const useStore = defineStore('store', {
    state: () => ({
        ...initial
    }),
    actions: {
        start() {
            this.running = true;
        },
        stop() {
            this.running = false;
        },
        incrementCell({ row, column, amount }) {
            this.data[row][column] += amount;
        },
        updateMetrics(metrics) {
            this.metrics = {...metrics}
        },
        clear() {
            this.data = initial.data
            this.running = initial.running
            this.metrics = initial.metrics
            this.startTime = Date.now()
        },
        increment({ row, column, amount }) {
            this.incrementCell({ row, column, amount })
            const elapsedMs = Date.now() - this.startTime
            this.updateMetrics({
                totalSum: this.metrics.totalSum + amount,
                totalCalls: this.metrics.totalCalls + 1,
                elapsed: Math.floor(elapsedMs / 1000),
                rate: Math.floor((this.metrics.totalCalls / elapsedMs) * 1000)
            })
        }
    }
})
