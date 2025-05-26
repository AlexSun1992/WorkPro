<template>
  <footer>
    <div class="container">
      <div class="row">
        <div class="col-lg-8 col-12 order-1 pl-md-0">
          <div class="menu-link d-md-flex">
            <div
              v-for="item in footer"
              :key="item.title"
              :class="item.isActive ? item.class + ' active' : item.class"
            >
              <a
                v-on:click="openSection(item.title, $event)"
                href=""
                >{{ item.title }}</a
              >
              <div
                v-for="section in item.sections"
                :key="section.title"
                :class="section.class"
              >
                <nuxt-link :to="section.link ? section.link.url : ''">{{ section.title }}</nuxt-link>
                <div class="priduct_link">
                  <nuxt-link
                    v-for="link in section.links"
                    :key="link.link.title"
                    :to="link.link.url ? link.link.url : ''"
                    >{{ link.link.title }}</nuxt-link
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4 pl-lg-4 col-md-6 col-12 order-2 order-md-3 order-lg-2 pt-4 pt-lg-0 pl-md-3">
          <div class="title d-none d-sm-block mt-0 mb-0 mb-lg-3">Наши приложения</div>
          <a
            href="https://apps.apple.com/us/app/resomobile/id1127266069"
            class="footer-apple"
          ></a>
          <a
            href="https://play.google.com/store/apps/details?id=ru.reso.app"
            class="footer-google float-md-right"
          ></a>
          <div class="title d-none d-sm-block mt-lg-5 mt-2 mb-lg-3 mb-1">Мы в социальных сетях</div>
          <div class="social mt-3 mt-sm-0">
            <a
              href="https://ru-ru.facebook.com/reso.ru"
              class="footer-fb"
            ></a>
            <a
              href="http://vk.com/reso_garantia "
              class="footer-vk"
            ></a>
            <a
              href="https://www.instagram.com/reso.ru_official/"
              class="footer-in"
            ></a>
          </div>
        </div>
        <div class="col-12 order-4 order-lg-3">
          <div class="block-h-line my-md-4 my-2"></div>
        </div>
        <div class="col-lg-12 col-md-6 col-12 order-2 order-lg-3 pt-4 pt-lg-0 block-v-line-sm">
          <div class="info mb-2">
            СПАО «РЕСО-Гарантия» раскрывает информацию на странице в сети Интернет информационного агентства,
            аккредитованного ЦБ РФ на раскрытие информации, по адресу:
            <a href="http://www.disclosure.ru/issuer/7710045520/">http://www.disclosure.ru/issuer/7710045520/</a>
          </div>
          <div class="info_ppl mb-2 mt-4 mt-lg-0">
            Информация об акционерах и лицах, под контролем или значительным влиянием которых находится страховщик на
            17.12.2018 год
          </div>
        </div>
        <div class="col-12 order-5 pb-2">
          <div class="copyright">© 2020, «РЕСО-Гарантия»&nbsp;&nbsp;&nbsp;&nbsp;<a href="">Конфиденциальность</a></div>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  name: "c-footer",
  data() {
    return {
      isActive: true,
    };
  },
  methods: {
    openSection: function (title, e) {
      e.preventDefault();
      this.$store.commit("pages/changeFooterActiveSection", title);
    },
  },
  computed: {
    footer() {
      return this.$store.getters["pages/getFooterMenu"];
    },
  },
};
</script>

<style scoped lang="scss">
footer {
  background: linear-gradient(180deg, #fcfcfc 0%, rgba(255, 255, 255, 0) 100%);
  position: relative;
  font-size: 0.75rem;
  padding: 32px;
}

footer .title {
  font-size: 1.125rem;
  line-height: 1.5rem;
  color: #474747;
  font-weight: 500;
  padding-bottom: 0.5rem;
}

.priduct_link a {
  text-decoration: none;
  color: #474747;
  padding: 6px 0;
  display: table;
}

.priduct_link a:hover {
  color: #5fb456;
  text-decoration: underline;
}

footer:before {
  content: "";
  position: absolute;
  width: 100%;
  opacity: 0.8;
  border: 1px solid #e3ebe6;
  box-shadow: 0px -13px 20px rgba(144, 144, 144, 0.13);
  top: 0;
  left: 0;
}

.footer-apple {
  background: url(/img/main/ios.svg) 0 0 no-repeat;
  width: 132px;
  height: 44px;
  display: inline-block;
  margin-right: 20px;
}

.footer-google {
  background: url(/img/main/google.svg) 0 0 no-repeat;
  width: 144px;
  height: 44px;
  display: inline-block;
}

footer .info {
  color: #6f6f6f;
}

footer .info a {
  color: #aeaeae;
  text-decoration: none;
}

footer .copy {
  color: #aeaeae;
}

footer .copyright {
  color: #6f6f6f;
  font-size: 0.875rem;
  font-weight: 300;
}

footer .copyright a {
  color: #36ab4d;
}

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
  text-decoration: none;
  color: #474747;
  padding: 6px 0;
  display: table;
  text-transform: uppercase;
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
    font-size: 20px;
  }
  .menu-link .info_all.active > a,
  .menu-link .products_all.active > a {
    font-weight: 500;
    color: #5fb456;
  }
  .active .product {
    margin-top: 1rem;
  }
  .active .product > a {
    font-size: 16px;
    font-weight: 400;
  }
  .active .priduct_link > a {
    display: inline-block;
    font-weight: 300;
  }

  .info_all,
  .products_all {
    padding: 16px 0;
    border-bottom: 1px solid #ececec;
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

  .info_all > a:hover,
  .products_all > a:hover {
    color: #242424;
    text-decoration: none;
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

  .active.info_all > a:before,
  .active.products_all > a:before,
  .active.info_all > a:after,
  .active.products_all > a:after {
    content: "";
    background-color: #36ab4d;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 2px;
    width: 12px;
  }

  .info_all:not(.active) .product,
  .products_all:not(.active) .product {
    display: none;
  }
  footer .priduct_link a {
    display: inline-block;
    padding: 0;
    text-transform: none;
  }
  .pn-sm-none .product > a {
    display: none;
  }
}
@media (min-width: 992px) and (max-width: 1199px) {
  .footer-google,
  .footer-apple {
    height: 40px;
    background-size: contain;
  }
  .footer-apple {
    width: 120px;
  }
  .footer-google {
    width: 134px;
  }
}
</style>
