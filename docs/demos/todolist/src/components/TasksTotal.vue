<script>
import {watchEffect} from 'vue'
import {settingStorage, taskStorage} from '../states'
import { useState } from '@pathscale/appstate-fast'
export default {
    setup() {
        const setting = useState(settingStorage)
        const task = useState(taskStorage)
        return {setting, task}
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
                    backgroundColor: '#00ff00'
                }" />
            <div
                :style="{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    flexGrow: 2
                }">
                <div>Total tasks: {{task.length}}</div>
                <div>Done: {{task.filter(i => i.done.value).length}}</div>
                <div>
                    Remaining: {{task.filter(i => !i.done.value).length}}
                </div>
            </div>
        </div>
</template>
