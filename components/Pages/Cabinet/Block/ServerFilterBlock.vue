<template>
  <div>
    <Multiselect
      v-if="list"
      :list="list"
      :placeholder="name"
      @update="update"
      :isAutoopenForMultipleRow="firstValueFromList"
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
    id: {
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
      firstValueFromList: null,
    };
  },

  created() {
    this.setOptions();
  },

  // mounted() {
  //   console.log("list:", this.list);
  //   console.log("queryParamName:", this.queryParamName);
  //   console.log("menudic:", this.menuDic);
  //   console.log("name:", this.name);
  //   console.log("idParamName:", this.idParamName);
  //   console.log("id:", this.id);
  //   console.log("fk:", this.fk);
  //   console.log("required:", this.required);
  //   console.log("dictionary:", this.dictionary);
  //   console.log("Предполагаемая длина:", this.isAutoSelectSingleRow);
  // },

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
            data: items[i],
          });
        }
      }
      if (this.list[0]?.hasOwnProperty("data") && this.list.length > 1) {
        this.firstValueFromList = this.list[0];
      }
    },

    setFilter(e) {
      let filterObj;
      for (const [propertyName, filter] of Object.entries({
        [this.queryParamName]: this.queryParamValue,
      })) {
        filterObj = {
          propertyName,
          filter,
        };
      }
      let foundedFilter = this.$store.getters["blocks/getServerFilters"].find(
        (filter) => {
          return filter.propertyName === this.queryParamName;
        }
      );

      if (foundedFilter) {
        this.$store.commit("blocks/updateServerFilters", {
          propertyName: this.queryParamName,
          filter: this.queryParamValue,
        });
      } else {
        this.$store.commit("blocks/setServerFilters", filterObj);
        if (this.id && e.data[this.id])
          this.$store.commit("blocks/setServerFilters", {
            propertyName: this.id,
            filter: e.data[this.id].toString(),
          });
      }
    },

    update(e) {
      this.queryParamValue = e.value;
      this.setFilter(e);
      let query = {
        [this.queryParamName]: this.queryParamValue,
      };
      if (this.$store.getters["blocks/getServerFilters"].length > 1) {
        query = {
          filters: JSON.stringify(
            this.$store.getters["blocks/getServerFilters"]
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
