<template>
  <div class="app main_page">
    <header>
      <div class="menu-container">
        <a
          href="/"
          aria-current="page"
          class="logo router-link-exact-active router-link-active"
        ></a>
        <button class="burger mr-4 d-block d-md-none"></button>
        <div class="row header-height align-items-start align-items-md-center">
          <div
            class="middle_menu col-lg-7 col-md-8 pl-md-4 pr-md-0 offset-lg-2 offset-md-2"
          >
            <div class="menu-link d-md-flex ms-md-3 ms-lg-0">
              <div class="slogan-reso">С нами надёжнее!</div>
              <div>
                <a href="/individual" class="d-none d-md-block">Купить полис</a>
                <a href="" class="d-md-none">Купить полис</a>
                <!-- ///// -->
                <div class="product">
                  <a
                    href="/individual/auto/"
                    aria-current="page"
                    class="router-link-exact-active router-link-active"
                    >Автострахование</a
                  >
                  <div class="priduct_link">
                    <a href="/individual/auto/osago/">ОСАГО</a>
                    <a href="/individual/auto/kasko/">Каско</a>
                    <a href="/individual/auto/greencard/">Зеленая карта</a>
                  </div>
                </div>
                <!-- //// есть ошибка -->
                <!-- <div
                  v-for="(item, index) in products"
                  :key="index"
                  :class="item.class"
                >
                  <a
                    v-for="(item, index) in products[item].titleRef"
                    :href="products[item].titleRef.ref"
                    :class="products[item].titleRef[item].class"
                    :key="index"
                  >
                    {{ products[item].titleRef[item].title }}
                  </a>
                </div> -->
                <!-- ///// -->
                <div class="product">
                  <a
                    href="/individual/health/"
                    aria-current="page"
                    class="router-link-exact-active router-link-active"
                    >Медицина и жизнь</a
                  >
                  <div class="priduct_link">
                    <a href="/individual/health/life/">ДМС</a>
                    <a href="/individual/health/accident/">Несчастный случай</a>
                    <a href="/individual/property/">Путешественник</a>
                  </div>
                </div>
                <div class="product">
                  <a
                    href="/individual/property/"
                    aria-current="page"
                    class="router-link-exact-active router-link-active"
                    >Недвижимость</a
                  >
                  <div class="priduct_link">
                    <a href="/individual/property/house/">Дом</a>
                    <a href="/individual/property/flat/">Квартира</a>
                    <a href="/individual/property/ipoteka/">Ипотека</a>
                  </div>
                </div>
              </div>
              <div>
                <a href="/incase" class="d-none d-md-block">Страховой случай</a>
                <a href="" class="d-md-none">Страховой случай</a>
              </div>
              <div>
                <a href="/corporate" class="d-none d-md-block">Бизнесу</a>
                <a href="" class="d-md-none">Бизнесу</a>
              </div>
            </div>

            <div class="search-block">
              <form
                id="search-form-button"
                role="form"
                class="styled-form no-border"
                action="/search.html"
                onsubmit="return filterQuery();"
              >
                <input type="hidden" name="lq" value="" />
                <input type="hidden" name="reloaded" />

                <input
                  id="searchForm"
                  name="searchString"
                  required=""
                  value=""
                  class="form-control blur-focus ui-autocomplete-input"
                  type="text"
                  autocomplete="off"
                  placeholder="Поиск по сайту"
                  onsubmit="filterQuery(this)"
                />
                <input
                  id="searchQuery"
                  name="q"
                  class="form-control blur-focus"
                  type="hidden"
                />
              </form>

              <button class="search-close"></button>
              <button class="search" type="button"></button>
            </div>
          </div>
          <div class="top_menu mt-4 mt-md-0">
            <div class="float-md-start">
              <span class="icon-left icon-location"
                ><span class="d-inline-block light-gray">Ваш город:</span></span
              >

              <component-show-city vce-ready=""
                ><div data-v-a1c08b6a="">
                  <button
                    data-v-a1c08b6a=""
                    type="button"
                    class="btn select-sity btn-link"
                  >
                    Москва
                  </button>
                  <div
                    data-v-a1c08b6a=""
                    class="sity-question collapse"
                    id="__BVID__5"
                    style="display: none"
                  >
                    <div data-v-a1c08b6a="" class="card">
                      <!----><!---->
                      <div data-v-a1c08b6a="" class="card-body">
                        <!----><!---->
                        <div data-v-a1c08b6a="" class="close-sity-block"></div>
                        <div data-v-a1c08b6a="" class="sity-block-text">
                          Ваш город: <b data-v-a1c08b6a="">Москва</b>
                        </div>
                        <button
                          data-v-a1c08b6a=""
                          type="button"
                          class="btn btn-icon-left btn-primary"
                        >
                          Да, верно</button
                        ><button
                          data-v-a1c08b6a=""
                          type="button"
                          class="btn ml-3 btn-secondary"
                        >
                          Нет, другой
                        </button>
                      </div>
                      <!----><!---->
                    </div>
                  </div>
                  <!---->
                </div></component-show-city
              >
            </div>
            <div class="float-md-start ms-lg-5 mt-3 mt-lg-0">
              <a
                class="icon-left icon-search-office gray-one txtdn"
                href="/about/contacts"
                >Офисы и отделения</a
              >
            </div>
            <div class="float-md-end d-none d-lg-block">
              <a href="" class="icon-left icon-eye gray-one txtdn"
                >Версия для слабовидящих</a
              >
            </div>
            <div class="clearfix"></div>
            <!--<div class="d-md-none top_menu_social" >
                    Мы всегда на связи
                    <div class="social" >
                        <a href="https://ru-ru.facebook.com/reso.ru" class="footer-fb" ></a>
                        <a href="http://vk.com/reso_garantia " class="footer-vk" ></a>
                        <a href="https://www.instagram.com/reso.ru_official/" class="footer-in" ></a>
                    </div>
                </div>-->
            <div class="mobile-phone">
              <a href="tel:+78002341802" class="footer-tel"
                >8 (800) 234-18-02</a
              >
              <br /><span class="footer-tel-ph">Круглосуточно</span>
            </div>
          </div>
        </div>
        <div class="login-form">
          <component-login-button vce-ready=""
            ><div class="LoginButton">
              <button type="button" class="btn btn-login-btn">
                Личный кабинет
              </button>
            </div></component-login-button
          >
        </div>
      </div>
    </header>
  </div>
</template>

<script>
import items from "./headerMenu";

export default {
  name: "Header",
  data() {
    return {
      headerMenu: null,
      products: null,
    };
  },
  created() {
    // this.headerMenu = headerMenu;
    this.products = items;
  },
};
</script>

<style scoped></style>
