<template>
  <footer>
    <div class="container">
      <div class="row pt-lg-5 pt-md-3">
        <div class="col-lg-8 col-12 order-1 pl-md-0">
          <!--<div class="row">
            <div v-for="item in footer" :key="item.title" :class="item.class">
              <div
                v-for="section in item.sections"
                :key="section.title"
                :class="section.class"
              >
                <a href="">{{ section.title }}</a>
                <div class="priduct_link">
                  <a
                    v-for="link in section.links"
                    :key="link.link.title"
                    :href="link.link.url"
                    :target="link.link.target"
                    >{{ link.link.title }}</a
                  >
                </div>
              </div>
            </div>
          </div>-->
          <div class="menu-link d-md-flex">
            <div class="products_all">
              <a href="">Купить полис</a>
              <div
                class="product menu-auto menu_link_separator mb-4 pb-4 position-relative"
              >
                <a href="">Авто</a>
                <div class="priduct_link">
                  <a href="">Осаго</a>
                  <a href="">КАСКО</a>
                  <a href="">Зелень</a>
                </div>
              </div>
              <div class="product  menu-im">
                <a href="">Имущество</a>
                <div class="priduct_link">
                  <a href="">КВАРТИРА</a>
                  <a href="">ДОМ</a>
                  <a href="">ИПОТЕКА</a>
                </div>
              </div>
              <div class="product  menu-med">
                <a href="">Медицина</a>
                <div class="priduct_link">
                  <a href="">ДМС</a>
                  <a href="">ОМС</a>
                  <a href="">НЕСЧАСТНЫЙ СЛУЧАЙ</a>
                  <a href="">ТУРИЗМ</a>
                  <a href="">Накопительное инвестиционное страхование жизни</a>
                </div>
              </div>
            </div>
            <div class="info_all block-v-line-lg active">
              <a href="">РЕсо Гарантия</a>
              <div class="product">
                <a href="">РЕсо Гарантия</a>
                <div class="priduct_link">
                  <a href="">О компании</a>
                  <a href="">Новости</a>
                  <a href="">Раскрытие сведений</a>
                  <a href="">Карьера в РЕСО</a>
                  <a href="">Закупки</a>
                  <a href="">Правила и тарифы</a>
                  <a href="">Информация для получателей страховых услуг</a>
                  <a href="">Карта сайта</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="col-lg-4 pl-lg-4 col-md-6 col-12 order-2 order-md-3 order-lg-2  pt-4 pt-lg-0 pl-md-3"
        >
          <div class="title d-none d-sm-block mt-0 mb-0 mb-lg-3 ">
            Наши приложения
          </div>
          <a href="" class="footer-apple"></a>
          <a href="" class="footer-google float-right"></a>
          <div class="title d-none d-sm-block mt-lg-5 mt-2 mb-lg-3 mb-1">
            Мы в социальных сетях
          </div>
          <div class="social mt-3 mt-sm-0">
            <a href="" class="footer-fb"></a>
            <a href="" class="footer-vk"></a>
            <a href="" class="footer-ok"></a>
            <a href="" class="footer-in"></a>
            <a href="" class="footer-tw"></a>
          </div>
        </div>
        <div class="col-12  order-4 order-lg-3">
          <div class="block-h-line my-md-4 my-2"></div>
        </div>
        <div
          class="col-lg-12 col-md-6 col-12 order-2 order-lg-3 pt-4 pt-lg-0 block-v-line-sm"
        >
          <div class="info mb-2">
            СПАО «РЕСО-Гарантия» раскрывает информацию на странице в сети
            Интернет информационного агентства, аккредитованного ЦБ РФ на
            раскрытие информации, по адресу:
            <a href="http://www.disclosure.ru/issuer/7710045520/"
              >http://www.disclosure.ru/issuer/7710045520/</a
            >
          </div>
          <div class="info_ppl mb-2 mt-4 mt-lg-0">
            Информация об акционерах и лицах, под контролем или значительным
            влиянием которых находится страховщик на 17.12.2018 год
          </div>
        </div>
        <div class="col-12 order-5 pb-2">
          <div class="copyright">
            © 2020, «РЕСО-Гарантия»&nbsp;&nbsp;&nbsp;&nbsp;<a href=""
              >Конфиденциальность</a
            >
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  name: "c-footer",
  computed: {
    footer() {
      return this.$store.getters["pages/getFooterMenu"];
    }
  }
};
</script>

<style scoped lang="scss">
.menu-link .info_all > a,
.menu-link .products_all > a {
  display: none;
}

.products_all > a {
  grid-area: title;
}

.menu-med {
  grid-area: med;
}

.menu-auto {
  grid-area: auto;
}

.menu_link_separator:after {
  height: 1px;
  width: 20%;
  background-color: #dee5e0;
  content: "";
  bottom: 0;
  left: 0;
  position: absolute;
}

.menu-im {
  grid-area: im;
}

.products_all {
  columns: 2;
  flex: 0 0 60%;
  max-width: 60%;
  position: relative;
  width: 100%;
  min-height: 1px;
  padding-right: 15px;
  padding-left: 15px;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-areas: "auto med" "im med";
}

.info_all {
  flex: 0 0 40%;
  max-width: 40%;
  position: relative;
  width: 100%;
  min-height: 1px;
  padding-right: 15px;
  padding-left: 15px;
}

.product > a {
  font-size: 1.125rem;
  line-height: 1.5rem;
  color: #474747;
  font-weight: 500;
  padding-bottom: 0.5rem;
}

.priduct_link a {
  text-transform: uppercase;
  text-decoration: none;
  color: #474747;
  padding: 6px 0;
  display: table;
}
@media (max-width: 767px) {
  .products_all {
    columns: 1;
    flex: 0 0 100%;
    max-width: 100%;
    grid-template-columns: 100%;
    grid-template-areas: "auto" "im" "med";
  }

  .info_all {
    flex: 0 0 100%;
    max-width: 100%;
    position: relative;
    width: 100%;
  }
  .menu-link .info_all > a,
  .menu-link .products_all > a {
    display: block;
    position: relative;
  }
  .info_all,
  .products_all {
    padding: 20px 0;
    border-bottom: 1px solid red;
    display: block;
  }
  .menu_link_separator:after {
    display: none;
  }
  footer {
    padding: 15px;
  }
  footer .title {
    font-size: 0.825rem;
  }

  .info_all > a,
  .products_all > a {
    display: block;
    font-size: 16px;
    line-height: 20px;
    color: #242424;
  }
  .info_all > a:before,
  .products_all > a:before,
  .info_all > a:after,
  .products_all > a:after {
    content: "";
    background-color: #36ab4d;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
    height: 2px;
    width: 10px;
  }
  .info_all > a:before,
  .products_all > a:before {
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
    height: 10px;
    width: 2px;
  }

  .info_all:not(.active) .product,
  .products_all:not(.active) .product {
    display: none;
  }
  .priduct_link a {
    display: inline-block;
    margin-right: 9px;
  }
}
</style>
