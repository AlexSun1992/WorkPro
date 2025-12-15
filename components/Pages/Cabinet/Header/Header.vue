<template>
  <header>
    <div class="menu-container">
      <a
        href="/"
        aria-current="page"
        class="logo router-link-exact-active router-link-active"
      />
      <button
        class="burger"
        @click="toggleClassActive()"
      />
      <div class="row header-height align-items-start align-items-md-center">
        <div class="middle_menu col-lg-7 col-md-8 pl-md-4 pr-md-0 offset-lg-2 offset-md-2">
          <div class="menu-link d-md-flex ms-md-3 ms-lg-0">
            <div class="slogan-reso">С нами надёжнее!</div>
            <div>
              <a
                href="/individual"
                class="d-none d-md-block"
                >Частным лицам</a
              >
            </div>
            <div>
              <a
                href="/incase"
                class="d-none d-md-block"
                >Страховой случай</a
              >
            </div>
            <div>
              <a
                href="/corporate"
                class="d-none d-md-block"
                >Бизнесу</a
              >
            </div>
          </div>
        </div>
        <div class="top_menu mt-4 mt-md-0">
          <div class="float-md-start">
            <span class="icon-left icon-location"><span class="d-inline-block light-gray">Ваш город:</span></span>
            <div class="d-inline-block">
              <show-city />
            </div>
          </div>
          <div class="float-md-start ms-lg-5 mt-3 mt-lg-0">
            <a
              class="icon-left icon-search-office gray-one txtdn"
              href="/about/contacts"
              v-text="'Офисы и отделения'"
            />
          </div>
          <div class="float-md-end d-none d-lg-block">
            <a
              href=""
              class="icon-left icon-eye gray-one txtdn visuallyImpairedButton"
              v-text="'Версия для слабовидящих'"
            />
          </div>
          <div class="clearfix" />
        </div>
      </div>
      <div class="login-form">
        <nuxt-link
          class="anonsed-block"
          to="/cabinet/55/0/705"
        >
          <button
            type="button"
            class="anonsed"
          />
        </nuxt-link>

        <div
          v-touch:swipe.bottom="swipeBottomHandler"
          class="LoginButton"
          v-click-outside="closeDropdown"
        >
          <div
            :class="positionArrowClass"
            ref="authentificatedBtn"
            data-testid="cabinetLoginDropDown"
            @click="toggleDropdown()"
          >
            <button
              class="btn dropdown-toggle btn-login-link text-decoration-none dropdown-toggle-no-caret"
              v-if="userInfo"
            >
              {{ userInfo.SSECONDNAME }} {{ userInfo.SFIRSTNAME }}
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
              <li class="login-profile">
                <a
                  id="btn_lk_main_head_authorization"
                  href="/cabinet/55/0/701"
                  class="dropdown-item"
                  >Главная</a
                >
              </li>
              <li
                class="login-osago"
                @click.prevent="redirect()"
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
                @click.prevent="logout()"
              >
                <a
                  href=""
                  id="btn_lk_exit_head_authorization"
                  class="dropdown-item"
                  >Выйти из аккаунта</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import ClickOutside from "vue-click-outside";
import Cookies from "js-cookie";
import axios from "axios";
import LoginButton from "@/components-vue2/src/components/Login/LoginButton";
import ShowCity from "@/components-vue2/src/components/ShowCity/ShowCity";
import HeaderUserName from "./HeaderUserName";
import { getZone } from "./header.helper";

const TOKEN_NAME = "auth._token.local";

export default {
  name: "Header",
  components: {
    /* eslint-disable vue/no-unused-components */
    LoginButton,
    ShowCity,
    /* eslint-disable vue/no-unused-components */
    HeaderUserName,
  },

  directives: {
    ClickOutside,
  },
  data() {
    return {
      isDropdownOpen: false,
    };
  },
  emits: { "mini-sidebar": null },
  computed: {
    isDropdownToggle() {
      return this.isDropdownOpen;
    },

    positionArrowClass() {
      return this.isDropdownToggle ? "dropdown b-dropdown show btn-group" : "dropdown b-dropdown btn-group";
    },
    userInfo() {
      if (this.$auth.loggedIn && this.$auth.user) {
        return this.$auth.user;
      }
      return null;
    },
    requestUrl() {
      const zone = getZone();

      return `/am/${zone}/v2/lk/linkosago`;
    },
  },
  methods: {
    closeDropdown() {
      this.isDropdownOpen = false;
      this.bodySize("unblocksize");
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
      this.bodySize(this.isDropdownToggle ? "blocksize" : "unblocksize");
    },
    swipeBottomHandler() {
      this.$refs.authentificatedBtn.hide();
    },
    bodySize(bodystatus) {
      if (bodystatus === "blocksize") {
        if (window.innerWidth <= 992) {
          document.body.classList.add("overflow-hidden");
        }
      }
      if (bodystatus === "unblocksize") {
        document.body.classList.remove("overflow-hidden");
      }
    },

    async getDefaultRedirectURL() {
      const token = Cookies.get(TOKEN_NAME);

      try {
        const getToken = await axios.get("/am/main/v2/redirect_lk1", {
          headers: {
            Authorization: token,
            "X-Application": "VueJS",
          },
        });
        const getUrl = getToken.data.find((item) => item.SURL);
        const url = new URL(getUrl?.SURL);

        url.searchParams.set("utm_source", "reso.ru");
        url.searchParams.set("utm_medium", "button");
        url.searchParams.set("utm_campaign", "lk_auth");

        return url;
      } catch (err) {
        return new URL(
          "https://client.reso.ru/wp-reso-ru/login.xhtml?utm_source=reso.ru&utm_medium=button&utm_campaign=lk_auth"
        );
      }
    },
    async getRedirectUrl() {
      try {
        const getToken = await this.$axios.post(this.requestUrl, {});
        const url = getToken.data?.find((item) => item.SLINK);

        const { origin } = window.location;
        const isUrlValid = url.SLINK.startsWith("/cabinet") || url.SLINK.startsWith("/individual");
        return url.SLINK && isUrlValid ? new URL(url.SLINK, origin) : this.getDefaultRedirectURL();
      } catch (err) {
        console.error(`getRedirectUrl. ${err}`);

        return this.getDefaultRedirectURL();
      }
    },
    async redirect() {
      const urlData = await this.getRedirectUrl();
      const { href } = urlData;
      const target = `_${href.includes("https://client.reso.ru/") ? "blank" : "self"}`;

      window.open(urlData.href, target);
    },

    toggleClassActive() {
      document.querySelector("body").classList.toggle("menu-open");
      document.querySelector(".menu").classList.toggle("show");
    },
    mobileMenu() {
      this.$emit("mini-sidebar");
    },
    async logout() {
      try {
        await this.$auth.logout();
        localStorage.removeItem("USER_INFO");
        window.$nuxt.$cookiz?.remove("url");
        window.$nuxt.$cookiz?.remove("auth._esia");
        window.location.href = "/";
      } catch (e) {
        console.error(e);
      }
    },
    goToNotify() {
      this.$router.push("/cabinet/55/0/705");
    },
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

.dropdown-menu.show {
  right: 0;
  border-radius: 30px;
}
</style>
<style>
body.menu-open,
body.menu-open .app.cabinet {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

body.menu-open:after {
  left: 0;
  transition: left 0.3s;
}

body.menu-open .color-footer {
  display: none;
}

body.menu-open .app.cabinet > .container {
  height: 100vh;
  overflow: hidden;
}
</style>
