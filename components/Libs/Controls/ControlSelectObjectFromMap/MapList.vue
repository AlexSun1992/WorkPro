<template>
  <div :class="['map-list ', 'tab-vis-' + isShowMap]">
    <BrandLoader url="/img/loader.json"></BrandLoader>
    <div class="map-tabs-blk">
      <TabGroup
        @change="handleTabChange"
        :activeTab="isShowMap"
        :tabs="tabs"
      ></TabGroup>
    </div>
    <!-- SFIL is hardcoded by convention -->
    <filter-block
      :itemId="getItemId"
      :filterType="filterType"
      :isMultiSelect="true"
      :propertyName="filterField"
      :showButtonAll="false"
      :show-filtered-items-count="false"
      :filterIcons="getFilterIcons"
      class="mt-3 filter-mob-flex"
      :resetFilterOnNoneFound="true"
    >
    </filter-block>
    <SearchInput
      :placeholder="getPlaceholder"
      v-model="searchString"
      class="map-list-search mt-3 mt-lg-0"
    >
    </SearchInput>
    <div
      class="map-informer mt-3"
      v-if="noItemsFound"
    >
      <ControlInformer :data="informerData"> </ControlInformer>
    </div>
    <div
      class="list-clinics"
      v-if="isShowMap === 'list'"
    >
      <div class="list-button">
        <CardsComponent
          :dataContent="getMainFilteredItems"
          :actionId="getActionId"
          :itemId="getItemId"
          :relationKey="getRelationID"
          :selectable="hasChooseButton"
          :filter-icons="getFilterIcons"
          @select="handleSelect"
        ></CardsComponent>
      </div>

      <button
        v-if="hasChooseButton"
        id="btn"
        type="button"
        :disabled="selectedId === null"
        class="btn-primary btn-baloon"
        @click="handleChooseButtonClicked(selectedId)"
      >
        Выбрать
      </button>
    </div>
    <!-- TODO: fix ControlYMap after library update to not rerender to show initBallon -->
    <!-- and use zoom with openBalloon instead -->
    <ControlYMap
      v-if="isShowMap === 'map' && !noItemsFound"
      :mainFilteredItems="getMainFilteredItems"
      :itemId="getItemId"
      :actionId="getActionId"
      :relationKey="getRelationID"
      :hasChooseButton="hasChooseButton"
      @update="handleChooseButtonClicked"
      :icons="dataContent.addFields.MAP_ICONS"
      class="mt-3 control-map"
      :filterIcons="getFilterIcons"
    ></ControlYMap>
  </div>
</template>

<script>
import ControlYMap from "@/components/Libs/Controls/ControlMap/ControlYMap";
import FilterBlock from "@/components/Pages/Cabinet/Block/FilterBlock/FilterBlock";
import ControlInformer from "@/components/Libs/Controls/ControlInformer/ControlInformer";
import SearchInput from "./common/Input/SearchInput";
import TabGroup from "./common/Tab/TabGroup";
import CardsComponent from "./CardsComponent";
import BrandLoader from "@/components/Libs/Controls/ControlBrandLoader/BrandLoader";

