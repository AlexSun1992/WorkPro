<template>
  <div>
    <button
      @click="$refs.file.click()"
      type="button"
      class="btn btn-secondary btn-doc-add"
    >
      {{ data.label }}
    </button>
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
        <button
          type="button"
          class="btn btn-secondary"
          @click="removeFile(item, index)"
        >
          Удалить
        </button>
      </li>
    </ul>
    {{ fileSize }}
  </div>
</template>

<script>
import { getSynchronizedFileList } from "./ControlUploader.helper";

export default {
  components: {},
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
      const collectionOfFilesSize = [];

      this.filesHub.forEach((item) => collectionOfFilesSize.push(item.size));

      const getFullSize = collectionOfFilesSize.reduce(function (
        firstEl,
        secondEl
      ) {
        return firstEl + secondEl;
      },
      0);
      return getFullSize + " кб";
    },
  },

  methods: {
    handleFileUpload() {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.$refs.file.files,
      });
    },

    getFileNames() {
      const transformedObjectToArrayOfLoadedFiles = Object.entries(
        this.$refs.file.files
      );
      const pureArrayOfFiles = transformedObjectToArrayOfLoadedFiles.map(
        (item) => item.filter((elem) => typeof elem !== "string")
      );
      pureArrayOfFiles.forEach((item) =>
        item.forEach((elem) => this.filesHub.push(elem))
      );
      const result = getSynchronizedFileList(this.filesHub);
      this.$refs.file.files = result;
    },

    removeFile(elem, index) {
      this.filesHub = this.filesHub.filter((item, id) => id !== index);
      const result = getSynchronizedFileList(this.filesHub);
      this.$refs.file.files = result;
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
