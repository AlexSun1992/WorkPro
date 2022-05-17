<template>
  <div>
    <div>
      <p>Ваш город,Офисы и отделения,Версия для слабовидящих</p>
    </div>
    <div>
      <ul>
        <li v-for="item in headerMenu" :key="item.id">
          <a href="#">{{ item }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import headerMenu from "./headerMenu";

export default {
  name: "Header",
  data() {
    return {
      headerMenu: null,
    };
  },
  created() {
    this.headerMenu = headerMenu;
  },
};
</script>

<style scoped></style>