export default {
  name: "MapList",
  components: {
    BrandLoader,
    ControlInformer,
    CardsComponent,
    ControlYMap,
    FilterBlock,
    SearchInput,
    TabGroup,
  },
  props: {
    itemId: {
      type: Number,
      required: true,
    },
    hasChooseButton: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      searchString: "",
      isLoad: false,
      activeTab: "list",
      selectedId: null,
      tabs: [
        { id: "list", label: "Список" },
        { id: "map", label: "Карта" },
      ],
      filterField: "SFIL",
      filterType: "radiobutton",
      informerData: {
        name: "SWARNING_INFO",
        value: "Не найдено ни одного объекта, соответствующего параметрам поиска",
      },
    };
  },
  methods: {
    setQueryURL() {
      const urlObject = new URL(window.location.href);
      if (this.searchString === "") {
        urlObject.searchParams.delete("q");
      } else {
        urlObject.searchParams.set("q", this.searchString);
      }
      window.history.replaceState(null, null, urlObject);
    },
    handleTabChange(tab) {
      this.$store.commit("data_card/setShowMap", tab === "map");
    },
    handleSelect(id) {
      this.selectedId = id;
    },
    handleChooseButtonClicked(id) {
      const card = this.getData.find((item) => item.ID === id);
      this.$emit("update", card);
    },
    resetView() {
      this.$store.commit("blocks/clearFilter", {
        propertyName: this.filterField,
        filterType: this.filterType,
      });
      this.$store.commit("data_card/setShowMap", false);
    },
  },
  computed: {
    getMainFilteredItems() {
      this.setQueryURL();
      const filteredOptions = this.getData?.filter((el) => {
        const searchItems = [el.SADDRESS, el.SFIL, el.SNAME, el.SMETRO?.map((el) => el.SNAME)].flat();
        return searchItems.some((str) => str?.toLowerCase().includes(this.searchString.toLowerCase().trim()));
      });
      return filteredOptions;
    },
    dataContent() {
      const block = this.$store.getters["blocks/getBlockById"](this.itemId, "AND");
      return block?.data || {};
    },
    getData() {
      return this.dataContent.items;
    },
    getItemId() {
      return String(this.itemId);
    },
    getFilterIcons() {
      const unparsedIcons = this.dataContent.addFields?.FILTER_ICONS;
      if (!unparsedIcons) {
        return;
      }
      let parsedIcons = [];
      try {
        parsedIcons = JSON.parse(unparsedIcons);
      } catch (e) {
        console.error(e);
      }
      return parsedIcons;
    },
    getActionId() {
      return this.dataContent.addFields?.IDACTION;
    },
    getRelationID() {
      return this.dataContent.addFields?.RELATIONID;
    },
    getPlaceholder() {
      return this.dataContent.addFields?.PLACEHOLDER;
    },
    isShowMap() {
      const isShow = this.$store.getters["data_card/isShowMap"];
      return isShow ? "map" : "list";
    },
    noItemsFound() {
      return this.getMainFilteredItems?.length === 0;
    },
    showChooseButton() {
      return this.hasChooseButton && this.isShowMap === "list";
    },
    showLoader() {
      return this.$store.getters["ui/loader/getShowLoader"];
    },
  },
  watch: {
    dataContent(newVal) {
      if (this.showLoader && Object.keys(this.dataContent).length === 0) {
        this.$store.commit("data_card/setIsShowLoader", false);
      }
    },
  },
  mounted() {
    if (Object.keys(this.dataContent).length === 0) {
      this.$store.commit("data_card/setIsShowLoader", true);
    }
  },
  beforeDestroy() {
    if (this.showLoader) {
      this.$store.commit("data_card/setIsShowLoader", false);
    }
  },
};
</script>
<style scoped>
.control-select-object-from-map .list-button {
  height: calc(100% - 86px);
  overflow: auto;
  scroll-padding-right: 20px;
  margin-bottom: 16px;
}
.list-button::-webkit-scrollbar-thumb {
  background: var(--lgreen);
  border-radius: 10px;
  height: 220px;
}

.list-button::-webkit-scrollbar {
  width: 4px;
}

.list-button::-webkit-scrollbar:vertical {
  border: 4px solid transparent;
  width: 4px;
}
.map-tabs-blk {
  text-align: right;
  padding: 1px 20px 1px 0;
}

.filter-mob-flex {
  padding: 0;
  width: 100%;
  overflow: hidden;
}
.control-select-object-from-map .filter-mob-flex {
  padding: 0 20px;
}

.filter-mob-flex::v-deep .filterblock button {
  background-color: #edf8ea;
  color: #292929;
}
.filter-mob-flex::v-deep .filterblock button.filter-checked {
  background: #009639;
  color: #fff;
}
.list-clinics {
  margin-top: 16px;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.btn-secondary.btn-baloon {
  margin-left: 20px;
}
@media (max-width: 992px) {
  .list-clinics {
    padding-bottom: 13px;
  }
}

.map-tabs-blk {
  grid-area: tab;
}
.filter-mob-flex {
  grid-area: filter;
}
.map-list-search {
  grid-area: search;
}
.control-map,
.list-clinics {
  grid-area: list;
}
.map-informer {
  grid-area: informer;
}
.control-select-object-from-map .map-informer {
  margin-right: 20px;
  margin-left: 20px;
}

.map-list {
  display: grid;
  grid-template-areas: "tab search" "filter filter" "informer informer" "list list";
  grid-template-columns: 180px auto;
  grid-row: auto;
}

.control-select-object-from-map .map-list {
  width: 100%;
  height: 100%;
  padding: 0;
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-rows: 40px min-content min-content min-content auto;
  grid-template-areas: "tab" "filter" "search" "informer" "list";
  grid-template-columns: 100%;
}
.list-clinics > .btn-baloon {
  margin-left: 20px;
}
@media (max-width: 992px) {
  .map-list {
    display: grid;
    grid-template-areas: "tab" "search" "filter" "informer" "list";
    grid-template-columns: 100%;
    grid-template-rows: 40px min-content min-content min-content auto;
  }
  .control-select-object-from-map .map-list {
    display: block;
    padding-top: 30px;
  }
  .map-tabs-blk {
    text-align: left;
  }
  .control-select-object-from-map .map-tabs-blk {
    text-align: right;
  }

  .list-clinics > .btn-baloon {
    position: absolute;
    bottom: 24px;
    left: 20px;
    width: calc(100% - 40px);
    margin-left: 0;
  }
}
</style>
