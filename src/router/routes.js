import AssetList from "../view/asset/AssetList.vue";
import GeneralTemplate from "../view/general/General.vue";
import LoginView from "../view/login/LoginView.vue";

import { createRouter, createWebHistory } from "vue-router";

import store from "../store/store";

const routes = [
    {
        path: "/",
        name: "login",
        component: LoginView,
        meta: { guest: true },
    },
    {
        path: "/asset",
        name: "asset",
        component: AssetList,
        meta: { requiresAuth: true },
    },
    {
        path: "/overview",
        name: "overview",
        component: GeneralTemplate,
        meta: { requiresAuth: true },
    },
    {
        path: "/login",
        name: "loginPage",
        component: LoginView,
        meta: { guest: true },
    },
    //Nếu path không tồn tại thì chuyển về login
    {
        path: "/:pathMatch(.*)*",
        name: "unknown",
        component: LoginView,
        meta: { guest: true },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (store.getters.isAuthentication) {
            next();
            return;
        }
        next("/");
    } else next();
});

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.guest)) {
        if (store.getters.isAuthentication) {
            next("/asset");
            return;
        }
        next();
    } else {
        next();
    }
});

export default router;
