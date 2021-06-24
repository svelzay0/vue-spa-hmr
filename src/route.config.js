import Vue from "vue";
import VueRouter from "vue-router";
import * as views from "../src/views/index";

Vue.use(VueRouter);

Object.keys(views).forEach(key => {
  const view = views[key];
  Vue.component(key, view);
});

const routes = [
  {
    path: "/Home",
    component: views.Home
  },
  {
    path: "/About",
    component: views.About
  }
];

const router = new VueRouter({ routes });

new Vue({ router }).$mount("#app");
