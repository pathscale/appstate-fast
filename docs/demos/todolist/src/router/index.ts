import { createRouter, createWebHashHistory } from "vue-router";
import TodoList from "../components/TodoList";
const routes = [
    {
        path: "/",
        redirect: "/login",
    },
    {
        path: "/",
        component: TodoList,
        name: "login",
    },
];

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
});
