<template>
  <div>
    <nuxt-child
      v-if="isRouterChanged === false"
      :key="urlScript"
    />
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, onUnmounted } from "vue";

const POLICY_CARDS = ["934", "935", "936", "937", "938", "939", "940", "941", "942"];

export default {
  name: "Full",
  layout: "CabinetLayout",
  middleware: "guest",
  setup() {
    const instance = getCurrentInstance();
    const store = instance.proxy.$store;
    const route = instance.proxy.$route;
    const router = instance.proxy.$router;

    onMounted(() => {
      router.afterEach(() => {
        store.commit("data_card/setRouterChanged", false);
      });
      if (POLICY_CARDS.includes(route.params.idItem)) {
        store.commit("data_card/setIsShowLoader", true);
      }
    });
  },
  async fetch({ store, route, error: nuxtError, $winstonLog }) {
    try {
      const settings = store.getters["menu/settings"].slice(-1).pop() || null;
      if (!settings) {
        nuxtError({
          statusCode: 500,
          message: "Не удалось загрузить настройки страницы",
        });
      }
      if (settings) {
        if (settings.isCard || settings.isWizard) {
          await store.dispatch("card/setCard", {
            page: route.params,
            settings,
          });
        }
      }
    } catch (error) {
      $winstonLog.error({
        level: "error",
        message: error?.response || error,
      });
    }
  },
  computed: {
    urlScript() {
      return this.$route.fullPath;
    },
    isRouterChanged() {
      return this.$store.getters["data_card/getRouterChanged"];
    },
  },
};
</script>

<style scoped></style>
