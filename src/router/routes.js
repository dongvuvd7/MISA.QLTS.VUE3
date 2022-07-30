import AssetList from '../view/asset/AssetList.vue'
import GeneralTemplate from '../view/general/General.vue';
import LoginView from "../view/login/LoginView.vue";

import { createRouter, createWebHistory } from 'vue-router'

import store from "../store/store";

const routes = [
    {
        path: '/',
        name: 'login',
        component: LoginView,
        beforeEnter: (to, from, next) => {
            if (store.getters.isAuthentication) {
                next({ name: 'asset' })
            } else {
                next()
            }
        }
    },
    {
        path: '/asset',
        name: 'asset',
        component: AssetList,
        beforeEnter: (to, from, next) => {
            if (store.getters.isAuthentication) {
                next()
            } else {
                next({ name: 'login' })
            }
        }
    },
    {
        path: '/overview',
        name: 'overview',
        component: GeneralTemplate,
        beforeEnter: (to, from, next) => {
            if (store.getters.isAuthentication) {
                next()
            } else {
                next({ name: 'login' })
            }
        }
    },
    //Nếu path không tồn tại thì chuyển về login
    {
        path: '/*',
        name: 'unknown',
        component: LoginView,
        beforeEnter: (to, from, next) => {
            if (store.getters.isAuthentication) {
                next({ name: 'asset' })
            } else {
                next()
            }
        }
    },


];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;