<template>
  <div class="light-gallery-wrapper">
    <div
      id="light-gallery"
      class="light-gallery"
    >
      <a
        v-for="(item, index) in urls"
        :key="`${item.url} - ${index}`"
        :class="item.url === 'error' ? 'error-link' : ''"
        :href="item.url"
        :data-sub-html="getLabel(item.name)"
      >
        <img
          v-if="item.url !== 'error'"
          :src="item.url"
          :title="getLabel(item.name)"
          :alt="getLabel(item.name)"
        />
      </a>
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

  watch: {
    urls: {
      immediate: true,
      handler(val) {
        if (val?.length) {
          this.initGallery();
        }
      },
    },
  },
  mounted() {
    if (this.urls?.length) {
      this.initGallery();
    }
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
};
</script>

<style scoped>
.light-gallery-wrapper {
  position: relative;
}
.gallery-img {
  border: solid 1px #686868;
}
.error-link {
  text-align: center;
  color: inherit;
  text-decoration-line: none;
  pointer-events: none;
}
.error-link:after {
  content: "Произошла ошибка при загрузке файла";
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.875rem;
  line-height: 1.4375rem;
  padding: 44px 16px 0;
  background: url(/img/icon-treangl-warning.svg) center top no-repeat;
  width: 100%;
  left: 50%;
}

.light-gallery {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 16px;
}
.light-gallery a {
  position: relative;
  height: 242px;
  width: 100%;
  border: 1px solid var(--grey_20);
  border-radius: 24px;
  overflow: hidden;
}
.light-gallery img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

@media (max-width: 1220px) {
  .light-gallery {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
@media (max-width: 768px) {
  .light-gallery {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 380px) {
  .light-gallery {
    grid-template-columns: 1fr;
  }
}
</style>
