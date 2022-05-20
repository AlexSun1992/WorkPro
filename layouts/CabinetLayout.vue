<template>
  <div class="app cabinet">
    <Header @mini-sidebar="changeMobileSidebar" />
    <div class="container">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="/">Главная</a>
        </li>
        <li class="breadcrumb-item">Личный кабинет</li>
      </ol>
      <div class="row">
        <div class="col-4">
          <div
            class="wrapper"
            v-bind:class="{
              'sidebar-min': sideBarMini,
              mobile_menu: sideBarMobileMini,
            }"
          >
            <Sidebar
              @mini-sidebar="changeSidebar"
              @mini-mobile-sidebar="changeMobileSidebar"
              :nav-items="menuWithOutIcon"
            />
          </div>
        </div>
        <div class="col-8">
          <div class="body">
            <main class="main">
              <nuxt />
            </main>
          </div>
        </div>
      </div>
    </div>
    <div class="color-footer">
      <div class="container">
        <Footer />
      </div>
    </div>
  </div>
</template>
<script>
import Header from "~/components/Pages/Cabinet/Header/Header";
import Footer from "~/components/Pages/Cabinet/Footer/Footer";
import Sidebar from "~/components/Pages/Cabinet/Sidebar/Sidebar";
import breadcrumbs from "~/converters/breadcrumbs";

export default {
  name: "full",
  head() {
    return {
      title: this.$store.getters["menu/breadcrumbs"][2].text
        ? this.$store.getters["menu/breadcrumbs"][2].text
        : "РЕСО-Гарантия",
    };
  },
  components: {
    Header,
    Sidebar,
    Footer,
  },
  data() {
    return {
      sideBarMini: false,
      sideBarMobileMini: false,
    };
  },
  watch: {
    $route(to, from) {
      if (to.meta === "Cabinet") {
        this.sideBarMobileMini = false;
        this.setParams();
      }
    },
  },
  methods: {
    setParams() {
      const bc = breadcrumbs.getData(
        this.$store.getters["menu/menu"],
        this.$route.params
      );
      this.$store.commit("menu/setBreadcrumbs", bc);
    },
    changeSidebar() {
      this.sideBarMini = !this.sideBarMini;
      this.sideBarMobileMini = false;
    },
    changeMobileSidebar() {
      this.sideBarMobileMini = !this.sideBarMobileMini;
      this.sideBarMini = false;
    },
  },
  computed: {
    menuWithOutIcon() {
      return this.$store.getters["menu/getMenuWithOutIcon"];
    },
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
};
</script>
<style lang="scss">
.cabinet {
  @import "~/assets/scss/style_lk.scss";
}
/*
.cabinet {
  display: grid;
  grid-template-rows: 80px auto min-content;
  min-height: 100vh;
  overflow-x: hidden;
  margin: 0 auto;
}
@media (max-width: 992px) {
  .cabinet {
    grid-template-rows: auto auto min-content;
  }
}

.toast {
  padding: 20px !important;
}

.toast .toast-header {
  background-color: transparent !important;
}
.toast .close {
  float: right;
  border-radius: 20px;
  border: 0;
  background: transparent;
  font-size: 26px;
  font-weight: 700;
  position: absolute;
  top: 15px;
  right: 25px;
  cursor: pointer;
}
.toast button:focus {
  outline: 0px;
  outline: 0px auto transparent;
}*/
</style>
