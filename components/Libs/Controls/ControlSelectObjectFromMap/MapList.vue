<template>
  <div :class="['map-list ', 'tab-vis-' + isShowMap]">
    <BrandLoader url="/img/loader.json"></BrandLoader>
    <template v-if="showContent">
      <div class="map-tabs-blk">
        <TabGroup
          @change="handleTabChange"
          :activeTab="isShowMap"
          :tabs="tabs"
        ></TabGroup>
      </div>
      <!--      TODO: add advanced conditional filter-block rendering (not v-if SFIL) -->
      <!--    SFIL is hardcoded by convention-->
      <filter-block
        :itemId="String(itemId)"
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
      <div :class="['map-informer', noItemsFound ? 'mt-3' : '']">
        <ControlInformer
          v-if="noItemsFound"
          :data="informerData"
        >
        </ControlInformer>
      </div>
      <div
        class="list-clinics"
        v-if="isShowMap === 'list'"
      >
        <div class="list-button">
          <ObjectList
            :dataContent="getMainFilteredItems"
            :itemId="itemId"
            :selectable="hasChooseButton"
            @select="handleSelect"
          ></ObjectList>
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
        :itemId="itemId"
        :hasChooseButton="hasChooseButton"
        @select="handleChooseButtonClicked"
        class="mt-3 control-map"
        :filterIcons="getFilterIcons"
      ></ControlYMap>
    </template>
  </div>
</template>

<script>
import ControlYMap from "@/components/Libs/Controls/ControlMap/ControlYMap";
import FilterBlock from "@/components/Pages/Cabinet/Block/FilterBlock/FilterBlock";
import ControlInformer from "@/components/Libs/Controls/ControlInformer/ControlInformer";
import SearchInput from "./common/Input/SearchInput";
import TabGroup from "./common/Tab/TabGroup";
import ObjectList from "./ObjectList";
import BrandLoader from "@/components/Libs/Controls/ControlBrandLoader/BrandLoader";

export default {
  name: "MapList",
  components: {
    BrandLoader,
    ControlInformer,
    ObjectList,
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
      const card = this.dataContent.items.find((item) => item.ID === id);
      this.$emit("update", card);
    },
  },
  computed: {
    getMainFilteredItems() {
      this.setQueryURL();
      return this.getData?.filter((el) => {
        const searchItems = [el.SADDRESS, el.SFIL, el.SNAME, el.SMETRO?.map((el) => el.SNAME)].flat();
        return searchItems.some((str) => str?.toLowerCase().includes(this.searchString.toLowerCase().trim()));
      });
    },
    dataContent() {
      const block = this.$store.getters["blocks/getBlockById"](this.itemId, "AND");
      return block?.data || {};
    },
    getData() {
      return this.dataContent.items;
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
    showContent() {
      return Object.keys(this.dataContent).length > 0;
    },
    showLoader() {
      return this.$store.getters["ui/loader/getShowLoader"];
    },
  },
  mounted() {
    this.$store.commit("ui/loader/setShowLoader", true);
  },
  beforeUnmount() {
    if (this.showLoader) {
      this.$store.commit("ui/loader/setShowLoader", false);
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
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.control-select-object-from-map .list-clinics,
.control-select-object-from-map .control-map {
  height: 500px;
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
.control-map {
  position: relative;
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
  display: grid;
  grid-template-rows: 36px min-content min-content min-content auto;
  grid-template-areas: "tab" "filter" "search" "informer" "list";
  grid-template-columns: 100%;
}
.list-clinics > .btn-baloon {
  margin-left: 20px;
}
@media (max-width: 992px) {
  .control-select-object-from-map .list-clinics,
  .modal-open .control-map {
    height: calc(90vh - 216px);
  }

  .map-list {
    display: grid;
    grid-template-areas: "tab" "search" "filter" "informer" "list";
    grid-template-columns: 100%;
    grid-template-rows: 40px min-content min-content min-content auto;
  }
  .control-select-object-from-map .map-list {
    display: block;
    padding-top: 16px;
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
  .control-select-object-from-map .list-button {
    height: 100%;
    max-height: calc(100vh - 235px);
  }
  .cards-component {
    padding-bottom: 70px;
  }
}

@media (max-height: 700px) and (max-width: 992px) {
  .control-select-object-from-map .map-list {
    max-height: 80vh;
  }
  .control-select-object-from-map .list-clinics,
  .modal-open .control-map {
    height: calc(80vh - 216px);
  }
}
</style>
