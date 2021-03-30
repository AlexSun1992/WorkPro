<template>
  <div
    class="app main_page"
    v-bind:class="{
      'menu-open': mobileMenu,
    }"
  >
    <Header @mini-sidebar="changeMobileMenu" />
    <div class="container">
      <b-breadcrumb v-if="showBreadcrumbs !== false && breadcrumbs">
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
import breadcrumbs from "@/converters/breadcrumbs";
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
      mobileMenu: false,
    };
  },
  methods: {
    changeMobileMenu() {
      this.mobileMenu = !this.mobileMenu;
    },
  },
  watch: {
    $route(to, from) {
      if (to.meta === "Cabinet") {
        return;
      }
      let url = to.path;
      if (url === "/login") {
        this.$store.commit("pages/setBreadCrumbs", null);
        return;
      }
      if (to.path === "/") {
        url = "index";
      }
      if (from.meta === "Main") {
        this.mobileMenu = false;
        this.$store.dispatch("pages/fetchPageByUrl", url);
      }
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
html,
body,
#__nuxt,
#__layout,
main,
main > div {
  height: 100%;
}
.app.main_page {
  display: grid;
  grid-template-rows: minmax(114px, max-content) 0px auto minmax(
      114px,
      max-content
    );
  height: 100%;
}
.main_page {
  @import "~/assets/scss/main.scss";
}
.main_page {
  background: #fff;
}

@media (max-width: 767px) {
  .menu-open header:after {
    content: "";
    width: 100vw;
    height: 100vh;
    background: #fff;
    position: absolute;
    z-index: 0;
    top: 77px;
    background: #f5f8f6;
  }
  .menu-open {
    overflow: hidden;
    width: 100vw;
    height: 100vh;
  }
  .header-height {
    position: absolute;
    left: -200%;
    transition: 1s;
  }
  .menu-open .header-height {
    left: 15px;
    transition: 0.5s;
    background: #f5f8f6;
  }
}
</style>
