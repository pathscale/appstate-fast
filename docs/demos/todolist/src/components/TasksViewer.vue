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


        const addNewTak = () => {
            const findMax = Math.max.apply(Math, task.value.map(function(o) { return o.id; }))
            const newId = findMax + 1
            const newTask = {
                id: newId,
                name: 'Untitled Task #' + newId ,
                done: false
            }
            task.value = [...task.value, newTask]
        }
        return {task, addNewTak}
    }
}
</script>

<template>
    <div>
        <task-editor v-for="(val, i) in task" :key="i" :task="val" />
        <div :style="{textAlign: 'right'}">
                <button
                    @click="addNewTak"
                    :style="{
                        marginTop: '20px', minWidth: '300px',
                        borderColor: 'lightgreen'
                    }">Add new task</button>
        </div>
    </div>
</template>
