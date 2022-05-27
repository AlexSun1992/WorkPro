<template>
  <div>
    <b-button @click="$refs.file.click()" class="btn-doc-add">{{
      data.label
    }}</b-button>
    <input
      ref="file"
      type="file"
      style="display: none"
      v-on:change="handleFileUpload($event)"
      multiple
    />
    {{ fileSize }}
  </div>
</template>

<script>
export default {
  name: "ControlUploader",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      uploadPercentage: 0,
      percentsVisible: false,
      file: null,
      size: null,
    };
  },

  computed: {
    fileSize() {
      return this.file !== null ? this.size + "кб" : null;
    },
  },

  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files;
      this.size = Object.values(this.file).reduce((sum, item) => {
        return sum + item.size;
      }, 0);

      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.file,
      });
    },
    submitFile() {
      return true;
    },
  },
};
</script>

<style lang="scss">
.files {
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > div {
    min-width: 135px;
  }
}
.button {
  height: fit-content;
}
.file {
  max-width: 500px;
}
.size {
  font-style: italic;
  font-weight: 300;
  font-size: 15px;
}
</style>
