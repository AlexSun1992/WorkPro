<template>
  <header>
    <div class="container position-relative">
      <nuxt-link class="logo" to="/"></nuxt-link>
      <button
        v-on:click="mobileMenu()"
        class="burger mr-4 d-block d-md-none"
      ></button>
      <div class="row header-height align-items-start align-items-md-center">
        <div
          class="middle_menu col-lg-6 col-md-7 pl-md-4 pr-md-0 offset-lg-2 offset-md-2"
        >
          <div class="menu-link d-md-flex ml-md-3 ml-lg-0">
            <div
              v-for="item in menu"
              :key="item.title"
              :class="item.isActive ? item.class + ' active' : item.class"
            >
              <nuxt-link
                :to="item.link ? item.link.url : ''"
                class="d-none d-md-block"
                >{{ item.title }}</nuxt-link
              >
              <a
                v-on:click="openSection(item.title, $event)"
                href=""
                class="d-md-none"
                >{{ item.title }}</a
              >
              <div
                v-for="section in item.sections"
                :key="section.title"
                :class="section.class"
              >
                <nuxt-link :to="section.link ? section.link.url : ''">{{
                  section.title
                }}</nuxt-link>
                <div class="priduct_link">
                  <nuxt-link
                    v-for="link in absoluteUrl(section.links)"
                    :key="link.link.title"
                    :to="link.link.url ? link.link.url : ''"
                    >{{ link.link.title }}
                  </nuxt-link>
                  <a
                    v-for="link in relativeUrl(section.links)"
                    :href="link.link.url"
                    >{{ link.link.title }}</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="top_menu mt-4 mt-md-0">
          <div class="float-md-left">
            <span class="icon-left icon-location"
              ><span class="d-md-none d-lg-inline-block">Ваш город:</span></span
            >
            <a href="" class="icon-right icon-arrow-small-down color-green pr-3"
              >Москва</a
            >
          </div>
          <div class="float-md-left d-none d-md-block">
            <div class="separator32"></div>
          </div>
          <div class="float-md-left">
            <a href="/contacts" class="icon-left icon-search-office"
              >Найти ближайший офис</a
            >
          </div>
          <div class="float-md-right">
            <a href="" class="icon-left icon-eye">Версия для слабовидящих</a>
          </div>
          <div class="clearfix"></div>
          <div class="d-md-none top_menu_social">
            Мы всегда на связи
            <div class="social">
              <a
                href="https://ru-ru.facebook.com/reso.ru"
                class="footer-fb"
              ></a>
              <a href="http://vk.com/reso_garantia " class="footer-vk"></a>
              <a
                href="https://www.instagram.com/reso.ru_official/"
                class="footer-in"
              ></a>
            </div>
          </div>
        </div>
      </div>
      <div class="login-form">
        <button class="search mr-4 d-none d-md-inline"></button>
        <button
          v-if="!isAuthenticated"
          v-on:click="login"
          class="gotolk btn_trn btn-p-sm btn-icon-left"
        >
          <span class="d-none d-lg-block">Личный кабинет</span
          ><span class="d-lg-none">Вход</span>
        </button>
        <b-nav-item-dropdown v-else class="gotolk icon-right" variant="primary">
          <template slot="button-content">
            <header-user-name
              :user-data="loggedInUser"
              class="color-green"
            ></header-user-name>
          </template>
          <b-dropdown-item @click="goInCabinet"
            ><i class="fa fa-home"></i> Личный кабинет
          </b-dropdown-item>
          <b-dropdown-item @click="logout"
            ><i class="fa fa-lock"></i> Выход
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from "vuex";
import HeaderUserName from "../Header/HeaderUserName";

