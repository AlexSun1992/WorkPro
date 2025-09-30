<template>
  <div>
    <div
      v-for="(itemBlock, bKey) in transformDocumentsData(data)"
      :key="bKey"
      class="blk-file-list"
    >
      <div
        v-if="itemBlock.files.length > 0"
        class="title-file-list"
      >
        {{ itemBlock.title }}
      </div>
      <div
        v-for="(itemFile, fKey) in itemBlock.files"
        :key="fKey"
        class="ins-case-file"
      >
        <div class="ins-case-file-info">
          <span class="ins-case-file-name"
            >{{ itemFile.name }}&nbsp;&nbsp;<span>({{ itemFile.size }})</span></span
          >
          <span class="ins-case-file-date">{{ itemFile.date }}</span>
        </div>
        <div class="ins-case-file-dwnld">
          <button
            type="button"
            @click="downloadItem(itemFile.linkfile, itemFile.name)"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DwnldDocs",
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    transformDocumentsData(data) {
      const result = [];
      for (const docGroup of data) {
        const snameType = docGroup.find((item) => item.label === "SNAME_TYPE")?.value || "";
        const sdocs = docGroup.find((item) => item.label === "SDOCS")?.value || [];
        const group = {
          title: snameType,
          files: [],
        };
        for (const fileData of sdocs) {
          const name = fileData.find((item) => item.label === "SNAME")?.value || "";
          const date = fileData.find((item) => item.label === "SDATE")?.value || "";
          const idDocPhotoRel = fileData.find((item) => item.label === "IDDOCPHOTOREL")?.value || "";
          const idDocType = fileData.find((item) => item.label === "IDPHOTO")?.value || "";
          const size = this.convertSize(fileData.find((item) => item.label === "NSIZE")?.value || 0);
          group.files.push({
            name,
            date: date.replace(" ", ", "),
            linkfile: `${idDocType}?rel=${idDocPhotoRel}`,
            size,
          });
        }
        result.push(group);
      }
      return result;
    },
    async downloadItem(linkfile, fileName) {
      try {
        const response = await this.$axios({
          url: `/am/main/v2/file/${linkfile}`,
          method: "GET",
          responseType: "blob",
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
      } catch (err) {
        this.$modal.alert({
          title: "Извините, произошла ошибка",
          msg: "Не удалось скачать файл",
          icon: "error",
          btnOk: false,
        });
      }
    },
    convertSize(b) {
      let fsize;
      const fsizekb = b / 1024;
      const fsizemb = fsizekb / 1024;

      if (fsizekb <= 1024) {
        fsize = `${fsizekb.toFixed(1)} кб`;
      } else if (fsizekb >= 1024 && fsizemb <= 1024) {
        fsize = `${fsizemb.toFixed(1)} мб`;
      }
      return fsize;
    },
  },
};
</script>

<style scoped>
.title-file-list {
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.5rem;
  margin-bottom: 20px;
}
.ins-case-file {
  display: grid;
  grid-template-columns: auto 48px;
  width: 100%;
  align-items: center;
}
.ins-case-file-info {
  padding: 12px 8px 12px 64px;
  position: relative;
}
.ins-case-file + .ins-case-file {
  margin-top: 24px;
}
.ins-case-file-info:after {
  content: "";
  position: absolute;
  width: 44px;
  height: 44px;
  border-radius: 44px;
  background: #edf8ea url(/img/ic_Description_Solid.svg) 50% 50% no-repeat;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
}
.ins-case-file-name {
  font-size: 1.125rem;
  line-height: 1.5rem;
}
.ins-case-file-name span {
  color: #868686;
}
.ins-case-file-date {
  display: block;
  font-size: 0.875rem;
  line-height: 1.125rem;
  color: #868686;
}
.ins-case-file-dwnld {
  text-align: right;
}
.ins-case-file button {
  width: 24px;
  height: 24px;
  background: transparent url(/img/ic_Download_Outline.svg) 50% 50% no-repeat;
  border: 0;
}
.blk-file-list + .blk-file-list {
  margin-top: 2rem;
}
</style>
