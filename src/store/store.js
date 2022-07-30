import axios from "axios";
import createPersistedState from "vuex-persistedstate";
import { createStore } from "vuex";

const store = createStore({
    state() {
        return {
            user: null,
            wrongPass: false,
        };
    },
    mutations: {
        /**
         * Mô tả: Set lại user
         */
        setUser(state, username) {
            state.user = username;
        },
        /**
         * Mô tả: Hàm đăng xuất, xóa user trên store
         */
        logout(state) {
            state.user = null;
        },
        /**
         * Mô tả: Set trạng thái có sai mật khẩu hay không
         */
        setWrongPass(state, isWrongPass) {
            state.wrongPass = isWrongPass;
        },
    },
    getters: {
        /**
         * Mô tả: Hàm kiểm tra authen hay chưa bằng cách so sánh user
         */
        isAuthentication(state) {
            return !!state.user;
        },
        /**
         * Mô tả: Check và lấy ra xem mật khẩu có đang sai hay không
         */
        isWrongPass(state) {
            return state.wrongPass;
        },
    },
    actions: {
        /**
         * Mô tả: Hàm thực hiện login ở vuex với user được commit lên
         * @param user (FormData), commit
         */
        async login({ commit }, user) {
            // var me = this;
            await axios
                .post(
                    "https://localhost:44307/api/v1/User",
                    {
                        username: user.username,
                        password: user.password,
                    },
                    {
                        withCredentials: false,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                )
                .then(async function (res) {
                    console.log(res.data);
                    if (res.data != -1) {
                        await commit("setUser", user.username);
                        await commit("setWrongPass", false);
                    } else {
                        await commit("setWrongPass", true);
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
        },
        /**
         * Mô tả: Hàm đăng xuất, call api xóa cookie
         */
        async logout({ commit }) {
            await commit("logout");
            await axios.get("https://localhost:44383/api/v1/User");
        },
    },
    plugins: [createPersistedState()],
});

export default store;
