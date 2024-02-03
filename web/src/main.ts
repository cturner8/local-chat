import { createApp } from "vue";
import App from "./App.vue";
import "./main.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const app = createApp(App);

library.add(fas, faPlus);
app.component("FontAwesomeIcon", FontAwesomeIcon);

app.mount("#app");
