<template>
  <div class="hidden-loader"></div>
</template>

<script>
import { computed, watch, ref, defineComponent, onUnmounted, getCurrentInstance } from "vue";

export default defineComponent({
  name: "Loading",

  setup() {
    const instance = getCurrentInstance();
    const store = instance.proxy.$store;

    const cleanupTimeoutId = ref(null);

    const requestsCount = computed(() => {
      return store.getters["ui/loader/requestsCount"];
    });

    watch(requestsCount, (currentlyInProgress) => {
      if (cleanupTimeoutId.value) {
        clearTimeout(cleanupTimeoutId.value);
        cleanupTimeoutId.value = null;
      }
      if (!currentlyInProgress) {
        cleanupTimeoutId.value = setTimeout(() => {
          store.commit("ui/loader/setShowLoader", false);
        }, 200);
      }
    });

    onUnmounted(() => {
      if (cleanupTimeoutId.value) {
        clearTimeout(cleanupTimeoutId.value);
      }
    });

    const start = () => {
      store.commit("ui/loader/incrementRequestCount");
    };
    const finish = () => {
      store.commit("ui/loader/decrementRequestCount");
    };

    return {
      requestsCount,
      cleanupTimeoutId,
      start,
      finish,
    };
  },
});
</script>

<style scoped>
.hidden-loader {
  display: none;
}

.loading-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  text-align: center;
  padding-top: 200px;
  font-size: 30px;
  font-family: sans-serif;
}
</style>
