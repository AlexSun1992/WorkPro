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
            value: this.queryParamName,
          });
        }
      } else {
        let fkFields = this.fk.match(/\w+/gi);
        let { _, items } = await this.$store.dispatch("data_card/fetchList", {
          idItem: this.menuDic,
          idModule: this.$route.params.idModule,
        });

        let str = this.fk;

        for (let i = 0; i < fkFields.length; i++) {
          if (items[0][fkFields[i]]) {
            if (fkFields[i] === this.queryParamName)
              this.queryParamValue = items[0][fkFields[i]];
            str = str.replace(fkFields[i], items[0][fkFields[i]]);
          }
        }
        this.list.push({
          text: str,
          value: this.idParamName,
        });
      }
    },

    setQueryURL: function () {
      window.history.replaceState(
        null,
        null,
        `?filters=${JSON.stringify(this.$store.getters["blocks/getFilters"])}`
      );
      const { url } = {
        url:
          this.$route.path +
          `?filters=${JSON.stringify(
            this.$store.getters["blocks/getFilters"]
          )}`,
      };
      this.$store.commit("menu/setQueriesUrlByIdMenu", {
        ...this.$route.params,
        url,
      });
    },

    getFilter() {
      let filter;
      if (this.$route.query.filters) {
        filter = JSON.parse(this.$route.query.filters);
        let candidate = filter.find(
          (item) => item.propertyName === this.queryParamName
        );
        if (!candidate) {
          filter?.push({
            propertyName: this.queryParamName,
            filter: this.queryParamValue,
          });
        }
      } else {
        filter = {
          [this.queryParamName]: this.queryParamValue,
        };
      }
      return filter;
    },

    // setFilter() {
    //   let filterObj;
    //   let isFilterSet = this.$store.getters["blocks/getFilters"].find(
    //     (filter) => filter.propertyName === this.queryParamName
    //   );
    //   if (isFilterSet) return;
    //   filterObj = this.getFilter();
    //   if (!Array.isArray(filterObj)) {
    //     for (const [propertyName, filter] of Object.entries(filterObj)) {
    //       filterObj = { propertyName, filter };
    //     }
    //   }
    //   this.$store.commit("blocks/setFilter", filterObj);
    //   this.setQueryURL();
    // },

    update(e) {
      this.queryParamValue = this.queryParamValue
        ? this.queryParamValue
        : e.text;
      let query = Array.isArray(this.getFilter())
        ? { filters: JSON.stringify(this.getFilter()) }
        : this.getFilter();
      // this.setFilter();
      this.$store.dispatch("blocks/fetchBlock", {
        id: this.$route.params.idItem,
        query,
      });
    },
  },
};
</script>

<style scoped></style>
