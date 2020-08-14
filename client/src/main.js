import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import store from "./store";

Vue.prototype.$http = axios;

new Vue({
  router,
  store,
  el: "#app",
  render: h => h(App)
});
