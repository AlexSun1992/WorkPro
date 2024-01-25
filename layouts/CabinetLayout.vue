<template>
  <div class="app cabinet">
    <Header v-if="isShow" @mini-sidebar="changeMobileSidebar" />
    <div class="container">
      <b-breadcrumb v-if="isShow" :items="breadcrumbs"></b-breadcrumb>
      <div class="row">
        <div class="col-lg-3 col-12 menu">
          <div
            class="wrapper"
            :class="{
              'sidebar-min': sideBarMini,
              mobile_menu: sideBarMobileMini,
            }"
          >
            <Sidebar
              :nav-items="menuVisible"
              @mini-sidebar="changeSidebar"
              @mini-mobile-sidebar="changeMobileSidebar"
            />
          </div>
          <div class="feedback mt-4 d-none d-lg-block">
            <div class="title">Обратная связь</div>
            <div class="description">
              Напишите нам и мы оперативно<br />свяжемся с вами
            </div>
            <a href="/feedback/" class="btn_one icon-feedback"> Написать </a>
          </div>
        </div>
        <div class="col-12 col-lg-9">
          <div class="body">
            <main class="main">
              <nuxt v-if="isContentVisible" />
            </main>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isShow" class="color-footer">
      <Footer />
    </div>
  </div>
</template>
<script>
import Header from "~/components/Pages/Cabinet/Header/Header";
import Footer from "~/components/Pages/Cabinet/Footer/Footer";
import Sidebar from "~/components/Pages/Cabinet/Sidebar/Sidebar";
import menuSettings from "~/converters/menuSettings";

export default {
  name: "Full",
  components: {
    Header,
    Sidebar,
    Footer,
  },
  data() {
    return {
      sideBarMini: false,
      sideBarMobileMini: false,
      isContentVisible: true,
    };
  },
  head() {
    return {
      title: this.$store.getters["menu/pageTitle"],
    };
  },

  mounted() {
    window.onbeforeunload = () => {
      if (!document.activeElement) {
        window.reload = true;
        this.isContentVisible = false;
      }
    };
  },
  created() {
    this.isWebview = this.$cookiz.get("isWebview") === true;
  },
  computed: {
    isShow() {
      return !this.isWebview;
    },
    menuWithOutIcon() {
      return this.$store.getters["menu/getMenuWithOutIcon"];
    },
    menuVisible() {
      return this.$store.getters["menu/getVisibleShowMenu"];
    },
    nav() {
      return this.$store.getters["menu/menu"][0].children;
    },
    name() {
      return this.$route.name;
    },
    breadcrumbs() {
      return this.$store.getters["menu/breadCrumbs"];
    },
  },
  watch: {
    $route(to) {
      if (to.meta === "Cabinet") {
        this.sideBarMobileMini = false;
        this.setParams();
      }
    },
  },
  methods: {
    setParams() {
      const bc = menuSettings.getData(
        this.$store.getters["menu/menu"],
        this.$route.params
      );
      this.$store.commit("menu/setSettings", bc);
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

.b-toast {
  padding: 12px 24px;
  border: 1px solid #dfe3e5;
  border-radius: 12px;
  cursor: pointer;
}

.b-toast.b-toast-danger {
  background-color: #ffebeb;
}

.b-toast.b-toast-success {
  background-color: #edf8ea;
}

.b-toaster-top-right .b-toaster-slot {
  top: 30px;
  right: 30px;
}

.toast .toast-header,
.b-toast .toast {
  background: transparent !important;
}

.b-toast-danger .toast .toast-header {
  color: #eb5757;
}
.b-toast-success .toast .toast-header {
  color: #009639;
}
.toast .toast-body {
  color: #292929;
}

.toast .toast-header .close {
  font-size: 0;
  position: absolute;
  top: -7px;
  right: -7px;
  border-radius: 24px;
  height: 24px;
  width: 24px;
}
.b-toast-danger .toast .toast-header .close {
  background: #fff url(/img/close-toaster.svg) 50% 50% no-repeat;
  border: 1px solid #eb5757;
}
.b-toast-success .toast .toast-header .close {
  background: #fff url(/img/close-toaster-success.svg) 50% 50% no-repeat;
  border: 1px solid #009639;
}
</style>
