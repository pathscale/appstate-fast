<template>
    <div :style="{display: 'flex', justifyContent: 'space-evenly', marginBottom: 30}">
        <div v-if="settingsState.isHighlightUpdateEnabled" :style="{
                width: 10,
                marginRight: 15,
                backgroundColor: nextColor
            }" />
    </div>
</template>

<script>
export default {
    setup() {
        const settingsState = {isHighlightUpdateEnabled: true}
        const colors = ["#ff0000", "#00ff00", "#0000ff"];
        const color = 0;
        color.value += 1;
        const nextColor = colors[color.value % colors.length];
        return {settingsState, nextColor}
    }
}
</script>