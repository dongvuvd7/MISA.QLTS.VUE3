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
         * Set trạng thái cho user
         * Created by: VDDong (01/08/2022)
         */
        setUser(state, username) {
            state.user = username;
        },
        /**
         * Đăng xuất, Set trạng thái user thành null
         * Created by: VDDong (01/08/2022)
         */
        logout(state) {
            state.user = null;
        },
        /**
         * Set trạng thái có sai mật khẩu hay không
         * Created by: VDDong (01/08/2022)
         */
        setWrongPass(state, isWrongPass) {
            state.wrongPass = isWrongPass;
        },
    },
    getters: {
        /**
         * Hàm kiểm tra đã đăng nhập hay chưa
         * Created by: VDDong (01/08/2022)
         */
        isAuthentication(state) {
            return !!state.user;
        },
        /**
         * Hàm kiểm tra có sai mật khẩu hay không
         * Created by: VDDong (01/08/2022)
         */
        isWrongPass(state) {
            return state.wrongPass;
        },
    },
    actions: {
        /**
         * Hàm thực hiện login:
         * - Đúng account: Set trạng thái cho user để xác nhận đã đăng nhập
         * - Sai account: Set trạng thái sai mật khẩu
         * Created by: VDDong (01/08/2022)
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
                        withCredentials: true,
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
         * Hàm thực hiện đăng xuất: Xóa cookie authen
         */
        async logout({ commit }) {
            await commit("logout");
            await axios.get("https://localhost:44307/api/v1/User", {
                withCredentials: true,
            });
        },
    },
    plugins: [createPersistedState()],
});

export default store;
