import Vue from "vue";
import Router from "vue-router";

// Components
import Homepage from "@/components/Homepage";
import Login from "@/components/Auth/Login";
import Register from "@/components/Auth/Register";
import WebApp from "@/components/WebApp/WebApp";
import Dashboard from "@/components/WebApp/Dashboard";
import Account from "@/components/WebApp/Account";
import Settings from "@/components/WebApp/Settings";
import catchAll from "@/components/404";

import store from "../store";

Vue.use(Router);

let router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Landing",
      component: Homepage
    },
    {
      path: "/about",
      name: "about",
      component: Homepage
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/register",
      name: "register",
      component: Register
    },
    {
      path: "/app",
      name: "App",
      component: WebApp,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: "dashboard",
          name: "Dashboard",
          alias: "",
          component: Dashboard
        },
        {
          path: "account",
          name: "Account",
          component: Account
        },
        {
          path: "settings",
          name: "Settings",
          component: Settings
        }
      ]
    },
    {
      path: "*",
      name: "404",
      component: catchAll
    }
  ]
});

// Vue has this method which is called before each route is processed,
// so this is where we define our checking conditions and restrict access

// @param to    where the user wishes to go
// @param from  where the user is coming from
// @param next  a callback function that continues the process
router.beforeEach((to, from, next) => {
  // TODO: Figure out a better way to load pages after checking for authentication
  function checkIsLoading() {
    setTimeout(() => {
      if (store.getters.isLoading) checkIsLoading();
      else {
        // If the to param is going somewhere that requires auth...
        if (to.matched.some(record => record.meta.requiresAuth)) {
          if (store.getters.isAuthenticated) {
            next();
            return;
          } else {
            next("/login");
          }
        } else {
          next();
        }
      }
    }, 10);
  }

  checkIsLoading();
});

export default router;
