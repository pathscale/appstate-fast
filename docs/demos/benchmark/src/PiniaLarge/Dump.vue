<template>
    <div>
        <div>Last render at: {{time}} (JSON dump of the first 10 fields) :</div>
        <div v-html="props.state.join('<br/>')">
        </div>
    </div>
</template>

<script setup>
    import { useState } from "@pathscale/appstate-fast";
    import { defineProps, watch} from 'vue'
    const props = defineProps({
        state: {
            type: Array,
            default: []
        }
    })

    const time = useState(0)
    time.set(new Date().toISOString())
    watch(() => props.state, (v) => {
        time.set(new Date().toISOString())
    })
</script>

<style scoped>
    tr:nth-child(even) {
        background-color: white;
    }
    tr:nth-child(odd) {
        background-color: black;
        color: white;
    }
</style>
