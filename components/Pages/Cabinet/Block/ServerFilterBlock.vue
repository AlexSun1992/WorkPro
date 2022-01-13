<template>
  <div>
    <Multiselect
      v-if="list"
      :list="list"
      :placeholder="name"
      @update="update"
    />
  </div>
</template>
<script>
import Multiselect from "../../../Libs/Multiselect/Multiselect.vue";
export default {
  name: "ServerFilterBlock",
  components: {
    Multiselect,
  },

  props: {
    queryParamName: {
      type: String,
      required: false,
    },
    menuDic: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    idParamName: {
      type: String,
      required: false,
    },
    fk: {
      type: String,
      required: false,
    },
    required: {
      type: Boolean,
      required: false,
    },
    dictionary: {
      type: Array,
      required: false,
    },
  },

  data() {
    return {
      list: [],
      queryParamValue: null,
    };
  },

  created() {
    this.setOptions();
  },

  methods: {
    async setOptions() {
      if (this.dictionary?.length) {
        for (let item of this.dictionary) {
          this.list.push({
            text: item,
            value: item,
          });
        }
      } else {
        let fkFields = this.fk.match(/\w+/gi);
        let { _, items } = await this.$store.dispatch("data_card/fetchList", {
          idItem: this.menuDic,
          idModule: this.$route.params.idModule,
        });

        let str = this.fk;

        for (let i = 0; i < items.length; i++) {
          str = this.fk;
          let value = null;
          for (let j = 0; j < fkFields.length; j++) {
            if (items[i][fkFields[j]]) {
              if (fkFields[j] === this.idParamName) {
                value = items[i][fkFields[j]];
              }
              str = str.replace(fkFields[j], items[i][fkFields[j]]);
            }
          }
          this.list.push({
            value,
            text: str,
          });
        }
      }
    },

    setFilter() {
      let filterObj;
      for (const [propertyName, filter] of Object.entries({
        [this.queryParamName]: this.queryParamValue,
      })) {
        filterObj = { propertyName, filter };
      }
      let foundedFilter = this.$store.getters["blocks/getServerFilter"].find(
        (filter) => {
          return filter.propertyName === this.queryParamName;
        }
      );
      if (foundedFilter) {
        this.$store.commit("blocks/updateServerFilter", {
          propertyName: this.queryParamName,
          filter: this.queryParamValue,
        });
      } else {
        this.$store.commit("blocks/setServerFilters", filterObj);
      }
    },

    update(e) {
      this.queryParamValue = e.value;
      this.setFilter();
      let query = {
        [this.queryParamName]: this.queryParamValue,
      };
      if (this.$store.getters["blocks/getServerFilter"].length > 1) {
        query = {
          filters: JSON.stringify(
            this.$store.getters["blocks/getServerFilter"]
          ),
        };
      }
      this.$store.dispatch("blocks/fetchBlock", {
        id: this.$route.params.idItem,
        query,
      });
    },
  },
};
</script>

<style scoped></style>
