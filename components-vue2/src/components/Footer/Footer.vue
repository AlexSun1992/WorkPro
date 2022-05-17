<template>
  <div>
    <h1>This is Footer</h1>
    <p>width:{{ width }}</p>
    <p>heigth: {{ height }}</p>

    <div v-for="item in footerMenu" :key="item.id">
      <p>{{ item.title }}</p>
      <ul>
        <li v-for="elem in item.items" :key="elem.id">
          {{ elem }}
        </li>
      </ul>
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
      footerMenu: null,
    };
  },
  created() {
    this.footerMenu = footerMenu;
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
