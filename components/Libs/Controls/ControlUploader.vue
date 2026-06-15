<template>
  <div>
    <button
      type="button"
      class="btn btn-secondary btn-doc-add"
      @click="$refs.file.click()"
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
      <li
        v-for="(item, index) in filesHub"
        :key="index"
      >
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
import { ref, computed } from "vue";
import { getSynchronizedFileList } from "./ControlUploader.helper";

export default {
  name: "ControlUploader",
  components: {},
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  emits: ["update"],

  setup(props, { emit }) {
    const file = ref(null);
    const filesHub = ref([]);

    const fileSize = computed(() => {
      const collectionOfFilesSize = [];
      filesHub.value.forEach((item) => collectionOfFilesSize.push(item.size));
      const getFullSize = collectionOfFilesSize.reduce((firstEl, secondEl) => firstEl + secondEl, 0);
      return `${getFullSize} кб`;
    });

    const handleFileUpload = () => {
      emit("update", {
        fieldId: props.data.fieldId,
        name: props.data.name,
        value: file.value.files,
      });
    };

    const getFileNames = () => {
      const transformedObjectToArrayOfLoadedFiles = Object.entries(file.value.files);
      const pureArrayOfFiles = transformedObjectToArrayOfLoadedFiles.map((item) =>
        item.filter((elem) => typeof elem !== "string")
      );
      pureArrayOfFiles.forEach((item) => item.forEach((elem) => filesHub.value.push(elem)));
      const result = getSynchronizedFileList(filesHub.value);
      file.value.files = result;
    };

    const removeFile = (elem, index) => {
      filesHub.value = filesHub.value.filter((item, id) => id !== index);
      const result = getSynchronizedFileList(filesHub.value);
      file.value.files = result;
    };

    return {
      file,
      filesHub,
      fileSize,
      handleFileUpload,
      getFileNames,
      removeFile,
    };
  },
};
</script>
