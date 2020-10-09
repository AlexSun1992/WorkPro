<template>
  <div class="app main_page menu-open">
    <Header />
    <div class="container">
      <b-breadcrumb v-if="showBreadcrumbs && breadcrumbs">
        <b-breadcrumb-item
          v-for="(item, index) in breadcrumbs"
          v-bind:key="item.text"
          :to="item.href"
          :active="item.active"
          :text="item.text"
        />
      </b-breadcrumb>
    </div>
    <div class="app-body">
      <main class="main">
        <!--<breadcrumb :list="list"/>-->
        <p class="mb-10 mt-3"></p>
        <div>
          <nuxt />
        </div>
      </main>
    </div>
    <Footer />
  </div>
</template>
<script>
import nav from "./menu";
import Header from "~/components/Header/Header";
import Footer from "~/components/Footer";
import Sidebar from "~/components/Sidebar/Sidebar";
export default {
  name: "full",
  head: {
    title: "РЕСО-Гарантия",
  },
  components: {
    Header,
    Sidebar,
    Footer,
  },
  data() {
    return {
      nav: nav.items,
    };
  },
  watch: {
    $route(to, from) {
      if (to.meta === "Cabinet") {
        return;
      }
      let url = to.path;
      if (url === "/login") {
        return;
      }
      if (to.path === "/") {
        url = "index";
      }
      this.$store.dispatch("pages/fetchPageByUrl", url);
    },
  },
  computed: {
    breadcrumbs() {
      return this.$store.getters["pages/getBreadCrumbs"];
    },
    showBreadcrumbs() {
      return this.$store.getters["pages/getShowBreadCrumbs"];
    },
  },
};
</script>
<style lang="scss">
.main_page {
  @import "~/assets/scss/main.scss";
}@media (max-width: 767px) {
.menu-open header:after {
  content: "";
  width: 100vw;
  height: 100vh;
  background: #fff;
  position: absolute;
  z-index: 0;
}
.menu-open {
  overflow: hidden;
  width: 100vw;
  height: 100vh;
}
.menu-open .header-height {
  left: 15px;
}
}
</style>
