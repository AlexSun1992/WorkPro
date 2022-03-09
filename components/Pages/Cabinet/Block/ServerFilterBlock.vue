<template>
  <div>
    <div v-if="isShowAsTemplate === true">
      <b-form-group>
        <b-input
          aria-controls="collapse-4"
          @click="openList"
          :placeholder="name"
          v-model="selectedItem"
        ></b-input>
        <b-collapse id="collapse-4" v-model="visible">
          <b-card>
            <b-col>
              <wrapper-item-from-template
                :itemId="Number(itemId)"
                :template="getData"
                :isEmpty="isEmptyContent"
                :isButtonRender="getData"
                @update="update"
              >
              </wrapper-item-from-template>
            </b-col>
          </b-card>
        </b-collapse>
      </b-form-group>
    </div>
    <div v-if="isShowAsTemplate === false">
      <Multiselect
        v-if="list"
        :list="list"
        :placeholder="name"
        @update="update"
        @mousedown="test"
        :isAutoSelectSingleRow="firstValueFromList"
        :isAutoOpenForMultipleRow="InsuredPersonsList"
      />
    </div>
  </div>
</template>
<script>
import Multiselect from "../../../Libs/Multiselect/Multiselect.vue";
import VRuntimeTemplate from "v-runtime-template";
import SelectItemFromTemplate from "../../../Libs/Controls/ControlListSelect/SelectItemFromTemplate.vue";
import WrapperItemFromTemplate from "../../../Libs/Controls/ControlListSelect/WrapperItemFromTemplate.vue";
import ChooseButton from "./ChooseButton.vue";
export default {
  name: "ServerFilterBlock",
  components: {
    Multiselect,
    VRuntimeTemplate,
    SelectItemFromTemplate,
    WrapperItemFromTemplate,
    ChooseButton,
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
    };
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
  },

  created() {
    this.setOptions();
    if (this.menuDic !== undefined) {
      this.itemId = this.menuDic;
    }
  },

  computed: {
    getData: {
      get: function () {
        if (this.itemId !== null) {
          const data = this.$store.getters["menu/getMenuById"](
            this.itemId
          ).SVJCARDGRID;
          if (data) {
            return data;
          }
        }
      },
    },
    isEmptyContent: {
      get: function () {
        if (this.itemId !== null) {
          const block = this.$store.getters["blocks/getBlockById"](this.itemId);
          if (block) {
            return !block?.data?.items.length;
          } else {
            return false;
          }
        }
      },
    },
  },

  methods: {
    openList() {
      this.visible = !this.visible;
    },
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

      if (this.list.length === 1 && this.isShowAsTemplate === false) {
        this.firstValueFromList = this.list[0];
      }

      if (this.list.length > 1 && this.isShowAsTemplate === false) {
        this.InsuredPersonsList = this.list;
      }

      if (this.list.length > 1 && this.isShowAsTemplate === true) {
        this.openList();
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
      console.log(e);
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
    test() {
      console.log("!!");
    },
  },
};
</script>

<style scoped>
.hide {
  display: none;
}
</style>
