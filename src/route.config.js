import Vue from "vue";
import VueRouter from "vue-router";
import * as views from "../src/views/index";

Vue.use(VueRouter);

// 注册视图组件
Object.keys(views).forEach(key => {
  const view = views[key];
  Vue.component(key, view);
});

// 定义路由
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

// 创建router实例
const router = new VueRouter({ routes });

new Vue({ router }).$mount("#app");
