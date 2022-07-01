<template>
  <div class="app">
    <Header />
    <div class="app-body">
      <Sidebar :nav-items="nav" />
      <main class="main">
        <b-breadcrumb :items="items" />
        <div class="container-fluid">
          <nuxt />
        </div>
      </main>
    </div>
    <Footer />
  </div>
</template>
<script>
import Header from "~/components/Header/Header";
import Footer from "~/components/Footer";
import Sidebar from "~/components/Sidebar/Sidebar";
import breadcrumbs from "~/converters/breadcrumbs";

export default {
  name: "Full",
  components: {
    Header,
    Sidebar,
    Footer,
  },
  head: {
    title: "РЕСО-Гарантия",
  },
  computed: {
    nav() {
      return this.$store.getters["menu/menu"][0].children;
    },
    name() {
      return this.$route.name;
    },
    items() {
      return this.$store.getters["menu/breadcrumbs"];
    },
  },
  watch: {
    $route(to, from, next) {
      if (to.meta === "Cabinet") {
        this.setParams();
      } else {
        let url;
        if (to.path === "/") {
          url = "index";
        }
        this.$store.dispatch("pages/fetchPageByUrl", url);
      }
      next(false);
    },
  },
  methods: {
    setParams() {
      const bc = breadcrumbs.getData(
        this.$store.getters["menu/menu"],
        this.$route.params
      );
      this.$store.commit("menu/setBreadcrumbs", bc);
      this.$store.dispatch("card/setCard", {
        page: this.$route.params,
        settings: bc.slice(-1).pop(),
      });
    },
  },
};
</script>
