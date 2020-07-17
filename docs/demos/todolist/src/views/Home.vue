<template>
  <div style="display: flex">
    <div style="flex-grow: 2"></div>
    <div
      style="
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 28px;
        background-color:black;
        color:white
      "
    >
      <div style="min-width: 400px; max-width: 800px; padding:20px">
        <div style="margin-bottom:30px">
          This is
          <a
            style="color: #09d3ac"
            href="https://github.com/avkonst/hookstate"
            target="_blank"
            rel="noopener noreferrer"
          >Hookstate</a>
          demo application. Source code is on
          <a
            style="color:#09d3ac"
            href="https://github.com/avkonst/hookstate/tree/master/docs/demos/todolist"
            target="_blank"
            rel="noopener noreferrer"
          >GitHub</a>.
        </div>
        <SettingsViewer />
        <TasksTotal />
        <!-- <TasksViewer /> -->
      </div>
    </div>
    <div style="flex-grow:2" />
  </div>
</template>

<script>
import { onMounted, defineComponent } from "vue";
import { createState, useState } from "@hookstate/vue";
import SettingsViewer from "../components/SettingsViewer.vue";
import TasksTotal from "../components/TasksTotal";
// import  TasksViewer  from "../components/TasksViewer";

export default defineComponent({
  components: {
    SettingsViewer,
    TasksTotal
    // TasksViewer,
  },
  setup() {
    onMounted(() => {
      console.log("component is mounted!");
    });

    const state = useState(
      createState([
        { id: 1, text: "Discover Hookstate" },
        { id: 2, text: "Replace Redux by Hookstate" },
        { id: 3, text: "Enjoy simpler code and faster application" }
      ])
    );

    return { state };
  }
});
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
