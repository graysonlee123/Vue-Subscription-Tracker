import Vue from "vue";
import Router from "vue-router";

// Components
import HelloWorld from "@/components/HelloWorld";
import Login from "@/components/Login";
import Register from "@/components/Register";
import MainApp from "@/components/MainApp/MainApp";
import Dashboard from "@/components/MainApp/Dashboard";
import Account from "@/components/MainApp/Account";
import Settings from "@/components/MainApp/Settings";
import catchAll from "@/components/404";

import store from "../store";

Vue.use(Router);

let router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "HelloWorld",
      component: HelloWorld
    },
    {
      path: "/about",
      name: "about",
      component: HelloWorld
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
      name: "app",
      component: MainApp,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: "dashboard",
          alias: "",
          component: Dashboard
        },
        {
          path: "account",
          component: Account
        },
        {
          path: "settings",
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
