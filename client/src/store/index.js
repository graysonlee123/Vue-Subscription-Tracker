import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuthenticated: false,
    isLoading: false,
    token: localStorage.getItem("token") || "",
    user: {},
    preferences: {
      language: "en"
    },
    alerts: []
  },
  // Vuex mutations are used to change the state of the vuex store
  mutations: {
    auth_request(state) {
      state.isLoading = true;
    },
    auth_success(state, { token, user }) {
      state.token = token;
      state.user = user;
      (state.isAuthenticated = true), (state.isLoading = false);
    },
    auth_error(state) {
      (state.isLoading = false),
        (state.isAuthenticated = false),
        (state.token = null),
        (state.user = {});
    },
    refresh_user(state, user) {
      state.user = user;
    },
    logout(state) {
      state.token = null;
      state.user = {};
      (state.isAuthenticated = false), (state.isLoading = false);
    },
    change_language(state, lang) {
      state.preferences.language = lang;
    },
    add_modal(state, modal) {
      state.alerts.push(modal);
    },
    remove_modal(state, modalId) {
      const index = state.alerts.findIndex(alert => alert.uuid === modalId);

      if (index > -1) {
        state.alerts.splice(index, 1);
      }
    },
    clear_modals(state) {
      state.alerts = [];
    }
  },
  // Vuex actions are used to commit mutations to the vuex store
  actions: {
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit("auth_request");

        axios({
          url: "/api/auth/login",
          data: user,
          method: "POST"
        })
          .then(res => {
            const token = res.data.token;
            const user = res.data.user;

            localStorage.setItem("token", token);

            // Sets the header auth header for future axios requests
            axios.defaults.headers.common["x-auth-token"] = token;

            commit("auth_success", { token, user });
            resolve(res);
          })
          .catch(err => {
            commit("auth_error");
            localStorage.removeItem("token");
            reject(err);
          });
      });
    },
    register({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit("auth_request");

        axios({
          url: "/api/user",
          data: user,
          method: "POST"
        })
          .then(res => {
            const { token, user } = res.data;

            localStorage.setItem("token", token);

            // Sets the header auth header for future axios requests
            axios.defaults.headers.common["x-auth-token"] = token;

            commit("auth_success", { token, user });
            resolve(res);
          })
          .catch(err => {
            commit("auth_error", err);
            localStorage.removeItem("token");
            reject(err);
          });
      });
    },
    logout({ dispatch, commit }) {
      return new Promise(async resolve => {
        commit("logout");
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["x-auth-token"];

        await dispatch("addModal", {
          type: "success",
          message: "You have been logged out.",
          uuid: uuidv4()
        });
        resolve();
      });
    },
    verifyToken({ commit }) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        axios({
          url: "/api/auth",
          method: "GET"
        })
          .then(res => {
            const { token, user } = res.data;
            commit("auth_success", { token, user });
            resolve(res);
          })
          .catch(err => {
            commit("auth_error", err);
            localStorage.removeItem("token");
            reject(err);
          });
      });
    },
    languageChange({ commit }, lang) {
      commit("change_language", lang);
    },
    refreshUser({ commit }) {
      return new Promise((resolve, reject) => {
        axios({
          url: "/api/user",
          method: "GET"
        })
          .then(res => {
            const { user } = res.data;
            commit("refresh_user", user);
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    addModal({ commit }, modal) {
      commit("add_modal", modal);

      setTimeout(() => {
        commit("remove_modal", modal.uuid);
      }, modal.duration || 3000);
    }
  },
  // Use a vuex getter to get a value of vuex state
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    isLoading: state => state.isLoading,
    alert: state => state.alerts[0] || null
  }
});
