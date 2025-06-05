<template>
  <div class="light-gallery-wrapper">
    <div
      id="light-gallery"
      class="row"
    >
      <template v-for="(item, index) in urls">
        <a
          class="col-12 col-lg-3 mb-3"
          :key="`${item.url}-${index}`"
          :href="item.url"
          :data-sub-html="getLabel(item.name)"
        >
          <img
            :src="item.url"
            class="gallery-img"
            :title="getLabel(item.name)"
            :alt="getLabel(item.name)"
          />
        </a>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImageGallery",
  props: {
    urls: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      gallery: null,
    };
  },

  methods: {
    initGallery() {
      const el = document.getElementById("light-gallery");

      this.gallery?.destroy();

      this.gallery = window.lightGallery(el, {
        /* plugins: [ lgThumbnail ],
        margin: 10 */
      });
    },

    getLabel(name) {
      return name ?? "...";
    },
  },
  watch: {
    urls(val) {
      val?.length && this.initGallery();
    },
  },
  mounted() {
    this.urls?.length && this.initGallery();
  },
};
</script>

<style scoped>
.gallery-img {
  border: solid 1px #686868;
}

img {
  border-radius: 24px;
  width: 100%;
  height: 242px;
}
@media (max-width: 992px) {
  img {
    border-radius: 24px;
    width: 100%;
    height: auto;
  }
}
</style>
