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
        v-else
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
      personsData: null,
      navigationList: ["Личный кабинет", "Выход"],
      isLoadedUserInfo: false,
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
    this.getPersonsData();
  },
};
</script>
