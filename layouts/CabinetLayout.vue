<template>
  <div class="app cabinet" :class="isShow ? '' : 'mobile-mode'">
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
              Вы можете написать нам официальное обращение через специальную
              форму
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
<style scoped>
.mobile-mode {
  padding-top: 1rem;
}
</style>
<style lang="scss">
.cabinet {
  @import "~/assets/scss/style_lk.scss";
}

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
.cabinet {
  position: relative;
}
.modal-open .modal {
  position: fixed;
}
.nuxt-progress + div > .app.cabinet .result_blk {
  position: relative;
}
.nuxt-progress + div > .app.cabinet .result_blk:before {
  content: "";
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: inline-block;
  border-top: 3px solid #009639;
  border-right: 3px solid transparent;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
  position: absolute;
  top: 0;
  left: 16px;
  z-index: 10;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.nuxt-progress + div > .app.cabinet .empty_message,
.nuxt-progress + div > .app.cabinet .result_blk > div {
  display: none;
}

.main {
  position: relative;
}

.lg-actions .lg-prev,
.lg-actions .lg-next {
  width: 40px;
  height: 40px;
}
.lg-actions .lg-prev:after {
  background: #fff url("/img/lg-actions-left.svg") 50% 50% no-repeat;
  width: 40px;
  height: 40px;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 16px;
  content: "" !important;
}
.lg-actions .lg-next:after {
  background: #fff url("/img/lg-actions-right.svg") 50% 50% no-repeat;
  width: 40px;
  height: 40px;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 16px;
  content: "" !important;
}
.lg-toolbar .lg-download {
  width: 142px !important;
  height: 38px !important;
  display: block !important;
  background: #fff !important;
  border-radius: 15px !important;
  position: absolute;
  left: 50%;
  margin-left: -71px;
  top: 4px;
}

.lg-toolbar .lg-download:after {
  content: "" !important;
  position: absolute;
  top: 10px;
  left: 22px;
  width: 20px;
  height: 20px;
  background: url("/img/lg-actions-download.svg") 50% 50% no-repeat;
}
.lg-toolbar .lg-download:before {
  content: "Скачать" !important;
  position: absolute;
  top: 6px;
  right: 22px;
  color: #292929;
  font-weight: 600;
  font-size: 1rem;
  font-family: "SF Pro Display", Helvetica, Arial, system-ui, -apple-system,
    Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, sans-serif,
    "Apple Color Emoji";
}
.lg-toolbar .lg-icon {
  color: #fff !important;
}
</style>
