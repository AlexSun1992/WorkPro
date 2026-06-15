<template>
  <div>
    <div v-if="isShowAsTemplate === true">
      <form-group>
        <input
          v-model="selectedItem"
          aria-controls="collapse-4"
          :placeholder="name"
          @click="openList"
        />
        <ControlCollapse
          id="collapse-4"
          v-model="visible"
        >
          <div>
            <div class="col">
              <wrapper-item-from-template
                :item-id="Number(itemId)"
                :template="getData"
                :is-empty="isEmptyContent"
                :is-button-render="getData"
                @update="update"
              />
            </div>
          </div>
        </ControlCollapse>
      </form-group>
    </div>
    <div v-if="isShowAsTemplate === false">
      <Multiselect
        v-if="list"
        ref="multiselect"
        :loading="loading"
        :list="list"
        :placeholder="name"
        :is-auto-select-single-row="firstValueFromList"
        :is-auto-open="isAutoOpen"
        :is-readonly-after-select="isReadonlyMultiselect"
        @update="update"
      />
    </div>
  </div>
</template>

<script>
import FormGroup from "@/components/Libs/FormGroup/FormGroup";
import Multiselect from "@/components/Libs/Multiselect/Multiselect";
import WrapperItemFromTemplate from "@/components/Libs/Controls/ControlListSelect/WrapperItemFromTemplate";
import ControlCollapse from "@/components/Libs/Controls/ControlCollapse";
import { elementDateWasChoosenByUser } from "./ServerFilterBlock.helper";

