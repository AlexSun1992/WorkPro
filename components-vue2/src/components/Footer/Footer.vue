<template>
  <footer>
    <div class="container">
      <div class="row">
        <div class="col-lg-8 col-12 order-1 pl-md-0 px-0">
          <div class="menu-link d-md-flex">
            <div class="products_all ps-0">
              <a href>Оформить страховой полис</a>

              <div class="product menu-auto mb-md-4 pb-md-4 position-relative">
                <a
                  v-for="(item, index) in footerMenuCarSave"
                  :key="index"
                  :href="item.titleRef"
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
              <a href="/about/">О компании</a>
              <div class="product menu-med">
                <a
                  v-for="(item, index) in footerMenuAboutCompany"
                  :key="index"
                  :href="item.titleRef"
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
              <!-- ///// -->
            </div>
          </div>
        </div>
        <div class="col-lg-4 pl-lg-4 col-md-6 col-12 order-2 order-md-3 order-lg-2 pt-4 pt-lg-0 pl-md-3">
          <div class="title mt-0 mb-0 mb-lg-3">
            <a
              href="tel:+78002341802"
              class="footer-tel"
              >8 (800) 234-18-02</a
            >
            <br /><span class="footer-tel-ph">Круглосуточно</span>
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

          <div class="iconix">
            Дизайн:
            <img src="/export/system/modules/ru.reso.v2/resources/img/icons/iconix.svg" />
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

    this.appGoogleStoreRefs = getSpecificObject(footerMenu, "AppGoogleStoreRefs");

    this.socialNetworks = getSpecificObject(footerMenu, "socialNetworks");
    // eslint-disable-next-line nuxt/no-globals-in-created
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    },
  },
};
</script>

<style scoped></style>
