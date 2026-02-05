import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import naive from "naive-ui";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(naive);
app.mount("#app");
