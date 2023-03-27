<template>
  <div>
    <b-button @click="$refs.file.click()" class="btn-doc-add">{{
      data.label
    }}</b-button>
    <div>
      <input
        ref="file"
        type="file"
        multiple
        @change="getFileNames(), handleFileUpload()"
      />
    </div>
    <ul>
      <li v-for="(item, index) in filesHub" :key="index">
        {{ item.name }} {{ item.size + " кб" }}
        <b-button @click="removeFile(item, index)">Удалить</b-button>
      </li>
    </ul>
    {{ fileSize }}
  </div>
</template>

<script>
import { BButton } from "bootstrap-vue";

export default {
  components: {
    BButton,
  },
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
      file: null,
      filesHub: [],
    };
  },

  computed: {
    fileSize() {
      const getSize = [];
      this.filesHub.forEach((item) => getSize.push(item.size));
      const getFullSize = getSize.reduce(function (firstEl, secondEl) {
        return firstEl + secondEl;
      }, 0);
      return getFullSize + " кб";
    },
  },

  methods: {
    handleFileUpload() {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.file,
      });
    },

    getFileNames() {
      const rebuildObj = Object.entries(this.$refs.file.files);
      const result = rebuildObj.map((item) =>
        item.filter((elem) => typeof elem !== "string")
      );
      result.forEach((item) =>
        item.forEach((elem) => this.filesHub.push(elem))
      );
    },

    removeFile(elem, index) {
      this.filesHub = this.filesHub.filter((item) => item !== elem);
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
