<template>
    <div :style="{
        display: 'flex',
        marginBottom: 10
    }">
        <!-- backgroundColor: nextColor -->
        <div v-if="false" :style="{
            width: 10,
            marginRight: 15,
            
        }" />
        <div :style="{
            flexGrow: 2,
            display: 'flex',
            border: 'solid',
            border: true ? 1 : 0
        }">
            <div>
                <input :style="{
                    transform: 'scale(2)',
                    margin: 20
                }" type="checkbox" checked />
            </div>
            <div :style="{flexGrow: 2}">
                <input :style="{
                    fontSize: '1em',
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    width: '90%',
                    padding: 10,
                    textDecoration: true ? 'line-through':'none'
                }" />
            </div>
        </div>
        <div v-if="true">
            <button :style="{marginLeft: 20}">{{true ? 'Save': 'Edit'}}</button>
        </div>
    </div>
</template>