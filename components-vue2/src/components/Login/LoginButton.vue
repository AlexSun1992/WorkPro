<template>
  <div>
    <div
      v-touch:swipe.bottom="swipeBottomHandler"
      class="LoginButton"
    >
      <!-- Для авторизованного пользователя -->
      <div
        v-if="isAuthentificated"
        :class="authentificatedClass"
        id="authentificated-btn"
        ref="authentificatedBtn"
        @click="toggleDropdown()"
      >
        <button
          id="unauthentificated-btn__BV_toggle_"
          class="btn dropdown-toggle btn-login-link"
        >
          {{ userName }}
        </button>
        <ul
          v-show="isDropdownToggle"
          class="dropdown-menu show"
        >
          <li class="d-lg-none loginclose">
            <a
              href=""
              class="dropdown-item"
            ></a>
          </li>
          <li class="d-lg-none loginusername">
            <a
              href=""
              class="dropdown-item"
            >
              Здравствуйте,<br /><b>{{ userName }}</b></a
            >
          </li>
          <li class="login-profile">
            <a
              href="/cabinet/55/0/701"
              id="btn_lk_main_head_authorization"
              class="dropdown-item"
              >Личный кабинет</a
            >
          </li>
          <li
            class="login-osago"
            @click.prevent="osagoBtn()"
          >
            <a
              href=""
              id="btn_lk_osago_head_authorization"
              class="dropdown-item"
              >ОСАГО</a
            >
          </li>
          <li
            class="login-exit"
            @click="exitBtn()"
          >
            <a
              href=""
              id="btn_lk_exit_head_authorization"
              class="dropdown-item"
              >Выйти</a
            >
          </li>
        </ul>
      </div>

      <!-- Для неавторизованного пользователя -->
      <div
        v-else
        :class="isDropdownToggle ? 'dropdown b-dropdown show btn-group' : 'dropdown b-dropdown btn-group'"
        id="unauthentificated-btn"
        ref="unauthentificatedBtn"
        @click="toggleDropdown()"
      >
        <button
          class="btn dropdown-toggle btn-login-btn"
          :aria-expanded="showDropdown"
        >
          Личный кабинет
        </button>
        <ul
          v-show="isDropdownToggle"
          class="dropdown-menu show"
        >
          <li class="d-lg-none loginclose"></li>
          <li
            class="login-osago"
            @click.prevent="osagoBtn()"
          >
            <a
              href=""
              id="btn_lk_osago_head_not_authorization"
              class="dropdown-item"
              >ОСАГО</a
            >
          </li>
          <li class="login-polises">
            <a
              href="/login"
              id="btn_lk_other_head_not_authorization"
              class="dropdown-item"
            >
              Другие полисы</a
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";
import { subscribe, unsubscribe } from "./globalStorage";

