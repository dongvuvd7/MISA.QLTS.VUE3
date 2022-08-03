<template>
  <div>
    <div id="frmLogin">
      <div class="h-100 w-100 main">
        <div class="" id="grid-login">
          <!-- Ảnh bên trái form -->
          <div class="half-ctn img-login"></div>
          <!-- Bên phải form -->
          <div class="half-ctn">
            <!-- Content main form -->
            <div class="main-login-ctn">
              <!-- Logo MISA -->
              <div class="logo"></div>
              <div class="logo-text">
                Đăng nhập để làm việc với <b>MISA QLTS</b>
              </div>
              <!-- Content input and button login -->
              <form @submit.prevent="submit" id="normal-login">
                <div class="show-popup-login"></div>
                <div class="grid-login-normal">
                  <div class="username-login login">
                    <input
                      id="iptUserName"
                      class="input-login"
                      placeholder="Username, email hoặc số điện thoại"
                      v-model="account.username"
                      @focus="turnOffWarning('iptUserName')"
                    />
                  </div>
                  <div class="password-login login">
                    <input
                      id="iptPassword"
                      type="password"
                      placeholder="Mật khẩu"
                      class="input-login"
                        v-model="account.password"
                      @focus="turnOffWarning('iptPassword')"
                    />
                    <div class="eye on-eye" @click="onOffShowPassword()"></div>
                  </div>
                  <div class="button-login" style="margin-top: 20px">
                    <button type="submit" class="button" id="login" style="">
                      Đăng nhập
                    </button>
                  </div>
                  <div class="btn-space">
                    <a class="forgot-password" id="open-forgot-password"
                      >Quên mật khẩu?</a
                    >
                  </div>
                </div>
              </form>
              <!-- end normal-login -->
            </div>
          </div>
        </div>
      </div>
      <div class="copy-right">Copyright © 2022 MISA JSC</div>
    </div>
    <div id="snackbar" class="" style="margin-left: -129.056px; top: 52px">
      Vui lòng nhập đầy đủ thông tin đăng nhập
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";
import store from "../../store/store";
axios.defaults.withCredentials = true;

export default {
    components: {},
    data() {
        return {
            account: {
                username: "",
                password: "",
            },

        };
    },
    created() {

    },
    mounted() {
        //Nếu đã đăng nhập thì chuyến đến router /asset
        if (
            this.$coki.getCookie("username") == "admin"
        ) {
            this.$router.push("/asset");
        }
    },
    methods: {
        ...mapActions(["login"]),

        /**
         * Nhấn icon ẩn/hiện mật khẩu
         * Created by: VDDong (29/07/2022)
         */
        onOffShowPassword() {
            // change icon eye
            let eye = document.querySelector(".eye");
            if (eye.classList.contains("on-eye")) {
                eye.classList.remove("on-eye");
                eye.classList.add("off-eye");
            } else {
                eye.classList.remove("off-eye");
                eye.classList.add("on-eye");
            }
            // on/off password
            var x = document.getElementById("iptPassword");
            if (x.type === "password") {
                x.type = "text";
            } else {
                x.type = "password";
            }
        },

        /**
         * Nhấn nút đăng nhập
         * Created by: VDDong (03/08/2022)
         */
        async submit() {
            if(this.validateRequired()){
                const user = {
                    username: this.account.username,
                    password: this.account.password,
                };
                console.log(user);
                //request to server
                await this.login(user);
                // if login success
                if(store.getters.isWrongPass == false){
                    this.$router.push("/asset");
                }
                //false account
                else{
                    this.showSnackbar('Tài khoản hoặc mật khẩu không đúng!');
                    //add class input-warning to input
                    document.getElementById("iptUserName").classList.add("input-warning");
                    document.getElementById("iptPassword").classList.add("input-warning");
                }
            }
        },

        /**
         * Validate required username and password
         * Created by: VDDong (03/08/2022)
         */
        validateRequired() {
            // get username and password
            let username = document.getElementById("iptUserName").value;
            let password = document.getElementById("iptPassword").value;
            // nếu username hoặc password rỗng thì show snackbar
            if(username === '' || password === '') {
                this.showSnackbar('Vui lòng nhập đầy đủ thông tin đăng nhập!');
                if(username === '') {
                    //add class input-warning
                    document.getElementById("iptUserName").classList.add("input-warning");
                }
                else {
                    //remove class input-warning
                    document.getElementById("iptUserName").classList.remove("input-warning");
                }
                if(password === '') {
                    //add class input-warning
                    document.getElementById("iptPassword").classList.add("input-warning");
                }
                else {
                    //remove class input-warning
                    document.getElementById("iptPassword").classList.remove("input-warning");
                }
                return false;
            } else {
                return true;
            }

        },

        /**
         * Focus input then remove class input-warning
         * Created by: VDDong (03/08/2022)
         */
        turnOffWarning(file) {
            document.getElementById(file).classList.remove("input-warning");
        },


        /**
         * Hiển thị snackbar
         * Created by: VDDong (03/08/2022)
         */
        showSnackbar(text) {
            // set html text for snackbar
            document.getElementById("snackbar").innerHTML = text;
            // show snackbar
            var x = document.getElementById("snackbar");
            x.className = "show";
            // after 3s hide snackbar
            setTimeout(function() {
                x.className = x.className.replace("show", "");
            }, 3000);
        }

    },

};
</script>

<style scoped>
#frmLogin {
  height: 100vh !important;
  width: 100%;
  color: #4f4f4f;
  margin: 0;
  line-height: 1.6;
  background-color: #fff;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  position: absolute;
  top: 0;
  left: 0;
}

