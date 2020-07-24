// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import store from "./store";
import vueMoment from "vue-moment";

Vue.prototype.$http = axios;

Vue.use(vueMoment);

new Vue({
  router,
  store,
  el: "#app",
  render: h => h(App)
});
