<template>
  <div :class="['control-gallery-wrapper', { 'data-loading': true }]">
    <ImageGallery
      v-if="urls && urls.length"
      :urls="urls"
    />
  </div>
</template>

<script>
import ImageGallery from "./ImageGallery.vue";

export default {
  name: "ControlGallery",
  components: { ImageGallery },
  props: {
    data: {
      type: Object,
      default: () => ({ value: [] }),
    },
  },
  data() {
    return {
      urls: [],
    };
  },

  mounted() {
    this.activateLoader(true);
    this.createUrls();
  },

  beforeDestroy() {
    this.activateLoader(false);
  },

  methods: {
    async createUrls() {
      const src = this.data?.value ?? [];
      const urls = src?.map((item) => this.prepareIMGObj(item));

      this.isLoading = true;
      this.urls = await Promise.all(urls);
      this.isLoading = false;
    },
    activateLoader(state = false) {
      this.$store.commit("ui/loader/setShowLoader", state);
    },
    async prepareIMGObj(data) {
      const url = await this.getUrl(data);
      return {
        name: data.name,
        url,
      };
    },
    getUrl(data) {
      const defUrl = "/am/main/v2/file";

      if (data.url) {
        return data.url;
      }

      return this.getAuthImg(`${defUrl}/${data?.id ?? 0}?rel=${data?.rel.replace("downloadphoto.aspx?id=", "") ?? 0}`);
    },
    async getAuthImg(url) {
      try {
        const resp = await this.$axios({
          url,
          method: "GET",
          responseType: "blob",
        });

        const blob = resp?.data;
        const ulr = blob && URL.createObjectURL(blob);

        return resp?.status === 200 ? ulr : "error";
      } catch (err) {
        console.error(`getAuthImg. ERROR: ${err}`);

        return "error";
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style lang="css" scoped>
.control-gallery-wrapper {
  position: relative;
}

.data-loading {
  min-height: 100px;
}
</style>
