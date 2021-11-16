<template>
  <div class="sidebar_client">
    <header-user-name :user-data="loggedInUser"></header-user-name>

    <ul class="sidebar-nav justify-content-center">
      <n-link
        v-for="item in navItems"
        :key="item.id"
        :to="item.url"
        v-slot="{ href, route, navigate, isActive, isExactActive }"
      >
        <li :class="isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'">
          <a :href="href" @click="navigate">
            <div :class="'menu-icon-' + item.iconFileName"></div>
            <span>{{ item.name }}</span>
          </a>
        </li>
      </n-link>
      <li class="sidebar-nav-item">
        <a href="#" @click="test()" target="blank">
          <div :class="'menu-icon-polities'"></div>
          <span>Телемедицина</span>
        </a>
      </li>
      <li class="sidebar-nav-item">
        <a href="#" @click="logout()">
          <div :class="'menu-icon-exit'"></div>
          <span>Выйти</span>
        </a>
      </li>
    </ul>

    <button
      v-on:click="minimizeMenu"
      class="sidebar-minimizer"
      v-bind:class="{ 'position-absolute': endScrollMenu }"
    ></button>

    <button
      v-on:click="minimizeMobileMenu"
      class="sidebar-mobile_close"
    ></button>
  </div>
</template>

<script>
import HeaderUserName from "../Header/HeaderUserName";
import { mapGetters } from "vuex";
export default {
  name: "Sidebar",
  components: { HeaderUserName },
  props: {
    navItems: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      endScrollMenu: false,
      sideBarMini: false,
    };
  },
  created() {
    this.$auth.fetchUser();
  },
  methods: {
    updateScroll() {
      this.endScrollMenu =
        Math.max(
          window.pageYOffset,
          document.documentElement.scrollTop,
          document.body.scrollTop
        ) +
          window.innerHeight >=
        document.documentElement.offsetHeight - 120;
    },
    minimizeMenu() {
      this.$emit("mini-sidebar");
      setTimeout(() => this.updateScroll(), 100);
    },
    minimizeMobileMenu() {
      this.$emit("mini-mobile-sidebar");
    },
    async logout() {
      try {
        await this.$auth.logout();
        window.$nuxt.$cookiz?.remove("url");
        window.location.href = "/";
      } catch (e) {
        console.log(e);
      }
    },
    test() {
      const token = this.$auth.$storage._state["_token.local"].replace(
        "Bearer ",
        ""
      );
      const url = `https://dms.reso.ru/DMSResoRu/reso_iframe?token=${token}`;
      window.location.href = url;
    },
  },

  computed: {
    ...mapGetters(["isAuthenticated", "loggedInUser"]),
  },

  mounted() {
    this.endScrollMenu =
      window.innerHeight === document.documentElement.offsetHeight;
    window.addEventListener("scroll", this.updateScroll);
    window.addEventListener("resize", this.updateScroll);
  },
};
</script>

<style scoped>
.menu-icon-exit {
  background: url(/img/exit.svg) 50% 50% no-repeat;
}
</style>
