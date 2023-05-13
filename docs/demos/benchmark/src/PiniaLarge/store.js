import { defineStore } from 'pinia'

const initial = {
    data: []
}

export const useStore = defineStore('store', {
    state: () => ({
        ...initial
    }),
    getters: {
        largeState() {
            return this.data.length > 10 ? this.data.slice(0, 10) : []
        }
    },
    actions: {
        incrementRow({i, v}) {
            this.data[i] = v;
        },
        largeIncrement( data ) {
            this.data = data;
        }
    }
})
