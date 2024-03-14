<template>
  <div>
    <div v-if="isShowAsTemplate === true">
      <b-form-group>
        <b-input
          v-model="selectedItem"
          aria-controls="collapse-4"
          :placeholder="name"
          @click="openList"
        />
        <b-collapse id="collapse-4" v-model="visible">
          <b-card>
            <b-col>
              <wrapper-item-from-template
                :item-id="Number(itemId)"
                :template="getData"
                :is-empty="isEmptyContent"
                :is-button-render="getData"
                @update="update"
              />
            </b-col>
          </b-card>
        </b-collapse>
      </b-form-group>
    </div>
    <div v-if="isShowAsTemplate === false">
      <Multiselect
        ref="multiselect"
        v-if="list"
        :list="list"
        :placeholder="name"
        :is-auto-select-single-row="firstValueFromList"
        :is-auto-open="isAutoOpen"
        @update="update"
      />
    </div>
  </div>
</template>
<script>
import VRuntimeTemplate from "v-runtime-template";
import { BFormGroup } from "bootstrap-vue";
import Multiselect from "../../../../Libs/Multiselect/Multiselect.vue";
import SelectItemFromTemplate from "../../../../Libs/Controls/ControlListSelect/SelectItemFromTemplate.vue";
import WrapperItemFromTemplate from "../../../../Libs/Controls/ControlListSelect/WrapperItemFromTemplate.vue";
import ChooseButton from "../ChooseButton.vue";
import { elementDateWasChoosenByUser } from "./ServerFilterBlock.helper";

export default {
  name: "ServerFilterBlock",
  components: {
    Multiselect,
    VRuntimeTemplate,
    SelectItemFromTemplate,
    WrapperItemFromTemplate,
    ChooseButton,
    BFormGroup,
  },

  props: {
    data: {
      type: Object,
      required: false,
      default: () => {},
    },
    isShowAsTemplate: {
      type: Boolean,
      required: false,
      default: () => false,
    },
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
    template: {
      type: String,
      required: false,
      default: () => "",
    },

    isButtonRender: {
      type: Boolean,
      required: false,
      default: () => true,
    },
    isAutoOpen: {
      type: Boolean,
      required: false,
      default: () => false,
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
    };
  },

  computed: {
    getData: {
      get() {
        if (this.itemId !== null) {
          const data = this.$store.getters["menu/getMenuById"](
            this.itemId
          ).SVJCARDGRID;
          if (data) {
            return data;
          }
        }
        return null;
      },
    },
    isEmptyContent: {
      get() {
        if (this.itemId !== null) {
          const block = this.$store.getters["blocks/getBlockById"](this.itemId);
          if (block) {
            return !block?.data?.items.length;
          }
          return false;
        }
        return null;
      },
    },
  },

  created() {
    this.setOptions();
    if (this.menuDic !== undefined) {
      this.itemId = this.menuDic;
    }
  },

  mounted() {
    const defaultItem = this.dictionary?.find((item) => item.isDefault);

    if (defaultItem && this.$refs.multiselect) {
      const serverFilters = this.$store.getters["blocks/getServerFilters"];
      const selectOptionItems = this.dictionary;
      const choosenElement = elementDateWasChoosenByUser(
        selectOptionItems,
        serverFilters
      );

      if (choosenElement !== undefined) {
        this.$refs.multiselect.selectedItem = {
          text: choosenElement.text,
          value: choosenElement.value,
        };
      } else
        this.$refs.multiselect.selectedItem = {
          text: defaultItem.text,
          value: defaultItem.value,
          isDefault: defaultItem.isDefault,
        };
    }
  },

  methods: {
    openList() {
      this.visible = !this.visible;
    },
    async setOptions() {
      if (this.dictionary?.length) {
        for (const item of this.dictionary) {
          if (typeof item === "string") {
            this.list.push({
              text: item,
              value: item,
            });
          } else {
            this.list.push(item);
          }
        }
      } else {
        const { _, items } = await this.$store.dispatch("data_card/fetchList", {
          idItem: this.menuDic,
          idModule: this.$route.params.idModule,
        });
        for (let i = 0; i < items.length; i++) {
          if (!items[i][this.queryParamName]) {
            console.log(
              `При выборе из списка в компоненте ServerFilterBlock произошла ошибка, т.к. в полученных данных (/am/main/v2/data/55/${this.menuDic}) отсутствует поле ${this.queryParamName}, заданное как атрибут компонента в конфигураторе (queryParamName="${this.queryParamName}") `
            );
          }
          this.list.push({
            value: items[i][this.queryParamName],
            text: items[i][this.fk],
            data: items[i],
          });
        }
      }
      const serverFiltersTest = this.$store.getters["blocks/getServerFilters"];

      if (serverFiltersTest.length > 0) {
        const choosenElement = elementDateWasChoosenByUser(
          this.list,
          serverFiltersTest
        );
        if (choosenElement !== undefined) {
          this.firstValueFromList = choosenElement;
        }
      }

      if (this.list.length === 1 && this.isShowAsTemplate === false) {
        this.firstValueFromList = this.list[0];
      }

      if (this.list.length > 1 && this.isShowAsTemplate === false) {
        const getDefaultItem = this.list.find(
          (item) => item.data?.LDEFAULT === true
        );

        if (getDefaultItem) {
          this.firstValueFromList = getDefaultItem;
        }
      }

      if (this.list.length === 1 && this.isShowAsTemplate === true) {
        if (this.list[0]?.data) {
          this.update(this.list[0]);
        }
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

      const foundedFilter = this.$store.getters["blocks/getServerFilters"].find(
        (filter) => {
          return filter.propertyName === this.queryParamName;
        }
      );

      if (foundedFilter) {
        if (foundedFilter && e.data) {
          this.$store.commit("blocks/updateServerFilters", {
            propertyName: this.queryParamName,
            filter: this.queryParamValue,
            id: this?.id,
            filterIdNumber: e?.data[this.id],
            filterOptions: e.data,
          });
        }
        if (foundedFilter && !e.data) {
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
      if (e.isDefault && this.componentUpdatedCount === 1) return;
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

<style scoped>
.hide {
  display: none;
}
</style>
