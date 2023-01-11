<template>
  <div class="sidebar_client">
    <a href="/" aria-current="page" class="logo"></a>
    <button class="menu-burger" @click="toggleClassActive"></button>
    <template v-for="(value, key) in groupMenuItems">
      <div
        class="sidebar-nav-container"
        :class="{ show: openMenuLink.includes(key) }"
      >
        <a
          v-if="key != 'undefined'"
          href="#"
          @click="openSidebarnav(key)"
          :class="{ active: openMenuLink.includes(key) }"
        >
          {{ key }}
        </a>
        <ul class="sidebar-nav justify-content-center">
          <n-link
            v-for="item in value"
            :key="item.id"
            v-slot="{ navigate, isActive }"
            @click="toggleClassActive"
            :to="item.url"
          >
            <li
              :class="isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'"
            >
              <a
                :target="item.target"
                @click="
                  (e) => {
                    navigate(e);
                    toggleClassActive(e);
                  }
                "
                :href="item.url"
                :class="'menu-icon-' + item.iconFileName"
                :data-newcount="item.newCount"
                :data-newcolor="item.newCountColor"
              >
                {{ item.name }}
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
import { router } from "./router";

// router.beforeEach((to, from, next) => {
//   console.log("!!!");
// });

// function stop() {
//   window.addEventListener(
//     "beforeunload",
//     function () {
//       debugger;
//     },
//     false
//   );
// }

export default {
  middleware: "sidebar",
  name: "Sidebar",
  components: { HeaderUserName },
  props: {
    navItems: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  beforeEach() {
    console.log("beforeRouteEnter");
  },
  data() {
    return {
      endScrollMenu: false,
      sideBarMini: false,
      url: null,
      userInfo: null,
      openMenuLink: [],
      path: this.$route.path,
      currentUrl: null,
    };
  },
  created() {
    this.userInfo = this.$auth.user;
    const token = this.$auth.$storage._state["_token.local"].replace(
      "Bearer ",
      ""
    );

    this.url = `https://dms.reso.ru/DMSResoRu/reso_iframe?token=${token}`;
    this.openMenuLink = Object.keys(this.groupMenuItems);
  },
  methods: {
    openSidebarnav(activeLink) {
      if (this.openMenuLink.includes(activeLink)) {
        this.openMenuLink = this.openMenuLink.filter(
          (key) => key !== activeLink
        );
      } else {
        this.openMenuLink.push(activeLink);
      }
    },
    toggleClassActive(e) {
      // stop();
      // window.addEventListener("beforeunload", () => console.log("!!!!!!!"));
      // console.log("e:", e.path[0].href);
      // console.log(window);
      window.addEventListener("beforeunload", function () {
        console.log("!!!!!!!");
      });
      // if(e.path[0].href){

      // }
      if (window.innerWidth <= 992) {
        document.querySelector(".menu").classList.toggle("show");
        document.querySelector("body").classList.toggle("menu-open");
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

  // watch: {
  //   "$route.path"() {
  //     console.log("Совершён переход по ссылке");
  //     const token = this.$auth.$storage._state["_token.local"].replace(
  //       "Bearer ",
  //       ""
  //     );
  //     const url = `https://dms.reso.ru/DMSResoRu/reso_iframe?token=${token}`;
  //     console.log("url:", url);
  //     this.currentUrl = url;
  //   },
  // },

  computed: {
    ...mapGetters(["isAuthenticated", "loggedInUser"]),
    groupMenuItems() {
      const groups = this.navItems.reduce((acc, item) => {
        const group = acc[item.groupmenu] || [];
        const itemMenu = { ...item };
        itemMenu.target = "_self";
        if (itemMenu.isTelemed) {
          itemMenu.url = this.url;
          itemMenu.target = "_blank";
        }
        group.push(itemMenu);
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
