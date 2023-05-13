<template>
    <div class="large-row">
        <label>Last render at:</label>
        <span>{{ time }}</span>
        <input :value="props.value" @input="onChange" />
    </div>
</template>

<script setup>
import { useState } from "@pathscale/appstate-fast";
import {defineEmits, defineProps, onMounted} from 'vue'

const props = defineProps({
    value: {
        type: String,
        default: ''
    },
    index: {
        type: Number,
        default: 0
    }
})

const emit = defineEmits(['change'])
const time = useState(0)
const onChange = (e) => {
    time.set(new Date().toISOString())
    emit('change', e.target.value, props.index)
}
onMounted(() => {
    time.set(new Date().toISOString())
})
</script>

<style scoped>
.large-row {
    display: flex;
    align-items: center;
}
    .large-row span {
        padding: 0 24px 0 6px;
    }
</style>