export default {
  name: "ServerFilterBlock",
  components: {
    Multiselect,
    WrapperItemFromTemplate,
    FormGroup,
    ControlCollapse,
  },

  props: {
    data: {
      type: Object,
      default: () => {},
    },
    isShowAsTemplate: {
      type: Boolean,
      default: false,
    },
    queryParamName: {
      type: String,
      required: true,
    },
    menuDic: {
      type: String,
      default: undefined,
    },
    name: {
      type: String,
      default: "",
    },
    idParamName: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      default: "",
    },
    fk: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    dictionary: {
      type: Array,
      default: () => [],
    },
    template: {
      type: String,
      default: "",
    },
    cardId: {
      type: String,
      default: "",
    },
    isButtonRender: {
      type: Boolean,
      default: true,
    },
    isAutoOpen: {
      type: Boolean,
      default: false,
    },
    isReadonlyAfterSelect: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      list: [],
      queryParamValue: null,
      itemId: null,
      visible: false,
      selectedItem: "",
      firstValueFromList: null,
      InsuredPersonsList: null,
      componentUpdatedCount: 0,
      isReadonlyMultiselect: false,
      loading: false,
    };
  },

  computed: {
    getData() {
      if (this.itemId !== null) {
        const data = this.$store.getters["menu/getMenuById"](this.itemId).SVJCARDGRID;
        if (data) {
          return data;
        }
      }
      return null;
    },
    isEmptyContent() {
      if (this.itemId !== null) {
        const block = this.$store.getters["blocks/getBlockById"](this.itemId);
        if (block) {
          return !block?.data?.items.length;
        }
        return false;
      }
      return null;
    },

    serverFilters() {
      return this.$store.getters["blocks/getServerFilters"];
    },
  },

  created() {
    this.setOptions();
    this.$store.commit("ui/loader/setShowLoader", true);
    if (this.menuDic !== undefined) {
      this.itemId = this.menuDic;
    }
  },

  mounted() {
    const defaultItem = this.dictionary?.find((item) => item.isDefault);

    if (defaultItem && this.$refs.multiselect) {
      const chosenElement = elementDateWasChoosenByUser(this.dictionary, this.serverFilters);

      if (chosenElement !== undefined) {
        this.$refs.multiselect.selectedItem = {
          text: chosenElement.text,
          value: chosenElement.value,
        };
      } else {
        this.$refs.multiselect.selectedItem = {
          text: defaultItem.text,
          value: defaultItem.value,
          isDefault: defaultItem.isDefault,
        };
      }
    }
  },

  destroyed() {
    this.$store.commit("blocks/clearServerFilters");
    this.$store.commit("ui/loader/setShowLoader", false);
  },

  methods: {
    getQueryParams() {
      const url = new URL(window.location.href);
      const { searchParams } = url;

      if (searchParams.has(this.queryParamName)) {
        const queryValue = searchParams.get(this.queryParamName);
        return Object.values(this.list).find(({ value }) => String(value) === String(queryValue));
      }
      return false;
    },
    openList() {
      this.visible = !this.visible;
    },

    checkQueryParams() {
      const value = this.$route.query[this.queryParamName];
      if (!value) {
        return undefined;
      }

      return this.list.find((item) => String(item.value) === String(value));
    },

    async setOptions() {
      if (this.dictionary?.length) {
        this.dictionary.forEach((item) => {
          if (typeof item === "string") {
            this.list.push({
              text: item,
              value: item,
            });
          } else {
            this.list.push(item);
          }
        });
      } else {
        this.loading = true;
        const { items } = await this.$store.dispatch("data_card/fetchList", {
          idItem: this.menuDic,
          idModule: this.$route.params.idModule,
          idList: this.$route.params.idCard,
        });
        for (let i = 0; i < items.length; i++) {
          if (!items[i][this.queryParamName]) {
            console.log(
              `При выборе из списка в компоненте ServerFilterBlock произошла ошибка, т.к. в полученных данных (/lk/main/v2/data/55/${this.menuDic}) отсутствует поле ${this.queryParamName}, заданное как атрибут компонента в конфигураторе (queryParamName="${this.queryParamName}") `
            );
          }
          this.list.push({
            value: items[i][this.queryParamName],
            text: items[i][this.fk],
            data: items[i],
          });
        }
        this.loading = false;
      }

      if (this.serverFilters.length > 0) {
        const choosenElement = elementDateWasChoosenByUser(this.list, this.serverFilters);
        if (choosenElement !== undefined) {
          this.firstValueFromList = choosenElement;
        }
      }

      if (this.list.length === 1 && this.isShowAsTemplate === false) {
        // eslint-disable-next-line prefer-destructuring
        this.firstValueFromList = this.list[0];
      }

      if (this.list.length > 1 && this.isShowAsTemplate === false) {
        const getDefaultItem = this.list.find((item) => item.data?.LDEFAULT === true);

        if (getDefaultItem) {
          this.firstValueFromList = getDefaultItem;
        }
        const valueFromQuery = this.checkQueryParams();
        if (valueFromQuery) {
          this.firstValueFromList = valueFromQuery;
        }
      }

      if (this.list.length === 1 && this.isShowAsTemplate === true) {
        if (this.list[0]?.data) {
          this.update(this.list[0]);
        }
      }

      const elementFromQuery = this.getQueryParams();
      if (elementFromQuery) {
        this.firstValueFromList = elementFromQuery;
        this.isReadonlyMultiselect = this.isReadonlyAfterSelect;
      }
    },

    setFilter(e) {
      let filterObj;
      const queries = Object.entries({
        [this.queryParamName]: this.queryParamValue,
      });
      queries.forEach(([propertyName, filter]) => {
        filterObj = {
          propertyName,
          filter,
        };
      });

      const foundedFilter = this.serverFilters.find((filter) => filter.propertyName === this.queryParamName);

      if (foundedFilter) {
        if (e.data) {
          this.$store.commit("blocks/updateServerFilters", {
            propertyName: this.queryParamName,
            filter: this.queryParamValue,
            id: this?.id,
            filterIdNumber: e?.data[this.id],
            filterOptions: e.data,
          });
        } else {
          this.$store.commit("blocks/updateServerFilters", {
            propertyName: this.queryParamName,
            filter: this.queryParamValue,
          });
        }
      } else {
        this.$store.commit("blocks/setServerFilters", filterObj);
        if (this.id && e.data[this.id]) {
          this.$store.commit("blocks/setServerFilters", {
            propertyName: this.id,
            filter: e.data[this.id].toString(),
            filterOptions: e.data,
          });
        }
      }
    },

    update(e) {
      this.componentUpdatedCount++;
      if (e.isDefault && this.componentUpdatedCount === 1) {
        return;
      }
      if (!e?.text && !e?.value && this.isShowAsTemplate) {
        e = { data: e, text: e.SNAME, value: e.SPOLICY };
      }
      this.selectedItem = e.text;
      this.queryParamValue = e.value;
      this.visible = false;
      this.setFilter(e);

      let query = {
        [this.queryParamName]: this.queryParamValue,
      };

      if (this.serverFilters.length > 1) {
        query = {
          filters: JSON.stringify(this.serverFilters),
        };
      }

      this.$store.dispatch("blocks/fetchBlock", {
        id: this.$route.params.idItem,
        query,
        idCard: this.$route.params.idCard,
      });

      const urlObject = new URL(window.location.href);
      if (urlObject.searchParams.has(this.queryParamName) && this.queryParamValue) {
        urlObject.searchParams.set(this.queryParamName, this.queryParamValue);
        window.history.replaceState(null, null, urlObject);
      }
    },
  },
};
</script>

<style scoped></style>
