<script>
import {settingStorage, taskStorage} from '../states'
import { useState } from '@pathscale/appstate-fast'
import {ref, onMounted} from 'vue'
import TaskEditor from './TaskEditor'
export default {
    components: { TaskEditor },
    setup () {
        const setting = useState(settingStorage)
        const taskState = useState(taskStorage)

        const isPromised = ref(true)


        const findMaxID = () => taskState.value.length >= 1 ? Math.max.apply(Math, taskState.value.map(function(o) { return o.id; })) : 0

        const pushTask = () => {
            const newTask = {
                id: findMaxID() + 1,
                name: 'Spread few words about Hookstate',
                done: false
            }
            taskState.value = [...taskState.value, newTask]
        }

        onMounted(async () => {
            taskState.value = [...await taskState.value]
            
            setTimeout(pushTask, 7000)
            isPromised.value = false
        })


        const addNewTak = () => {
            const newId = findMaxID() + 1
            const newTask = {
                id: newId,
                name: 'Untitled Task #' + newId ,
                done: false
            }
            taskState.value = [...taskState.value, newTask]
        }
        return {taskState, addNewTak, isPromised}
    }
}
</script>

<template>
    <div>
        <div v-if="isPromised">Loading initial state asynchronously...</div>
        <div v-if="!isPromised">
            <task-editor v-for="(val, i) in taskState" :key="val.id" :index="i" :task="val" />
            <div :style="{textAlign: 'right'}">
                    <button
                        @click="addNewTak"
                        :style="{
                            marginTop: '20px', minWidth: '300px',
                            borderColor: 'lightgreen'
                        }">Add new task</button>
            </div>
        </div>
    </div>
</template>
