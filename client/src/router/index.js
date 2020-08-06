import Vue from "vue";
import Router from "vue-router";

// Components
import Homepage from "../components/Homepage";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import Dashboard from "../components/WebApp/Dashboard";
import SubscriptionForm from "../components/WebApp/SubscriptionForm";
import Subscription from "../components/WebApp/Subscription";
import Settings from "../components/WebApp/Settings/Settings";
import Preferences from "../components/WebApp/Settings/Preferences";
import Profile from "../components/WebApp/Settings/Profile";
import catchAll from "../components/404";
import SubscriptionsList from "../components/WebApp/SubscriptionsList";

import store from "../store";

Vue.use(Router);

let router = new Router({
  mode: "history",
  base: "/app",
  routes: [
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
      path: "/dashboard",
      component: Dashboard,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: "",
          name: "Dashboard",
          name: "Subscriptions List",
          component: SubscriptionsList
        },
        {
          path: "subscription/:subscriptionId",
          name: "Edit Subscription",
          component: SubscriptionForm,
          props: true
        },
        {
          path: "subscription",
          name: "New Subscription",
          component: SubscriptionForm
        },
        {
          path: "settings",
          name: "Settings",
          component: Settings,
          children: [
            {
              path: "profile",
              name: "Profile settings",
              component: Profile
            },
            {
              path: "theme",
              name: "Theme settings",
              component: Preferences
            },
            {
              path: "preferences",
              name: "Preferences",
              alias: "",
              component: Preferences
            }
          ]
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
