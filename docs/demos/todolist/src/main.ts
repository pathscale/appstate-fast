import { createApp } from "vue";
import { router } from "./router";
import { stateSymbol, state } from "./state";
import App from "./App"; //need to check
import "./assets/styles/index.css";
import "@pathscale/bulma-pull-2981-css-var-only/css/bulma.css";
import "@pathscale/bulma-extensions-css-var/css/bulma-extensions-css-var.css";

createApp(App).provide(stateSymbol, state).use(router).mount("#app");
