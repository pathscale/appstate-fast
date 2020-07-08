import { reactive, inject } from "vue";

export const stateSymbol = Symbol("state");
export const state = reactive({ todoList: [] });

export const useState = () => inject(stateSymbol);
