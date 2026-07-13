<template>
  <div>
    <nuxt-child
      v-if="isRouterChanged === false"
      :key="urlScript"
    />
  </div>
</template>

<script>
import { getCurrentInstance, onMounted } from "vue";

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

    const fetchCard = async () => {
      try {
        const settings = store.getters["menu/settings"].slice(-1).pop() || null;

        if (!settings) {
          instance.proxy.$nuxt.error({
            statusCode: 500,
            message: "Не удалось загрузить настройки страницы",
          });
          return;
        }
        if (settings.isCard || settings.isWizard) {
          await store.dispatch("card/setCard", {
            page: route.params,
            settings,
          });
        }
      } catch (error) {
        console.error(error?.response || error);
      }
    };

    onMounted(() => {
      router.afterEach(() => {
        store.commit("data_card/setRouterChanged", false);
      });
      if (POLICY_CARDS.includes(route.params.idItem)) {
        store.commit("data_card/setIsShowLoader", true);
      }
      fetchCard();
    });
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
