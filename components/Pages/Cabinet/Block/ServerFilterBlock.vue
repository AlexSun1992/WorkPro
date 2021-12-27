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
    },

    getFilter() {
      let filter;
      if (this.$route.query.filters) {
        filter = JSON.parse(this.$route.query.filters);
        filter?.push({
          propertyName: this.queryParamName,
          filter: this.queryParamValue,
        });
      } else {
        filter = {
          [this.queryParamName]: this.queryParamValue,
        };
      }
      return filter;
    },

    update() {
      this.$store.dispatch("blocks/fetchBlock", {
        id: this.$route.params.idItem,
        query: Array.isArray(this.getFilter())
          ? { filters: JSON.stringify(this.getFilter()) }
          : this.getFilter(),
      });
    },
  },
};
</script>

<style scoped></style>
