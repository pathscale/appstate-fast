<script>
import {onMounted, ref, watchEffect, reactive} from 'vue'
import { useState } from '@pathscale/appstate-fast'
import {settingStorage, taskStorage} from '../states'
export default {
    props: ['task'],
    setup ({task, ...props}) {
        const setting = useState(settingStorage)
        let taskState = useState(task)
        let globalTask = useState(taskStorage)
        const taskNameLocal = useState(taskState.value.name)

        // if (!setting.isScopedUpdateEnabled) {
        //     taskState = task
        // }

        const isEditing = useState(false);

        // var colors = ["#ff0000", "#00ff00", "#0000ff"];
        const colors = ["#ff0000", "#00ff00", "#0000ff"];
        // const color = React.useRef(0);
        const color = ref(0);
        // color.current += 1;
        
        // var nextColor = colors[color.current % colors.length];
        const nextColor = useState(colors[0])

        watchEffect(()=> {
            if (setting.value && taskState.value && taskNameLocal.value) {
                color.value += 1;
                nextColor.value = colors[color.value % colors.length];
            }

            // if (!setting.value.isScopedUpdateEnabled) {
            //    taskState = task
            //    direct assign taskState as task is not reactive
            // }
        })

        const toogleDone = (id) => {
            taskState.value = {...taskState.value, done: !taskState.value.done}
            globalTask.value.forEach(x => {
                if (x.id === id) x.done = taskState.value.done
            })
            globalTask.value = [...globalTask.value]
        }

        const changeName = (id) => {
            taskState.value = {...taskState.value, name: taskNameLocal.value}
            globalTask.value.forEach(x => {
                if (x.id === id) x.name = taskState.value.name
            })
            globalTask.value = [...globalTask.value]

        }

        const deleteTask = (id) => {
            taskState = null
            const filter = globalTask.value.filter(val => val.id !== id)
            globalTask.value = [...filter]
        }

        return {setting, nextColor, isEditing, taskState, taskNameLocal, toogleDone, changeName, deleteTask}
    }
}
</script>
<template>
    <div :style="{
        display: 'flex',
        marginBottom: '10px'
    }">
        <!-- backgroundColor: nextColor -->
        <div v-if="setting.isHighlightUpdatesEnabled" :style="{
            width: '10px',
            marginRight: '10px',
            backgroundColor: nextColor
            
        }" />
        <div :style="{
            flexGrow: 2,
            display: 'flex',
            border: 'solid',
            border: setting.isEditableInline || isEditing ? 1 : 0,
            borderColor: 'grey'
        }">
            <div>
                <input :style="{
                    transform: 'scale(2)',
                    margin: '20px'
                }" type="checkbox" :checked="taskState.done" @change="() => {toogleDone(taskState.id)}" />
            </div>
            <div :style="{flexGrow: 2}">
                <input :style="{
                    fontSize: '1em',
                    background: 'none',
                    border: 'none',
                    color: 'black',
                    width: '90%',
                    padding: '10px',
                    textDecoration: taskState.done ? 'line-through':'none'
                }"
                    @keyup="(e)=> {
                        taskNameLocal = e.target.value
                        if (setting.isEditableInline) changeName(taskState.id)
                    }"
                    :readonly="!(setting.isEditableInline || isEditing)"
                    :value="!isEditing ? taskState.name : taskNameLocal" />
            </div>
        </div>
        <div v-if="!setting.isEditableInline">
            <button v-if="isEditing" :style="{marginLeft: '20px'}"
                @click="() => {
                    isEditing = false
                    changeName(taskState.id)
                }">Save</button>
            <button v-if="!isEditing" :style="{marginLeft: '20px'}" @click="()=> {isEditing = true}">Edit</button>
        </div>
        <div :style="{marginLeft: '15px'}">
            <button v-if="isEditing" :style="{
                borderColor: 'red'
            }" @click="() => {
                isEditing = false
                taskNameLocal = taskState.name
            }">Cancel</button>
            <button v-if="!isEditing" :style="{
                borderColor: 'red'
            }" @click="() => {
                isEditing = false
                deleteTask(taskState.id)
            }">Delete</button>
        </div>
    </div>
</template>