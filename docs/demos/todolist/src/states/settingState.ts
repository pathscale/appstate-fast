import {useState, createState} from '@pathscale/appstate-fast';


function CreateSettingState () {
    const state = createState({isEditableInline: true,isScopedUpdateEnabled: true,isHighlightUpdatesEnabled: false});

    const settingState = useState(state);

    const useSettingState = {
        isEditableInline(){
            return settingState.value.isEditableInline;
        },
        toogleEditableInline () {
            settingState.value.isEditableInline = !this.isEditableInline();
        },
        isScopedUpdateEnabled () {
            return settingState.value.isScopedUpdateEnabled
        },
        toogleScopedUpdate () {
            settingState.value.isScopedUpdateEnabled = !this.isScopedUpdateEnabled()
        },
        isHighlightUpdateEnabled() {
            return settingState.value.isHighlightUpdatesEnabled;
        },
        toogleHighlightUpdate() {
            settingState.value.isHighlightUpdatesEnabled = !this.isHighlightUpdateEnabled();
        }
    }
    return useSettingState
}
export default CreateSettingState