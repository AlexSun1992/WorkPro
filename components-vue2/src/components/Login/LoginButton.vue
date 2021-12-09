<template>
  <div class="LoginButton">
    <b-dropdown
      variant="login-link"
      v-if="isAuthentificated"
      id="dropdown-1"
      :text="userName"
    >
      <b-dropdown-item
        v-for="(item, index) in navigationList"
        :key="index"
        @click="applyAction(index)"
      >
        {{ item }}
      </b-dropdown-item>
    </b-dropdown>
    <b-button variant="login-btn" v-else @click="redirectToLoginPage"
      >ЛИЧНЫЙ КАБИНЕТ</b-button
    >
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";
import { BDropdown, BButton, BDropdownItem } from "bootstrap-vue";
import SkeletonBox from "./Libs/SkeletonBox";

const TOKEN_NAME = "auth._token.local";
const EXPIRATION_TOKEN = "auth._token_expiration.local";
const REFRESH_TOKEN_NAME = "auth._refresh_token.local";
const URL_GET_USER_NAME = "/am/main/v2/userinfo";
const URL_REFRESH_TOKEN = "/am/auth/v2/token_refresh";
const URL_AUTHORIZE = "/am/auth/v2/authorize";
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
axios.interceptors.response.use(undefined, function (err) {
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
      return new Promise(function (resolve, reject) {
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
          Cookies.set(REFRESH_TOKEN_NAME, "false");
          localStorage.setItem("auth._token.local", "false");
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
  components: {
    BDropdown,
    BButton,
    BDropdownItem,
    SkeletonBox,
  },
  data() {
    return {
      personsData:
        Cookies.get(TOKEN_NAME) !== "false"
          ? JSON.parse(localStorage.getItem("USER_INFO"))
          : null,
      navigationList: ["Личный кабинет", "Выход"],
      isLoadedUserInfo: Boolean(localStorage.getItem("USER_INFO")) || false,
    };
  },

  methods: {
    applyAction(index) {
      if (index === 0) {
        window.location.href = "/cabinet/55/0/701";
      } else {
        this.personsData = null;
        Cookies.set(TOKEN_NAME, "false");
        Cookies.set(REFRESH_TOKEN_NAME, "false");
        localStorage.setItem("auth._token.local", "false");
        this.$store.commit("auth/setLogged", false);
        this.$store.commit("auth/setUser", null);
      }
    },
    redirectToLoginPage() {
      window.location.href = "/login";
    },
    getPersonsData() {
      const token = Cookies.get(TOKEN_NAME);
      if (token) {
        axios.defaults.headers.common.Authorization = token;
      }
      axios({ url: URL_GET_USER_NAME, method: "GET" })
        .then((resp) => {
          this.personsData = resp.data[0]._data[0];
          this.isLoadedUserInfo = true;
          localStorage.setItem(
            "USER_INFO",
            JSON.stringify(resp.data[0]._data[0])
          );
          this.$store.commit("auth/setLogged", true);
          this.$store.commit("auth/setUser", resp.data[0]._data[0]);
          Cookies.set(EXPIRATION_TOKEN, Date.now() + DURATION);
        })
        .catch((err) => {
          this.isLoadedUserInfo = true;
          this.personsData = null;
        });
    },
  },

  computed: {
    isAuthentificated() {
      return Boolean(this.personsData);
    },
    userName() {
      return `${this.personsData.SFIRSTNAME} ${this.personsData.SSECONDNAME}`;
    },
  },
  created() {
    if (
      Cookies.get(TOKEN_NAME) !== "false" &&
      Cookies.get(TOKEN_NAME) !== undefined
    ) {
      if (!localStorage.getItem("USER_INFO")) {
        this.getPersonsData(Cookies.get(TOKEN_NAME));
      } else {
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
};
</script>
