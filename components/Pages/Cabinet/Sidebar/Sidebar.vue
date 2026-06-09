<template>
  <div
    class="sidebar_client"
    data-testid="sidebar_client"
  >
    <a
      href="/"
      aria-current="page"
      class="logo"
    ></a>
    <button
      class="menu-burger"
      @click="toggleClassActive"
    ></button>
    <template v-for="(value, key) in groupMenuItems">
      <div
        :class="{ show: openMenuLink.includes(key), 'sidebar-nav-container': true }"
        :key="key"
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
          <nuxt-link
            v-for="item in value"
            :key="item.id"
            #default="{ navigate, isActive }"
            @click="toggleClassActive"
            :to="item.url"
          >
            <li :class="isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'">
              <a
                :target="item.target"
                @click="
                  (e) => {
                    navigate(e);
                    toggleClassActive(e);
                  }
                "
                :data-newcount="item.newCount"
                :data-newcolor="item.newCountColor"
                :href="item.url"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 64 64"
                >
                  <use :href="`/img/iconmenu/icon-menu.svg#${item.iconFileName}`"></use>
                </svg>
                {{ item.name }}
              </a>
            </li>
          </nuxt-link>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  middleware: "Sidebar",
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
      openMenuLink: [],
      path: this.$route.path,
      currentUrl: null,
    };
  },

  computed: {
    groupMenuItems() {
      const groups = this.navItems.reduce((acc, item) => {
        const group = acc[item.groupmenu] || [];
        const itemMenu = { ...item };
        itemMenu.target = "_self";
        group.push(itemMenu);
        acc[item.groupmenu] = group;
        return acc;
      }, {});

      return groups;
    },
  },

  created() {
    this.userInfo = this.$auth.user;
    const token = this.$auth.strategy.token.get().replace("Bearer ", "");
    this.url = `https://dms.reso.ru/DMSResoRu/reso_iframe?token=${token}`;
    this.openMenuLink = Object.keys(this.groupMenuItems);
  },

  mounted() {
    this.endScrollMenu = window.innerHeight === document.documentElement.offsetHeight;
    window.addEventListener("scroll", this.updateScroll);
    window.addEventListener("resize", this.updateScroll);
  },
  methods: {
    openSidebarnav(activeLink) {
      if (this.openMenuLink.includes(activeLink)) {
        this.openMenuLink = this.openMenuLink.filter((key) => key !== activeLink);
      } else {
        this.openMenuLink.push(activeLink);
      }
    },
    async toggleClassActive() {
      if (window.innerWidth <= 992) {
        document.querySelector(".menu").classList.toggle("show");
        document.querySelector("body").classList.toggle("menu-open");
      }
    },
    updateScroll() {
      this.endScrollMenu =
        Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) +
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
};
</script>

<style scoped>
.menu-icon-exit {
  background: url(/img/exit.svg) 50% 50% no-repeat;
}
.sidebar-nav-item {
  position: relative;
}
.sidebar-nav-item svg {
  position: absolute;
  top: 0;
  left: 20px;
}
.sidebar-nav-item {
  --svg-menu-color: #c3c3c3;
}
.sidebar-nav-item.active,
.sidebar-nav-item:hover {
  --svg-menu-color: #009639;
}
a[data-newcount]:after {
  position: absolute;
  margin-left: 7px;
  top: -3px;
}
</style>
