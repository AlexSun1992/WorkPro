<template>
  <div>
    <nuxt-child :key="$route.fullPath" />
  </div>
</template>

<script>
export default {
  middleware: "guest",
  layout: "CabinetLayout",
  name: "Full",
  async fetch({ store, route }) {
    try {
      await store.dispatch("menu/fetchMenu", route.params);
      const setting = store.getters["menu/breadcrumbs"].slice(-1).pop();
      if (setting.isCard || setting.isWizard) {
        await store.dispatch("card/setCard", {
          page: route.params,
          settings: setting,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style scoped></style>
