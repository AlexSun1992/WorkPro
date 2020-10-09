<template>
  <header>
    <div class="container position-relative">
      <nuxt-link class="logo" to="/"></nuxt-link>
      <button class="burger mr-4 d-block d-md-none"></button>
      <div class="row header-height align-items-start align-items-md-center">
        <div
          class="middle_menu col-lg-6 col-md-7 pl-md-4 pr-md-0 offset-lg-2 offset-md-3"
        >
          <!--
          <span v-for="(item, index) in menu" :key="index">
            <nuxt-link :to="item.link.url">{{ item.title }}</nuxt-link>
          </span>
        -->
          <div class="menu-link d-md-flex">
            <div class="buy_all">
              <a href="">Купить полиc</a>
              <div
                class="product menu-auto menu_link_separator mb-md-4 pb-md-4 position-relative"
              >
                <a href="">Автострахование</a>
                <div class="priduct_link">
                  <a href="/individual/auto/osago/" class="">Осаго</a
                  ><a href="/individual/auto/casco/" class="">Каско</a
                  ><a href="/individual/auto/greencard/" class=""
                    >Зеленая карта</a
                  >
                </div>
              </div>
              <div class="product  menu-im">
                <a href="">Имущество</a>
                <div class="priduct_link">
                  <a href="/individual/property/flat/" class="">Квартира</a
                  ><a href="/individual/property/house/" class="">Дом</a
                  ><a href="/individual/property/ipoteka/" class="">Ипотека</a>
                </div>
              </div>
              <div class="product  menu-med">
                <a href="">Жизнь и здоровье</a>
                <div class="priduct_link">
                  <a href="/individual/medicine/dms/" class="">ДМС</a
                  ><a href="/individual/medicine/oms/" class="">ОМС</a
                  ><a href="/individual/travel/" class="">Туризм</a
                  ><a href="/individual/accident/" class="">Несчастный случай</a
                  ><a href="/individual/life/" class=""
                    >Накопительное и инвестиционное страхование</a
                  >
                </div>
              </div>
            </div>
            <div class="insurance_case block-v-line-lg pn-sm-none">
              <a href="">Страховой случай</a>
              <div class="product">
                <a href="">О компании</a>
                <div class="priduct_link">
                  <a href="/about/news/" class="">Новости</a
                  ><a href="/career/" class="">Вакансии</a
                  ><a href="/tender/" class="">Закупки</a
                  ><a href="/about/disclosure/" class="">Раскрытие сведений</a
                  ><a href="/about/info-for-clients/" class=""
                    >Информация для потребителей</a
                  ><a href="/about/tariffs-and-rules" class=""
                    >Правила и тарифы</a
                  ><a href="/sitemap/" class="">Карта сайта</a>
                </div>
              </div>
            </div>
            <div class="insurance_case block-v-line-lg pn-sm-none">
              <a href="">Бизнесу</a>
              <div class="product">
                <a href="">О компании</a>
                <div class="priduct_link">
                  <a href="/about/news/" class="">Новости</a
                  ><a href="/career/" class="">Вакансии</a
                  ><a href="/tender/" class="">Закупки</a
                  ><a href="/about/disclosure/" class="">Раскрытие сведений</a
                  ><a href="/about/info-for-clients/" class=""
                    >Информация для потребителей</a
                  ><a href="/about/tariffs-and-rules" class=""
                    >Правила и тарифы</a
                  ><a href="/sitemap/" class="">Карта сайта</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="top_menu">
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
            <a href="" class="icon-left icon-search-office"
              >Найти ближайший офис</a
            >
          </div>
          <div class="float-md-right">
            <a href="" class="icon-left icon-eye">Версия для слабовидящих</a>
          </div>
          <div class="clearfix"></div>
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
            ><i class="fa fa-home"></i> Личный кабинет</b-dropdown-item
          >
          <b-dropdown-item @click="logout"
            ><i class="fa fa-lock"></i> Выход</b-dropdown-item
          >
        </b-nav-item-dropdown>
      </div>
    </div>
  </header>
</template>

<script>
import HeaderUserName from "../Pages/Cabinet/Header/HeaderUserName";
import { mapGetters } from "vuex";
export default {
  name: "c-header",
  components: {
    HeaderUserName
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
    }
  },
  computed: {
    menu() {
      return this.$store.getters["pages/getMenu"];
    },
    ...mapGetters(["isAuthenticated", "loggedInUser"])
  }
};
</script>
<style scoped>
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
  .header-height {
    position: absolute;
    left: -100%;
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
  }
  .burger:after {
    content: "";
    position: absolute;
    top: 50%;
    margin-top: -1px;
    height: 2px;
    width: 100%;
    left: 0;
    background-color: #242424;
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
    top: 72px;
    display: block;
    width: 100%;
    z-index: 1;
  }
}
</style>
