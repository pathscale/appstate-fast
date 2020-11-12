<script>
import {settingStorage, taskStorage} from '../states'
import { useState } from '@pathscale/appstate-fast'
import {ref} from 'vue'
import TaskEditor from './TaskEditor'
export default {
    components: { TaskEditor },
    setup () {
        const setting = useState(settingStorage)
        const task = useState(taskStorage)

        const [loading] = [true]

        return {loading, task}
    }
}
</script>

<template>
    <div>
        <task-editor v-for="(val, i) in task" :key="i" :task="val" />
    </div>
</template>
