import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuthenticated: false,
    isLoading: false,
    token: localStorage.getItem("token") || "",
    user: {}
  },
  // Vuex mutations are used to change the state of the vuex store
  mutations: {
    auth_request(state) {
      state.isLoading = true;
    },
    auth_success(state, { token, user }) {
      state.token = token;
      state.user = user;
      state.isAuthenticated = true,
      state.isLoading = false
    },
    auth_error(state) {
      state.isLoading = false,
      state.isAuthenticated = false,
      state.token = null,
      state.user = {}
    },
    logout(state) {
      state.token = null;
      state.user = {};
      state.isAuthenticated = false,
      state.isLoading = false
    }
  },
  // Vuex actions are used to commit mutations to the vuex store
  actions: {
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        axios({
          url: "http://localhost:3000/api/auth/login",
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
          url: "http://localhost:3000/api/user",
          data: user,
          method: "POST"
        })
          .then(res => {
            const { token, user } = res.data;

            localStorage.setItem("token", token);
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
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        commit("logout");
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["x-auth-token"];
        resolve();
      });
    },
    verifyToken({ commit }) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        axios({
          url: "http://localhost:3000/api/auth",
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
    }
  },
  // Use a vuex getter to get a value of vuex state
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    isLoading: state => state.isLoading
  }
});