<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-8 col-12 order-1 pl-md-0 px-0">
        <div class="menu-link d-md-flex">
          <!-- <p>width:{{ width }}</p>
          <p>heigth: {{ height }}</p> -->
          <div class="products_all ps-0">
            <a href>Оформить страховой полис</a>

            <div v-for="(item, index) in footerMenuCarSave" :key="item.title">
              <p @click="toggleVisibility(index)">
                {{ item.title }}
              </p>
              <ul ref="index">
                <li v-for="elem in item.items" :key="elem.id">
                  {{ elem }}
                </li>
              </ul>
            </div>

            <div v-for="item in footerMenuProperty" :key="item.title">
              <p @click="toggleVisibility(index)">
                {{ item.title }}
              </p>
              <ul ref="index">
                <li v-for="(elem, index) in item.items" :key="index">
                  {{ elem }}
                </li>
              </ul>
            </div>

            <div v-for="(item, index) in footerMenuHealth" :key="item.title">
              <p @click="toggleVisibility(index)">
                {{ item.title }}
              </p>
              <ul ref="index">
                <li v-for="elem in item.items" :key="elem.id">
                  {{ elem }}
                </li>
              </ul>
            </div>
          </div>
          <div class="info_all block-v-line-lg pn-sm-none">
            <div
              v-for="(item, index) in footerMenuAboutCompany"
              :key="item.title"
            >
              <p @click="toggleVisibility(index)">
                {{ item.title }}
              </p>
              <ul ref="index">
                <li v-for="elem in item.items" :key="elem.id">
                  {{ elem }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- <div>
          <a href="#">8(800)234-18-02</a>
          <span>Круглосуточно</span>
          <div>
            <a href="#">Apple Store</a>
            <a href="#">Google Play</a>
          </div>
          <div>
            <a href="#">faceBook</a>
            <a href="#">VK</a>
            <a href="#">Insta</a>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import footerMenu from "./footerMenu";

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
    };
  },
  created() {
    this.footerMenuProperty = footerMenu.filter((item) => {
      return item.title === "Имущество";
    });

    this.footerMenuAboutCompany = footerMenu.filter((item) => {
      return item.title === "О компании";
    });

    this.footerMenuHealth = footerMenu.filter((item) => {
      return item.title === "Жизнь и здоровье";
    });

    this.footerMenuCarSave = footerMenu.filter((item) => {
      return item.title === "Автострахование";
    });

    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    toggleVisibility(index) {
      //console.log(this.$refs.index[index].style.display);
      //   if (this.$refs.index[index].style.display === "block") {
      //     this.$refs.index[index].style.display = "none";
      //   } else this.$refs.index[index].style.display = "block";
    },
    handleResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    },
  },
};
</script>

<style scoped></style>
