<template>
  <div>
    <div
      v-if="isLoaderShown"
      class="overlay"
    >
      <lottie-vue-player
        :src="cachedURL"
        :autoplay="true"
        :loop="true"
      >
      </lottie-vue-player>
    </div>
  </div>
</template>

<script>
export default {
  name: "BrandLoader",
  props: {
    url: {
      type: String,
      default: "",
    },
    data: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      cachedURL: null,
      objectUrl: null,
      isShowLoader: false,
      loaderTimeout: null,
      isCurrRequestContinue: false,
    };
  },

  computed: {
    isLoaderShown() {
      return this.isShowLoader || this.isData || this.isCurrRequestContinue;
    },

    isData() {
      if (!this.data || typeof this.data !== "object") {
        return false;
      }
      return Object.hasOwn(this.data, "filters") && this.data.filters.length === 0;
    },

    storageKey() {
      return `brandLoader:${this.url}`;
    },
    isRequestsInProgress() {
      return this.$store.getters["ui/loader/isRequestsInProgress"];
    },
    showLoader() {
      return this.$store.getters["ui/loader/getShowLoader"];
    },
  },

  async created() {
    this.addRequestInterceptors();
  },

  async mounted() {
    this.cachedURL = this.url;
    await this.cacheFile();
  },

  beforeDestroy() {
    clearTimeout(this.loaderTimeout);
  },

  watch: {
    showLoader(val) {
      if (!val) {
        clearTimeout(this.loaderTimeout);

        this.$store.commit("ui/loader/clearCounter");
        this.isShowLoader = false;
      }

      if (val && this.isRequestsInProgress) {
        this.isShowLoader = true;
      }
    },
    isRequestsInProgress(val) {
      if (this.data && val === true) {
        this.isCurrRequestContinue = true;
      }
      if (this.data && val === false) {
        this.isCurrRequestContinue = false;
      }

      clearTimeout(this.loaderTimeout);
      if (!this.showLoader) {
        this.isShowLoader = false;

        return;
      }

      if (val) {
        this.isShowLoader = val;

        return;
      }
      // Задержку используем для случая когда запросы выполняются последовательно,
      // что бы избежать постоянного перезапуска лоудера
      this.loaderTimeout = setTimeout(() => {
        this.isShowLoader = this.isRequestsInProgress && this.showLoader;
      }, 100);
    },
  },

  methods: {
    async fetchFile() {
      try {
        const response = await fetch(this.url);

        if (response.ok) {
          return await response.json();
        }

        return null;
      } catch (err) {
        console.error(`fetchFile. ERROR: ${err}`);

        return null;
      }
    },

    saveToStore(json) {
      window.localStorage.setItem(this.storageKey, JSON.stringify(json));
    },

    getFromStore() {
      const stored = window.localStorage.getItem(this.storageKey);

      if (!stored) {
        return null;
      }

      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    },

    createBlobURL(json) {
      const blob = new Blob([JSON.stringify(json)], {
        type: "application/json",
      });

      if (this.objectUrl) {
        URL.revokeObjectURL(this.objectUrl);
      }

      this.objectUrl = URL.createObjectURL(blob);

      return this.objectUrl;
    },

    async cacheFile() {
      let json = this.getFromStore();

      if (!json) {
        json = await this.fetchFile();
        if (json) {
          this.saveToStore(json);
        }
      }

      if (json) {
        this.cachedURL = this.createBlobURL(json);
      }
    },

    addRequestInterceptors() {
      this.$axios.interceptors.request.use(
        (config) => {
          this.$store.commit("ui/loader/incrementRequestCount");

          return config;
        },
        (err) => Promise.reject(err)
      );

      this.$axios.interceptors.response.use(
        (config) => {
          this.$store.commit("ui/loader/decrementRequestCount");

          return config;
        },
        (err) => {
          this.$store.commit("ui/loader/decrementRequestCount");

          return Promise.reject(err);
        }
      );
    },
  },
};
</script>

<style scoped lang="css"></style>
