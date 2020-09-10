import Vue from "vue";
import Router from "vue-router";
import store from "../store";

// Components
import Login from "../components/auth-pages/Login";
import Register from "../components/auth-pages/Register";

import Dashboard from "../components/dashboard/Dashboard";

import Settings from "../components/settings/Settings";
import Preferences from "../components/settings/Preferences";
import Account from "../components/settings/Account";
import Password from "../components/settings/Password";
import AdvancedSettings from "../components/settings/AdvancedSettings";

import Subscription from "../components/subscription/Subscription";
import SubscriptionForm from "../components/subscription/SubscriptionForm";
import SubscriptionView from "../components/subscription/SubscriptionView";

import catchAll from "../components/404";

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
      path: "/settings",
      component: Settings,
      meta: { requiresAuth: true },
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
    },
    {
      path: "/subscription",
      components: {
        default: Subscription
      },
      children: [
        {
          path: "",
          alias: "new",
          name: "New Subscription",
          component: SubscriptionForm
        },
        {
          path: "view/:subscriptionId",
          props: true,
          component: SubscriptionView
        },
        {
          path: "edit/:subscriptionId",
          props: true,
          component: SubscriptionForm
        }
      ]
    },
    {
      path: "/dashboard",
      components: {
        default: Dashboard,
      },
      meta: {
        requiresAuth: true
      }
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
