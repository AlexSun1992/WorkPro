<template>
  <div class="container">
    <h1>Ошибка</h1>
    <div v-if="errorComputed">
      <JsonViewer :value="errorComputed"
                  :expand-depth="2"
                  :expanded="true"
                  :show-array-index="true"
      />
    </div>

  </div>
</template>

<script>
import JsonViewer from 'vue-json-viewer/ssr'
import 'vue-json-viewer/style.css'

export default {
  name: "ErrorLayout",
  layout: "ErrorLayout",
  head: {
    title: "Страница не найдена",
  },
  components: { JsonViewer },
  props: {
    error: {
      type: String,
      default: ""
    }
  },
  computed: {
    errorComputed() {
      if (this.isHaveStoreError) {
        return this.$store.getters["custom_error_message/errors"];
      }

      return this.error || "Что-то пошло не так 😪";
    },
    isHaveStoreError() {
      const storeError = this.$store.getters["custom_error_message/errors"];

      return Boolean(storeError?.length);
    }
  },
};
</script>