#content {
  height: 100vh !important;
}

.h-100 {
  height: 100% !important;
}

.w-100 {
  width: 100% !important;
}

#mainContent {
  padding: 0px !important;
}

.hide {
  display: none !important;
}

.main-login-ctn {
  margin: 40px;
}

#grid-login {
  width: 770px;
  display: flex;
  /*align-items: center;*/
  /*flex-direction: column;*/
  box-sizing: border-box;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.16);
  overflow: hidden;
  position: absolute;
  height: 560px;
}

.half-ctn {
  width: 50% !important;
  text-align: center;
}

.input-warning {
  border: 1px solid #ff0000 !important;
}

.grid-forgot-password {
  text-align: center;
}

.grid-login-normal {
  text-align: center;
}

.main {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("../../assets/Op3-Background-1920.png");
}

.logo {
  margin: 0px auto;
  /*margin-top: 20px;*/
  /*background-position-y: center;*/
  background-repeat: no-repeat;
  height: 60px;
  width: 100px;
  background-size: cover;
  background-image: url("../../assets/Logo MISA_VN.svg");
  background-size: contain;
}

.btn-space {
  margin-top: 16px;
}

.show-popup-login {
  height: 20px;
  color: #f93154;
  width: 300px;
  font-size: 12px;
  font-family: inherit;
  display: flex;
  align-items: center;
}

.logo-text {
  text-align: center;
  /*margin: 18px auto;*/
  font-size: 15px;
}

.img-login {
  background-image: url("../../assets/img_Login-Local.png");
  width: 100%;
  height: 100%;
}

.input-login {
  width: 100%;
  height: 44px;
  padding: 0px 20px;
  margin-top: 16px;
  border-radius: 4px;
  outline: none;
  border: 1px solid #dadce0;
  font-size: 13px;
  /*align-items: center;*/
  /*    font-family: Roboto-Regular !important;
    font: 13px Roboto-Regular !important;*/
  box-sizing: border-box;
  background-color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.input-login:focus {
  border-radius: 4px;
  border: 1px solid #39c0ed;
}

::placeholder {
  color: #abadb1;
  font-size: 14px;
  font-style: normal;
}

.active {
  border-radius: 4px;
  border: 1px solid #39c0ed;
}

.forgot-password {
  font-size: 15px;
  color: #1a73e8;
  text-decoration: none;
  margin-top: 20px;
  /*font-family: 'roboto-regular';*/
  cursor: pointer;
}

.password-login {
  position: relative;
}

.copy-right {
  width: 200px;
  height: 14px;
  position: absolute;
  bottom: 29px;
  color: #000;
  font-size: 12px !important;
  left: calc(50% - 100px);
  text-align: center;
  color: #fff;
  font-family: "roboto-regular";
}

.eye {
  width: 24px;
  height: 24px;
  position: absolute;
  right: 10px;
  top: 28px;
  background-repeat: no-repeat;
  cursor: pointer;
}

.on-eye {
  background-image: url("../../assets/Icon-qlts-update.svg");
  background-position: -65px -329px;
}

.off-eye {
  /* background-size: 450px; */
  background-image: url("../../assets/Icon-qlts-update.svg");
  background-position: -20px -330px;
}

.login {
  font-family: inherit;
  position: relative;
}

.button {
  width: 100%;
  height: 44px;
  border-radius: 4px;
  font-size: 16px !important;
  outline: none;
  border: none;
  background-color: #1a73e8;
  color: #fff;
  cursor: pointer;
}

.button:hover {
  background-image: none;
}

button:hover {
  color: white;
}

.icon {
  width: 20px;
  height: 20px;
  position: absolute;
  right: 10px;
  top: 30px;
  background-repeat: no-repeat;
  cursor: pointer;
}

.show {
  display: block !important;
}

@media (max-width: 1366px) {
  #grid-login {
    width: 770px;
    display: flex;
    /*align-items: center;*/
    /*flex-direction: column;*/
    box-sizing: border-box;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 16px 30px rgba(0, 0, 0, 0.16);
    overflow: hidden;
    position: absolute;
    height: 560px;
  }

  .logo-text {
    text-align: center;
    /*margin: 12px auto;*/
    font-size: 15px;
  }

  .logo {
    margin: 0px auto;
    /*margin-top: 20px;*/
    /*background-position-y: center;*/
    background-repeat: no-repeat;
    height: 60px;
    width: 100px;
    background-size: cover;
    background-image: url("../../assets/Logo MISA_VN.svg");
    background-size: contain;
  }

  .copy-right {
    width: 200px;
    height: 14px;
    position: absolute;
    bottom: 9px;
    color: #000;
    font-size: 12px !important;
    left: calc(50% - 100px);
    text-align: center;
    color: #fff;
    font-family: "roboto-regular";
  }
}

@media (max-width: 1536px) {
  .copy-right {
    width: 200px;
    height: 14px;
    position: absolute;
    bottom: 15px;
    color: #000;
    font-size: 12px !important;
    left: calc(50% - 100px);
    text-align: center;
    color: #fff;
    font-family: Roboto, sans-serif;
  }
}

/* The snackbar - position it at the bottom and in the middle of the screen */
#snackbar {
  visibility: hidden;
  min-width: 250px;
  margin-left: -150px;
  background-color: #f65335;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 6px 20px;
  position: fixed;
  z-index: 1;
  left: 50%;
  top: 30px;
  font-size: 14px;
}

#snackbar.show {
  visibility: visible;
}
</style>