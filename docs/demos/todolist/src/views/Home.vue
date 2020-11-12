<template>
  <div style="display: flex;">
      <div :style="{ flexGrow: 2 }" />
      <div
        style="
          minHeight: 100vh;
          display: flex;
          flexDirection: column;
          justifyContent: center;
          fontSize: 28;
          color: 'white';
        ">
        <div style="minWidth: 400; maxWidth: 800; padding: 20;">
          <div style="marginBottom: 30;">
            This is
            <a
              style="color: #09d3ac;"
              href="https://github.com/avkonst/hookstate"
              target="_blank"
              rel="noopener noreferrer">Hookstate</a>
              demo application. Source code is on
              <a
                style="color: #09d3ac;"
                href="https://github.com/avkonst/hookstate/tree/master/docs/demos/todolist"
                target="_blank"
                rel="noopener noreferrer">GitHub</a>.
          </div>
          <settings-viewer />
          <tasks-total />
          <tasks-viewer />
        </div>
      </div>
      <div :style="{flexGrow: 2}" />
  </div>
</template>

<script>
import {useState, createState} from '@pathscale/appstate-fast'
import SettingsViewer from '../components/SettingsViewer'
import  TasksTotal from "../components/TasksTotal";
import TasksViewer from '../components/TasksViewer'

export default {
  components: { SettingsViewer, TasksTotal, TasksViewer }
}
</script>

<style scoped>
.todo-length {
  background: darkslategray;
  color: white;
  width: 20%;
  font-size: 20px;
  margin: auto;
  margin-bottom: 20px;
}
</style>
