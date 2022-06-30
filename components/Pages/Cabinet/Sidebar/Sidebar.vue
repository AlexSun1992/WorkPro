<template>
  <div class="sidebar_client">
    <a href="/" aria-current="page" class="logo"></a>
    <button class="menu-burger" @click="toggleClassActive"></button>
    <template v-for="(value, key) in groupMenuItems">
      <div class="sidebar-nav-container">
        <a v-if="key != 'undefined'" href="#" @click="openSidebarnav">
          {{ key }}
        </a>
        <ul class="sidebar-nav justify-content-center">
          <li
            v-if="
              key === 'страховой случай по ДМС' && loggedInUser.IDMEDPARTNER > 0
            "
            class="sidebar-nav-item"
          >
            <a :href="url" target="blank">
              <div :class="'menu-icon-telemed'" />
              <span>Видео-консультация</span>
            </a>
          </li>
          <n-link
            v-for="item in value"
            :key="item.id"
            v-slot="{ href, navigate, isActive }"
            :to="item.url"
            @click="toggleClassActive"
          >
            <li
              :class="isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'"
            >
              <a
                :href="href"
                @click="
                  (e) => {
                    navigate(e);
                    toggleClassActive(e);
                  }
                "
                class="slava"
              >
                <div :class="'menu-icon-' + item.iconFileName" />
                <span>{{ item.name }}</span>
              </a>
            </li>
          </n-link>
        </ul>
      </div>
    </template>
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
    openSidebarnav(e) {
      console.log(e);
      e.path[1].classList.toggle("show");
      e.path[0].classList.toggle("active");
    },
    slava() {
      console.log("bla bla bla");
    },
    toggleClassActive(e) {
      if (window.innerWidth <= 992) {
        document.querySelector(".menu").classList.toggle("show");
        document.querySelector("body").classList.toggle("menu-open");
        return;
      }
    },
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
