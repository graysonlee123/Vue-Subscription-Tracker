import Vue from "vue";
import Router from "vue-router";

// Components
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import Dashboard from "../components/WebApp/Dashboard";
import SubscriptionForm from "../components/WebApp/SubscriptionForm";
import SettingsSidebar from "../components/WebApp/Settings/SettingsSidebar";
import Preferences from "../components/WebApp/Settings/Preferences";
import AdvancedSettings from "../components/WebApp/Settings/AdvancedSettings";
import Account from "../components/WebApp/Settings/Account";
import Password from "../components/WebApp/Settings/Password";
import catchAll from "../components/404";
import SubscriptionsList from "../components/WebApp/SubscriptionsList";
import ViewSubscription from "../components/WebApp/ViewSubscription";
import Sidebar from "../components/WebApp/Sidebar"

import store from "../store";

Vue.use(Router);

const router = new Router({
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
          path: "subscription",
          component: Sidebar,
          children: [
            {
              path: "new",
              name: "New Subscription",
              component: SubscriptionForm
            },
            {
              path: ":subscriptionId/view",
              props: true,
              component: ViewSubscription
            },
            {
              path: ":subscriptionId/edit",
              props: true,
              component: SubscriptionForm
            }
          ]
        },
        {
          path: "settings",
          component: Sidebar,
          children: [
            {
              path: "",
              redirect: "preferences"
            },
            {
              path: "preferences",
              name: "Preferences",
              component: Preferences
            },
            {
              path: "account",
              name: "Account",
              component: Account
            },
            {
              path: "password",
              name: "Password",
              component: Password
            },
            {
              path: "advanced",
              name: "Advanced",
              component: AdvancedSettings
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
