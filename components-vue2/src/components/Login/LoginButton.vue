<template>
  <div>
    <div v-touch:swipe.bottom="swipeBottomHandler" class="LoginButton">
      <b-dropdown
        variant="login-link"
        v-if="isAuthentificated"
        id="authentificated-btn"
        ref="authentificatedBtn"
        :text="userName"
        @show="bodySize('blocksize')"
        @hide="bodySize('unblocksize')"
      >
        <b-dropdown-item class="d-lg-none loginclose"></b-dropdown-item>
        <b-dropdown-item class="d-lg-none loginusername">
          Здравствуйте,<br /><b>{{ userName }}</b>
        </b-dropdown-item>
        <b-dropdown-item @click="profileBtn()" class="login-profile"
          >Личный кабинет</b-dropdown-item
        >
        <b-dropdown-item @click="osagoBtn()" class="login-osago"
          >ОСАГО</b-dropdown-item
        >
        <b-dropdown-item @click="exitBtn()" class="login-exit"
          >Выйти</b-dropdown-item
        >
      </b-dropdown>

      <b-dropdown
        v-else
        id="unauthentificated-btn"
        ref="unauthentificatedBtn"
        variant="login-btn"
        text="Личный кабинет"
      >
        <b-dropdown-item class="d-lg-none loginclose"></b-dropdown-item>
        <b-dropdown-item @click="osagoBtn()" class="login-osago"
          >ОСАГО</b-dropdown-item
        >
        <b-dropdown-item @click="polisesBtn()" class="login-polises"
          >Другие полисы</b-dropdown-item
        >
      </b-dropdown>
    </div>
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
          ? JSON.parse(window.localStorage.getItem("USER_INFO"))
          : null,
      isLoadedUserInfo:
        Boolean(window.localStorage.getItem("USER_INFO")) || false,
    };
  },

  methods: {
    swipeBottomHandler() {
      if (this.isAuthentificated) {
        this.$refs.authentificatedBtn.hide();
      } else {
        this.$refs.unauthentificatedBtn.hide();
      }
    },
    bodySize(bodystatus) {
      if (bodystatus === "blocksize") {
        document.body.classList.add("overflow-hidden");
      } else {
        document.body.classList.remove("overflow-hidden");
      }
    },
    redirectToLoginPage() {
      window.location.href = "/login";
    },
    async exitBtn() {
      this.personsData = null;
      Cookies.set(TOKEN_NAME, "false");
      Cookies.set(REFRESH_TOKEN_NAME, "false");
      window.localStorage.setItem("auth._token.local", "false");
      window.localStorage.removeItem("USER_INFO");
      this.$store.commit("auth/setLogged", false);
      this.$store.commit("auth/setUser", null);
    },
    async osagoBtn() {
      if (this.isAuthentificated === false) {
        window.location.href = "https://client.reso.ru/";
      } else {
        const token = Cookies.get(TOKEN_NAME);
        const getToken = await axios.get("/am/main/v2/redirect_lk1", {
          headers: {
            Authorization: token,
            "X-Application": "VueJS",
          },
        });
        const getUrl = getToken.data.find((el) => el.SURL);
        getUrl
          ? (window.location.href = getUrl.SURL)
          : (window.location.href = "https://client.reso.ru/");
      }
    },
    async profileBtn() {
      window.location.href = "/cabinet/55/0/701";
    },

    async polisesBtn() {
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
          window.localStorage.setItem(
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
    getNavigationList() {
      if (Cookies.get(TOKEN_NAME) === "false") {
        return ["ОСАГО", "Другие полисы"];
      }
      if (Cookies.get(TOKEN_NAME) === undefined) {
        return ["ОСАГО", "Другие полисы"];
      }
      return ["Личный кабинет", "ОСАГО", "Выйти"];
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
