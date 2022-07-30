import Vue, { createApp } from 'vue' // CHANGE
import App from './App.vue'

//
import store from './store/store'
import router from './router/routes'
import axios from 'axios'
//
axios.defaults.withCredentials = false;


import { configureCompat } from 'vue'
configureCompat({
  GLOBAL_MOUNT: 'suppress-warning',
  GLOBAL_EXTEND: 'suppress-warning',
  WATCH_ARRAY: 'suppress-warning',
  INSTANCE_EVENT_EMITTER: 'suppress-warning',
  COMPONENT_V_MODEL: 'suppress-warning',
  RENDER_FUNCTION: 'suppress-warning',
  COMPONENT_FUNCTIONAL: 'suppress-warning',
  INSTANCE_SCOPED_SLOTS: 'suppress-warning',
  INSTANCE_LISTENERS: 'suppress-warning',
  OPTIONS_BEFORE_DESTROY: 'suppress-warning',


})

// import { createRouter, createWebHistory } from 'vue-router'
import vuetify from './plugins/vuetify' // 

// import AssetList from './view/asset/AssetList.vue'
// import GeneralTemplate from './view/general/General.vue';
// import LoginView from "./view/login/LoginView.vue";

import {coki} from './components/common/storage.js';
Vue.prototype.$coki = coki;


// const routes = [
//   { path: '/', component: LoginView},
//   { path: '/asset', component: AssetList },
//   { path: '/overview', component: GeneralTemplate },
//   { path: '/*', component: LoginView },
// ]

// const router = createRouter({
//   history: createWebHistory(),
//   routes: routes
// })

export const bus = new Vue();




createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .mount('#app')