export default {
  name: "c-header",
  components: {
    HeaderUserName,
  },
  methods: {
    login() {
      this.$router.push("/login");
    },
    logout() {
      try {
        this.$auth.logout();
        window.$nuxt.$cookiz?.remove("url");
        this.$router.push("/");
      } catch (e) {
        console.log(e);
      }
    },
    goInCabinet() {
      this.$router.push("/cabinet");
    },
    openSection(title, e) {
      e.preventDefault();
      this.$store.commit("pages/changeHeaderActiveSection", title);
    },
    mobileMenu() {
      this.$emit("mini-sidebar");
    },
    absoluteUrl(items) {
      return items.filter(
        (item) => new RegExp("^(?:[a-z]+:)?//", "i").test(item) === true
      );
    },
    relativeUrl(items) {
      return items.filter(
        (item) => new RegExp("^(?:[a-z]+:)?//", "i").test(item) === false
      );
    },
  },
  computed: {
    menu() {
      return this.$store.getters["pages/getMenu"];
    },
    footer() {
      return this.$store.getters["pages/getFooterMenu"];
    },
    ...mapGetters(["isAuthenticated", "loggedInUser"]),
  },
};
</script>
<style scoped>
.top_menu {
  border-bottom: 1px solid #ececec;
  padding: 4px 0;
}

.top_menu > div {
  line-height: 32px;
}
.top_menu {
  font-weight: 300;
  line-height: 1.25rem;
  font-size: 0.875rem;
}

.top_menu a {
  color: #6f6f6f;
}

.logo {
  width: 120px;
  height: 40px;
  display: block;
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
}

.login-form {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
}

.buy-block {
  background: #36ab4d;
  border-radius: 10px;
  height: 80px;
}

.logo {
  background: url(/img/main/logo.svg) 0 0 no-repeat;
}

.search {
  background: url(/img/main/search.svg) 0 0 no-repeat;
  height: 16px;
  width: 16px;
  border: 0;
}

.gotolk > a {
  padding: 0;
}

.top_menu {
  position: absolute;
  top: -40px;
  width: calc(100% - 30px);
  left: 15px;
}

header {
  padding-top: 40px;
}

.header-height {
  min-height: 72px;
}

@media (max-width: 767px) {
  .header-height .top_menu {
    position: relative;
    padding: 0;
    margin: 0;
    top: 0;
    font-weight: 500;
    line-height: 1.25rem;
    font-size: 1rem;
  }

  .middle_menu {
  }

  header {
    padding: 0;
    opacity: 1 !important;
  }

  header > .container {
    height: 72px;
  }

  .logo {
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .burger {
    width: 32px;
    height: 19px;
    border: 0;
    border-bottom: 2px solid #242424;
    border-top: 2px solid #242424;
    background: none;
    position: absolute;
    top: 50%;
    left: 15px;
    transform: translateY(-50%);
    transition: 1s;
  }
  .menu-open .burger {
    border-color: transparent;
    transition: 0.3s;
  }

  .burger:after,
  .burger:before {
    content: "";
    position: absolute;
    top: 50%;
    margin-top: -1px;
    height: 2px;
    width: 100%;
    left: 0;
    background-color: #242424;
    transition: 0.3s;
  }
  .menu-open .burger:after,
  .menu-open .burger:before {
    width: 34px;
    transform: rotate(45deg);
    left: -2px;
    transition: 0.3s;
  }
  .menu-open .burger:after {
    transform: rotate(-45deg);
  }

  .gotolk.btn_trn {
    border: 0 !important;
    width: 24px;
    height: 25px;
    background: url(/img/main/login.svg) 0 0 no-repeat;
    padding: 0 !important;
    margin: 0;
  }

  .gotolk:not(.show):not(.dropdown):before {
    display: none;
  }

  .gotolk span {
    display: none;
  }

  .header-height {
    background: #fff;
    height: calc(100vh - 72px);
    top: 77px;
    display: block;
    width: 100%;
    z-index: 1;
  }
  .top_menu a {
    color: #242424;
  }
  .top_menu > div {
    line-height: 40px;
  }
  .top_menu {
    border-bottom: 0;
  }

  .top_menu_social {
    border-top: 1px solid #ececec;
    color: #6f6f6f;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    font-size: 1rem;
    font-weight: 300;
  }
  .menu-link > div:last-child {
    margin: 0 -16px;
    padding: 16px 16px;
  }
}
</style>
