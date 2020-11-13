<script>
import {watchEffect, ref} from 'vue'
import {settingStorage, taskStorage} from '../states'
import { useState } from '@pathscale/appstate-fast'
export default {
    setup() {
        const setting = useState(settingStorage)
        const task = useState(taskStorage)

        watchEffect (()=> {
            console.log(task.value)
        }) 

        // This is the trick to obtain different color on every run of this function
        const colors = ["#ff0000", "#00ff00", "#0000ff"];
        const color = ref(0);
        const nextColor = useState(colors[0])
        watchEffect(()=> {
            if (setting.value) {
                color.value += 1;
                nextColor.value = colors[color.value % colors.length];
            }
        })
        return {setting, task, nextColor}
    }
}
</script>
<template>
    <div
        :style="{
            display: 'flex',
            justifyContent: 'space-evenly',
            marginBottom: '30px'
        }">
            <div v-if="setting.isHighlightUpdatesEnabled" 
                :style="{
                    width: '10px',
                    marginRight: '15px',
                    backgroundColor: nextColor
                }" />
            <div
                :style="{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    flexGrow: 2
                }">
                <div>Total tasks: {{task.length}}</div>
                <div>Done: {{task.filter(i => i.done).length}}</div>
                <div>
                    Remaining: {{task.filter(i => !i.done).length}}
                </div>
            </div>
        </div>
</template>
