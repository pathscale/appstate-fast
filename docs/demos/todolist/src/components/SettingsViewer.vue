<script>
import {settingStorage} from '../states'
import { useState } from '@pathscale/appstate-fast'
// import {watchEffect} from 'vue'
export default {
    setup () {
        const setting = useState(settingStorage)
        // {isEditableInline: true,isScopedUpdateEnabled: true,isHighlightUpdatesEnabled: false}
        const toogleEditableInline = () => {
            setting.value = {...setting.value, isEditableInline: !setting.value.isEditableInline}
        }
        const toogleScopedUpdate = () => {
            setting.value = {...setting.value, isScopedUpdateEnabled: !setting.value.isScopedUpdateEnabled}
        }
        const toogleHighlight = () => {
            setting.value = {...setting.value, isHighlightUpdatesEnabled: !setting.value.isHighlightUpdatesEnabled}
        }
        return {setting, toogleHighlight, toogleScopedUpdate, toogleEditableInline}
    }
}
</script>
<template>
    <div :style="{
        border: 'solid',
        borderWidth: 1,
        borderColor: '#09d3ac',
        marginBottom: 30,
        fontSize: '0.8em',
        display: 'flex',
        paddingTop: '10px'
        }">
        <div :style="{flexGrow: 2, display: 'flex' }">
            <div>
                <input
                    :style="{ transform: 'scale(1.6)', marginLeft: '20px' }"
                    type="checkbox"
                    :checked="setting.isEditableInline"
                    @change="toogleEditableInline"
                    />
            </div>
            <div :style="{ paddingLeft: '10px', paddingBottom: '10px' }">
                edit inline
            </div>
        </div>
        <div :style="{ flexGrow: 2, display: 'flex' }">
            <div>
                <input
                    :style="{ transform: 'scale(1.6)', marginLeft: '20px' }"
                    type="checkbox"
                    :checked="setting.isScopedUpdateEnabled"
                    @change="toogleScopedUpdate"
                    />
            </div>
            <div :style="{ paddingLeft: '10px', paddingBottom: '10px' }">
                    use scoped state
            </div>
        </div>
         <div :style="{ flexGrow: 2, display: 'flex' }">
             <div>
                 <input
                    :style="{ transform: 'scale(1.6)', marginLeft: '20px' }"
                    type="checkbox"
                    :checked="setting.isHighlightUpdatesEnabled"
                    @change="toogleHighlight"
                    />
             </div>
             <div :style="{
                        paddingLeft: '10px',
                        paddingBottom: '10px',
                        paddingRight: '10px'
                    }">
                    highlight updates
             </div>
         </div>
    </div>
</template>