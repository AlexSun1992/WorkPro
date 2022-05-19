<template>
  <div class="sidebar_client">
    <header-user-name :user-data="userInfo" />
    <ul class="sidebar-nav justify-content-center">
      <template v-for="(value, key) in groupMenuItems">
        <a v-if="key != 'undefined'" href="#">
          <div :class="'menu-icon-polities'" />
          <span>{{ key }}</span>
        </a>
        <li
          v-if="key === 'ДМС' && loggedInUser.IDMEDPARTNER > 0"
          class="sidebar-nav-item"
        >
          <a :href="url" target="blank">
            <div :class="'menu-icon-policies'" />
            <span>Телемедицина</span>
          </a>
        </li>
        <n-link
          v-for="item in value"
          :key="item.id"
          v-slot="{ href, navigate, isActive }"
          :to="item.url"
        >
          <li
            :class="isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'"
          >
            <a :href="href" @click="navigate">
              <div :class="'menu-icon-' + item.iconFileName" />
              <span>{{ item.name }}</span>
            </a>
          </li>
        </n-link>
      </template>
      <li class="sidebar-nav-item">
        <a href="#" @click="logout()">
          <div :class="'menu-icon-exit'" />
          <span>Выйти</span>
        </a>
      </li>
    </ul>

    <button
      class="sidebar-minimizer"
      :class="{ 'position-absolute': endScrollMenu }"
      @click="minimizeMenu"
    />

    <button class="sidebar-mobile_close" @click="minimizeMobileMenu" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import HeaderUserName from "../Header/HeaderUserName";

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
      url: null,
      userInfo: null,
    };
  },
  created() {
    this.userInfo = this.$auth.user;
    const token = this.$auth.$storage._state["_token.local"].replace(
      "Bearer ",
      ""
    );
    this.url = `https://dms.reso.ru/DMSResoRu/reso_iframe?token=${token}`;
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
        localStorage.removeItem("USER_INFO");
        window.$nuxt.$cookiz?.remove("url");
        window.location.href = "/";
      } catch (e) {
        console.log(e);
      }
    },
  },

  computed: {
    ...mapGetters(["isAuthenticated", "loggedInUser"]),
    groupMenuItems() {
      const groups = this.navItems.reduce((acc, item) => {
        const group = acc[item.groupmenu] || [];
        group.push(item);
        acc[item.groupmenu] = group;
        return acc;
      }, {});
      return groups;
    },
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
