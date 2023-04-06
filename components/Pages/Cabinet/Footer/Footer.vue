<template>
  <footer>
    <div class="container">
      <div class="row">
        <div class="col-lg-8 col-12 order-1 pl-lg-0 px-0">
          <div class="menu-link d-lg-flex">
            <div class="products_all ps-0">
              <a href>Оформить страховой полис</a>

              <div class="product menu-auto mb-lg-4 pb-lg-4 position-relative">
                <a
                  v-for="(item, index) in footerMenuCarSave"
                  :key="index"
                  :href="item.titleRef"
                  @click="toggleClassActive"
                  >{{ item.title }}</a
                >
                <div class="priduct_link">
                  <a
                    v-for="(item, index) in footerMenuCarSave[0].items"
                    :key="index"
                    :href="item.ref"
                  >
                    {{ item.title }}
                  </a>
                </div>
              </div>

              <div class="product menu-im">
                <a
                  v-for="(item, index) in footerMenuProperty"
                  :key="index"
                  :href="item.titleRef"
                  @click="toggleClassActive"
                  >{{ item.title }}</a
                >
                <div class="priduct_link">
                  <a
                    v-for="(item, index) in footerMenuProperty[0].items"
                    :key="index"
                    :href="item.ref"
                  >
                    {{ item.title }}
                  </a>
                </div>
              </div>

              <div class="product menu-med">
                <a
                  v-for="(item, index) in footerMenuHealth"
                  :key="index"
                  :href="item.titleRef"
                  @click="toggleClassActive"
                  >{{ item.title }}</a
                >
                <div class="priduct_link">
                  <a
                    v-for="(item, index) in footerMenuHealth[0].items"
                    :key="index"
                    :href="item.ref"
                  >
                    {{ item.title }}
                  </a>
                </div>
              </div>
            </div>
            <div class="info_all block-v-line-lg pn-sm-none">
              <a
                v-for="(item, index) in footerMenuAboutCompany"
                :key="index"
                :href="item.titleRef"
                @click="toggleClassActive"
                >{{ item.title }}</a
              >
              <div class="product">
                <a
                  v-for="(item, index) in footerMenuAboutCompany"
                  :key="index"
                  :href="item.titleRef"
                  @click="toggleClassActive"
                  >{{ item.title }}</a
                >
                <div class="priduct_link">
                  <a
                    v-for="(item, index) in footerMenuAboutCompany[0].items"
                    :key="index"
                    :href="item.ref"
                  >
                    {{ item.title }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="col-lg-4 pl-lg-4 col-12 order-2 order-lg-2 pt-4 pt-lg-0 pl-md-3"
        >
          <div class="title mt-0 mb-0 mb-lg-3">
            <a href="tel:+78002341802" class="footer-tel">8 (800) 234-18-02</a>
            <br /><span class="footer-tel-ph">Круглосуточно</span> <br /><a
              href="tel:+78002341802"
              class="footer-tel"
              >8 (495) 730-30-00</a
            >
          </div>

          <div class="footer-app-btn">
            <a
              v-for="(item, index) in appGoogleStoreRefs[0].items"
              :key="index"
              :href="item.ref"
              :class="item.class"
            >
              {{ item.title }}
            </a>
          </div>
          <div class="social mt-3 mt-sm-0">
            <a
              v-for="(item, index) in socialNetworks[0].items"
              :key="index"
              :href="item.ref"
              :class="item.class"
            >
              {{ item.title }}
            </a>
          </div>
        </div>
        <div class="col-lg-12 col-12 order-2 order-lg-3 h-line-footer">
          <button @click="toggleClassOpen" class="open-info">
            Раскрытие обязательной информации
          </button>
          <div class="footer-info">
            <div class="info mb-2">
              <a
                href="https://old.reso.ru/About/Informaciya-o-prave-potrebitelej-finansovyh-uslug-na-napravlenie-obrashcheniya-finansovomu-upolnomochennomu.pdf"
              >
                Информация о праве потребителей финансовых услуг на направление
                обращения финансовому уполномоченному</a
              >
            </div>
            <div class="info info_ppl mb-2 mt-4 mt-lg-0">
              <a href="https://old.reso.ru/About/Company/"
                >Информация о компании по Базовым стандартам защиты прав и
                интересов физических и юридических лиц</a
              >
            </div>
            <div class="info mb-2">
              При проблемах с доступом к сайтам и нужным онлайн-сервисам
              необходимо установить браузеры, которые поддерживают российский
              сертификат безопасности.
            </div>
            <div>
              Сайт защищён reCAPTCHA с применением
              <a href="https://policies.google.com/privacy"
                >Политики конфиденциальности</a
              >
              и
              <a href="https://policies.google.com/terms"
                >Условий использования</a
              >
              от Google.
            </div>
            <div class="copyright">
              © 2023, «РЕСО-Гарантия» Сайт использует персональные данные.
              <a
                href="https://reso.ru/about/normative/personal-information.html"
                >Подробнее</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import footerMenu from "./footerMenu";
import getSpecificObject from "./footerHelper";

export default {
  name: "Footer",
  data() {
    return {
      width: 0,
      height: 0,
      footerMenuCarSave: [],
      footerMenuAboutCompany: [],
      footerMenuHealth: [],
      footerMenuProperty: [],
      appGoogleStoreRefs: [],
      socialNetworks: [],
    };
  },

  created() {
    this.footerMenuProperty = getSpecificObject(footerMenu, "Имущество");

    this.footerMenuAboutCompany = getSpecificObject(footerMenu, "О компании");

    this.footerMenuHealth = getSpecificObject(footerMenu, "Жизнь и здоровье");

    this.footerMenuCarSave = getSpecificObject(footerMenu, "Автострахование");

    this.appGoogleStoreRefs = getSpecificObject(
      footerMenu,
      "AppGoogleStoreRefs"
    );

    this.socialNetworks = getSpecificObject(footerMenu, "socialNetworks");
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    toggleClassActive(e) {
      if (this.width < 992) {
        e.preventDefault();
        e.target.parentElement.classList.toggle("active");
        return;
      }
    },
    toggleClassOpen(e) {
      e.target.classList.toggle("open");
    },
    handleResize() {
      this.width = window.innerWidth;
    },
  },
};
</script>

<style scoped></style>
