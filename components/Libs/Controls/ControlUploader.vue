<template>
  <div>
    <b-button class="btn-doc-add">{{ data.label }}</b-button>
    <input type="file" style="display: none" />
    <div class="progress">
      <b-progress
        class="mb-2"
        variant="success"
        show-progress
        animated
      ></b-progress>
    </div>
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
    id: {
      required: false,
      default: () => null,
    },
    rel: {
      required: false,
      default: () => null,
    },
  },
  data() {
    return {
      uploadPercentage: 0,
      percentsVisible: false,
    };
  },
  created() {},
  methods: {},
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
