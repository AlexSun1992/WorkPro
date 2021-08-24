<template>
  <div class="LoginButton">
    <div v-if="isLoadedUserInfo">
      <b-dropdown
        variant="success"
        v-if="isAuthentificated"
        id="dropdown-1"
        :text="userName"
        class="gotolk icon-right"
      >
        <b-dropdown-item
          v-for="(item, index) in navigationList"
          :key="index"
          @click="applyAction(index)"
        >
          {{ item }}
        </b-dropdown-item>
      </b-dropdown>
      <b-button
        class="gotolk btn_trn btn-p-sm btn-icon-left"
        v-else-if="!isAuthentificated"
        @click="redirectToLoginPage"
        >ЛИЧНЫЙ КАБИНЕТ</b-button
      >
    </div>
    <div v-else>
      <div>
        <SkeletonBox :items="1"></SkeletonBox>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Cookies from "js-cookie";
import { BDropdown, BButton, BDropdownItem } from "bootstrap-vue";
import SkeletonBox from "./Libs/SkeletonBox";

const TOKEN_NAME = "auth._token.local";
const REFRESH_TOKEN_NAME = "auth._refresh_token.local";
const URL_GET_USER_NAME = "/am/main/v2/userinfo";
const URL_REFRESH_TOKEN = "/am/auth/v2/token_refresh";
const URL_AUTHORIZE = "/am/auth/v2/authorize";
const TOKEN_EXPIRATION = "auth._token_expiration.local";

let autoRefreshTimeout;

function startAutoRefresh() {
  const tokenUpdate = Number(Cookies.get(TOKEN_EXPIRATION)) - 7200000;
  clearTimeout(autoRefreshTimeout);
  autoRefreshTimeout = setTimeout(() => refreshAccessToken(), tokenUpdate);
  return axios({ url: URL_GET_USER_NAME, method: "GET" });
}

startAutoRefresh();

async function refreshAccessToken() {
  const request = await axios({
    url: URL_REFRESH_TOKEN,
    headers: {
      Authorization: `Bearer ${Cookies.get(REFRESH_TOKEN_NAME)}`,
    },
    method: "GET",
  });

  Cookies.set(TOKEN_NAME, `Bearer ${request.data.ACCESS_TOKEN}`);
  Cookies.set(REFRESH_TOKEN_NAME, request.data.REFRESH_TOKEN);
  axios.defaults.headers.common.Authorization = `Bearer ${request.data.ACCESS_TOKEN}`;
  startAutoRefresh();
}

axios.interceptors.response.use(undefined, async function (err) {
  const {
    config,
    response: { status },
  } = err;

  if (
    status === 401 &&
    !config._retry &&
    config.url !== URL_REFRESH_TOKEN &&
    config.url !== URL_AUTHORIZE
  ) {
    try {
      await refreshAccessToken();
      return axios(config);
    } catch (err) {
      console.log(err);
    }
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
        localStorage.getItem("auth._token.local") !== "false"
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
        Cookies.set(TOKEN_NAME, `${Cookies.get(TOKEN_NAME)}0`);
        Cookies.set(REFRESH_TOKEN_NAME, `${Cookies.get(REFRESH_TOKEN_NAME)}0`);
        localStorage.setItem("auth._token.local", "false");
      }
    },
    redirectToLoginPage() {
      window.location.href = "/login";
    },
    async getPersonsData() {
      const token = Cookies.get(TOKEN_NAME);
      if (token) {
        axios.defaults.headers.common.Authorization = token;
      }
      try {
        const res = await axios({ url: URL_GET_USER_NAME, method: "GET" });
        this.personsData = await res.data[0]._data[0];
        this.isLoadedUserInfo = true;
      } catch (err) {
        this.isLoadedUserInfo = true;
        this.personsData = null;
      }
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
    this.getPersonsData();
  },
};
</script>
