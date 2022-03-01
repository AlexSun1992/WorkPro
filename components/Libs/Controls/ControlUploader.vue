<template>
  <div>
    <b-button @click="$refs.file.click()" class="btn-doc-add">{{
      data.label
    }}</b-button>
    <input
      ref="file"
      type="file"
      style="display: none"
      v-on:change="handleFileUpload()"
    />
    <!-- <div class="progress">
      <b-progress
        class="mb-2"
        variant="success"
        show-progress
        animated
      ></b-progress>
    </div> -->
    {{ fileCheck }}
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
    };
  },
  created() {},
  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
      console.log(this.file);
      this.submitFile();
    },
    submitFile() {
      console.log("submitFile");
    },
  },
  computed: {
    fileCheck() {
      if (this.file?.size) {
        return (this.file.size / 1024000).toFixed(1) + "мб";
      }
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