const TOKEN_NAME = "auth._token.local";
const EXPIRATION_TOKEN = "auth._token_expiration.local";
const REFRESH_TOKEN_NAME = "auth._refresh_token.local";
const AUTH_USER_ID = "auth.user_id";
const URL_GET_USER_NAME = "/am/main/v2/userinfo";
const URL_REFRESH_TOKEN = "/am/authw/v2/token_refresh";
const URL_AUTHORIZE = "/am/authw/v2/authorize";
const DURATION = "100000";
let failedQueue = [];
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
let isRefreshing = false;
axios.interceptors.response.use(undefined, (err) => {
  const {
    config,
    response: { status },
  } = err;
  const originalRequest = config;
  if (
    status === 401 &&
    !originalRequest._retry &&
    originalRequest.url !== URL_REFRESH_TOKEN &&
    originalRequest.url !== URL_AUTHORIZE
  ) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios(originalRequest);
        })
        .catch((err) => {
          console.log("error");
          return err;
        });
    }
    isRefreshing = true;
    originalRequest._retry = true;
    return axios({
      url: URL_REFRESH_TOKEN,
      headers: {
        Authorization: `Bearer ${Cookies.get(REFRESH_TOKEN_NAME)}`,
      },
      method: "GET",
    })
      .then(
        (resp) => {
          Cookies.set(TOKEN_NAME, `Bearer ${resp.data.ACCESS_TOKEN}`);
          Cookies.set(REFRESH_TOKEN_NAME, resp.data.REFRESH_TOKEN);
          axios.defaults.headers.common.Authorization = `Bearer ${resp.data.ACCESS_TOKEN}`;
          isRefreshing = false;
          originalRequest.headers.Authorization = `Bearer ${resp.data.ACCESS_TOKEN}`;
          processQueue(null, resp.data.ACCESS_TOKEN);
          return axios(originalRequest);
        },
        (err) => {
          processQueue(err, null);
          Cookies.set(TOKEN_NAME, "false");
          isRefreshing = false;
          Cookies.set(REFRESH_TOKEN_NAME, "false");
          window.localStorage.setItem("auth._token.local", "false");
          console.log(err);
        }
      )
      .catch((err) => {
        processQueue(err, null);
      });
  }
  throw err;
});
export default {
  name: "LoginButton",
  data() {
    return {
      isDropdownOpen: false,
      personsData: Cookies.get(TOKEN_NAME) !== "false" ? JSON.parse(window.localStorage.getItem("USER_INFO")) : null,
      isLoadedUserInfo: Boolean(window.localStorage.getItem("USER_INFO")) || false,
    };
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    handleClickOutside(event) {
      if (
        (this.$refs.authentificatedBtn && !this.$refs.authentificatedBtn.contains(event?.target)) ||
        (this.$refs.unauthentificatedBtn && !this.$refs.unauthentificatedBtn.contains(event?.target))
      ) {
        this.closeDropdown();
      }
    },
    closeDropdown() {
      this.isDropdownOpen = false;
      this.bodySize("unblocksize");
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
      this.bodySize(this.isDropdownToggle ? "blocksize" : "unblocksize");
    },
    swipeBottomHandler() {
      if (this.isAuthentificated) {
        this.$refs.authentificatedBtn.hide();
      } else {
        this.$refs.unauthentificatedBtn.hide();
      }
    },
    bodySize(bodystatus) {
      if (bodystatus === "blocksize") {
        if (window.innerWidth <= 992) {
          document.body.classList.add("overflow-hidden");
        }
      } else {
        document.body.classList.remove("overflow-hidden");
      }
    },
    async exitBtn() {
      this.personsData = null;
      Cookies.set(TOKEN_NAME, "false");
      Cookies.set(REFRESH_TOKEN_NAME, "false");
      window.localStorage.setItem("auth._token.local", "false");
      window.localStorage.removeItem("USER_INFO");
      this.$store.commit("auth/setLogged", false);
      this.$store.commit("auth/setUser", null);
      document.body.classList.remove("overflow-hidden");
      if (window.lkLogout) {
        window.lkLogout();
      }
    },
    async osagoBtn() {
      if (this.isAuthentificated === false) {
        window.open(
          "https://client.reso.ru/wp-reso-ru/login.xhtml?utm_source=reso.ru&utm_medium=button&utm_campaign=lk_notauth",
          "_blank"
        );
      } else {
        const token = Cookies.get(TOKEN_NAME);
        const getToken = await axios.get("/am/main/v2/redirect_lk1", {
          headers: {
            Authorization: token,
            "X-Application": "VueJS",
          },
        });
        const getUrl = getToken.data.find((el) => el.SURL);
        const oldUrl = new URL(getUrl.SURL);
        oldUrl.searchParams.set("utm_source", "reso.ru");
        oldUrl.searchParams.set("utm_medium", "button");
        oldUrl.searchParams.set("utm_campaign", "lk_auth");
        getUrl
          ? window.open(oldUrl.href, "_blank")
          : window.open(
              "https://client.reso.ru/wp-reso-ru/login.xhtml?utm_source=reso.ru&utm_medium=button&utm_campaign=lk_auth",
              "_blank"
            );
      }
    },

    getPersonsData() {
      const token = Cookies.get(TOKEN_NAME);
      if (token) {
        axios.defaults.headers.common.Authorization = token;
      }
      axios({ url: URL_GET_USER_NAME, method: "GET" })
        .then((resp) => {
          // eslint-disable-next-line prefer-destructuring
          this.personsData = resp.data[0]._data[0];
          this.isLoadedUserInfo = true;
          window.localStorage.setItem("USER_INFO", JSON.stringify(resp.data[0]._data[0]));
          this.$store.commit("auth/setLogged", true);
          this.$store.commit("auth/setUser", resp.data[0]._data[0]);
          Cookies.set(EXPIRATION_TOKEN, Date.now() + DURATION);
        })
        .catch((err) => {
          this.isLoadedUserInfo = true;
          this.personsData = null;
        });
    },
    listenStorage(event) {
      if (event.key === "USER_INFO" && event.newValue) {
        this.personsData = JSON.parse(localStorage.getItem("USER_INFO"));
      }
    },
    setUserInfo(data) {
      window.localStorage.setItem("USER_INFO", JSON.stringify(data));
      this.personsData = JSON.parse(localStorage.getItem("USER_INFO"));
    },
  },

  computed: {
    authentificatedClass() {
      return this.isDropdownToggle ? "dropdown b-dropdown show btn-group" : "dropdown b-dropdown btn-group";
    },
    isDropdownToggle() {
      return this.isDropdownOpen;
    },
    getTokenFromCookie() {
      return Cookies.get(TOKEN_NAME);
    },
    isAuthentificated() {
      return Boolean(this.personsData);
    },
    userName() {
      return `${this.personsData.SFIRSTNAME} ${this.personsData.SSECONDNAME}`;
    },
  },

  created() {
    subscribe("setUserInfo", this.setUserInfo);
    // eslint-disable-next-line nuxt/no-globals-in-created
    window.addEventListener("auth-success-event", this.getPersonsData);
    // eslint-disable-next-line nuxt/no-globals-in-created
    window.addEventListener("storage", this.listenStorage);
    if (Cookies.get(TOKEN_NAME) !== "false" && Cookies.get(TOKEN_NAME) !== undefined) {
      if (!localStorage.getItem("USER_INFO")) {
        this.getPersonsData(Cookies.get(TOKEN_NAME));
      } else {
        if (this.personsData.ID !== Number(Cookies.get(AUTH_USER_ID))) {
          this.getPersonsData(Cookies.get(TOKEN_NAME));
        }
        this.$store.commit("auth/setLogged", true);
        this.$store.commit("auth/setUser", localStorage.getItem("USER_INFO"));
      }
      if (Cookies.get(EXPIRATION_TOKEN) - Date.now() < DURATION) {
        this.getPersonsData(Cookies.get(TOKEN_NAME));
      }
    } else {
      this.personsData = null;
    }
  },
  beforeDestroyed() {
    unsubscribe("setUserInfo", this.setUserInfo);
    window.removeEventListener("auth-success-event", this.getPersonsData);
    window.removeEventListener("storage", this.listenStorage);
  },
};
</script>

<style scoped>
.LoginButton {
  position: relative;
}
.LoginButton .dropdown-menu.show {
  position: absolute;
}
</style>
