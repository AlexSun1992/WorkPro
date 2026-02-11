<template>
  <div
    :class="{
      'agent-blocks': true,
      [activeClass]: !!activeClass,
    }"
    @click="handleClick"
  >
    <div class="map-balloon-header">
      <div class="map-balloon-title">
        {{ data.SNAME }}
      </div>
      <button
        :class="['btn-heart', { active: data.LFAV }]"
        :data-id="data.ID"
        @click.stop="favoriteButtonSendData"
      ></button>
    </div>

    <div
      v-if="filters"
      class="chip-pane"
    >
      <Chip
        v-for="filter in filters"
        :key="filter"
        :label="filter"
        :icon="filterIcons[filter]"
      ></Chip>
    </div>

    <div class="address-container mt-2">
      <span class="map-balloon-adress">Адрес: {{ data.SADDRESS }}</span>
      <button
        v-if="hasCopyButton"
        class="copy-button"
        @click.stop="copyAddress(data.SADDRESS)"
      ></button>
      <button
        class="btn-show-on-map"
        v-if="hasShowOnMapButton"
        @click.stop="showCardInMap(data.ID)"
      >
        Показать на карте
      </button>
    </div>

    <div class="doc-adress">
      <span
        v-for="station in data.SMETRO"
        :key="station.SNAME"
      >
        <span
          v-for="(id, index) in station.SUNDERLINE.idline"
          :key="index"
          :data-line="station.SUNDERLINE.sline[index]"
          :class="`undeground-color_${id}`"
        >
        </span
        >{{ station.SNAME }}
      </span>
    </div>
    <div
      class="map-balloon-description mt-2"
      v-for="comment in filterComments(data.SCOMMENT)"
      :key="comment.STITLE"
    >
      <p class="map-balloon-description-f">{{ comment.STITLE }}</p>
      <p class="map-balloon-description-t">{{ comment.SNAME }}</p>
    </div>
    <div class="mt-2">
      <span
        class="map-balloon-phone d-block"
        v-for="phone in data.SPHONE"
        :key="phone.SPHONEID"
      >
        <a :href="`tel:${phone.SPHONE}`"> {{ phone.SPHONE }} </a>&nbsp;&mdash;&nbsp;{{ phone.SPHONE_TEXT }}
      </span>
    </div>
    <button
      v-if="hasChooseButton"
      id="btn"
      :data-id="data.ID"
      type="button"
      class="btn-secondary my-4 btn-balloon"
      data-button-type="map-choose-button"
      @click.stop="handleChoose"
    >
      Выбрать
    </button>
    <div
      v-if="data.SBUTTONTEXT"
      class="btn-in-maps-balloon"
    >
      <button
        v-for="comment in showButton"
        @click="openLink(comment.SURL)"
        :key="comment.SNAME"
        class="btn-secondary mt-3 d-inline-block"
        :data-url="comment.SURL"
        data-button-type="map-url-button"
      >
        {{ comment.SNAME }}
      </button>
    </div>
  </div>
</template>

<script>
import Chip from "./common/Chip/Chip.vue";

const HIDDEN_FILTERS = ["Любимые клиники", "Без франшизы"];

export default {
  name: "CardFavourite",
  components: { Chip },
  props: {
    data: {
      type: Object,
      required: true,
    },
    hasShowOnMapButton: {
      type: Boolean,
      default: false,
    },
    selectedId: {
      type: Number,
      default: null,
    },
    hasChooseButton: {
      type: Boolean,
      default: false,
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    itemId: {
      type: Number,
      default: undefined,
    },
    hasCopyButton: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      activeTab: "list",
      tabs: [
        { id: "list", title: "Список" },
        { id: "map", title: "Карта" },
      ],
      searchString: "",
      isLoad: false,
    };
  },
  methods: {
    showCardInMap(val) {
      this.$store.commit("data_card/setActivePointInMap", val);
      this.$store.commit("data_card/setShowMap", true);
    },

    async favoriteButtonSendData() {
      const relationKey = this.getAddFields.RELATIONID;
      const card = this.data;

      await this.$store.dispatch("blocks/toggleFavoriteObject", {
        blockId: this.itemId,
        idCard: card.ID,
        relId: card.REL,
        relationValue: card[relationKey],
      });
    },

    handleClick() {
      if (this.selectable) {
        this.$emit("click", this.data.ID);
      }
    },

    handleChoose() {
      this.$emit("update", this.data.ID);
    },

    filterComments(comments) {
      return comments.filter((comment) => comment.SNAME);
    },

    openLink(link) {
      window.open(link);
    },

    async copyAddress(address) {
      try {
        await navigator.clipboard.writeText(address);
      } catch (e) {
        console.error("Failed to copy: ", e);
      }
    },
  },

  computed: {
    getAddFields() {
      return this.$store.getters["blocks/getAddFields"](this.itemId);
    },
    filters() {
      let parsedFilters = [];
      try {
        parsedFilters = JSON.parse(this.data.SFIL)?.filter((fil) => !HIDDEN_FILTERS.includes(fil));
      } catch (e) {
        console.error(e);
      }
      if (parsedFilters.length === 0) {
        return null;
      }
      return parsedFilters;
    },
    selected() {
      return this.selectedId === this.data.ID;
    },
    filterIcons() {
      let icons = [];
      try {
        icons = JSON.parse(this.getAddFields.FILTER_ICONS);
      } catch (err) {
        console.error(err);
      }
      return icons;
    },
    activeClass() {
      return this.selected ? "active" : "";
    },
    showButton() {
      return this.data?.SBUTTONTEXT.filter((button) => button.LSHOWBUTTON !== "N");
    },
  },
};
</script>

<style scoped>
.chip-pane {
  display: flex;
  gap: 8px;
  padding-bottom: 4px;
  overflow: auto;
}

.card-favorite.active {
  border: 1px solid var(--green);
}

.btn-heart {
  width: 40px;
  height: 40px;
  border-radius: 30px;
  border-style: none;
  background-color: #edf8ea;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  transition: 0.5s;
}

.btn-heart.active {
  opacity: 1;
  transition: 0.5s;
}

span[data-line],
span[class*="undeground-color"] {
  display: inline-block;
  width: 12px;
  height: 12px;
  position: relative;
}
span[data-line]:after,
span[class*="undeground-color"]:after {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 12px;
  content: "";
  top: 50%;
  margin-top: -6px;
  left: 0;
}

.undeground-color_36:after,
[data-line="Солнцевская линия"]:after {
  background-color: #ffcd1c;
}
.undeground-color_25:after,
[data-line="Люблинско-Дмитровская линия"]:after {
  background-color: #bed12c;
}

.undeground-color_37:after,
[data-line="Некрасовская линия"]:after {
  background-color: #cc0066;
}
.undeground-color_33:after,
[data-line="Кожуховская линия"]:after {
  background-color: #cc0066;
}

.undeground-color_26:after,
[data-line="Кольцевая линия"]:after {
  background-color: #915133;
}
.undeground-color_18:after,
[data-line="Калужско-Рижская линия"]:after {
  background-color: #ff7f00;
}
.undeground-color_24:after,
[data-line="Таганско-Краснопресненская линия"]:after {
  background-color: #92007b;
}
.undeground-color_43:after,
[data-line="МЦД-3"]:after {
  background-color: #ea5b04;
}
.undeground-color_44:after,
[data-line="МЦД-4"]:after {
  background-color: #00cc66;
}
.undeground-color_45:after,
[data-line="Троицкая линия"]:after {
  background-color: #03795f;
}
.undeground-color_42:after,
[data-line="МЦД-2"]:after {
  background-color: #ff009f;
}
.undeground-color_35:after,
[data-line="Большая кольцевая линия"]:after {
  background-color: #ffa8af;
}
.undeground-color_40:after,
[data-line="МЦК"]:after {
  background-color: #f9bcd1;
}
.undeground-color_41:after,
[data-line="МЦД-1"]:after {
  background-color: #ff6000;
}
.undeground-color_17:after,
[data-line="Серпуховско-Тимирязевская линия"]:after {
  background-color: #a2a5b4;
}
.undeground-color_13:after,
[data-line="Каховская линия"]:after {
  background-color: #29b1a6;
}
.undeground-color_21:after,
[data-line="Замоскворецкая линия"]:after {
  background-color: #0a6f20;
}
.undeground-color_10:after,
[data-line="Калининская линия"]:after {
  background-color: #ffdd03;
}
.undeground-color_9:after,
[data-line="Бутовская линия"]:after {
  background-color: #b2dae7;
}
.undeground-color_27:after,
[data-line="Сокольническая линия"]:after {
  background-color: #cc0000;
}
.undeground-color_15:after,
[data-line="Филевская линия"]:after {
  background-color: #0099cc;
}
.undeground-color_19:after,
[data-line="Арбатско-Покровская линия"]:after {
  background-color: #003399;
}
.undeground-color_11:after,
[data-line="Кировско-Выборгская линия"]:after {
  background-color: #cc0000;
}
.undeground-color_22:after,
[data-line="Невско-Василеостровская линия"]:after {
  background-color: #038f53;
}
.undeground-color_20:after,
[data-line="Фрунзенско-Приморская линия"]:after {
  background-color: #73057d;
}
.undeground-color_20:after,
[data-line="Фрунзенско-Приморская линия"]:after {
  background-color: #73057d;
}

.undeground-color_12:after,
[data-line="Правобережная линия"]:after {
  background-color: #ff7f00;
}

.undeground-color_16:after,
[data-line="Московско-Петроградская линия"]:after {
  background-color: #0099cc;
}
.undeground-color_28:after,
[data-line="Центральная линия"]:after {
  background-color: #ff0000;
}

.undeground-color_29:after,
[data-line="Автозаводская линия"]:after {
  background-color: #ff0000;
}
.undeground-color_30:after,
[data-line="Сормовская линия"]:after {
  background-color: #0000ff;
}

.undeground-color_31:after,
[data-line="Дзержинская линия"]:after {
  background-color: #008000;
}

.undeground-color_32:after,
[data-line="Ленинская линия"]:after {
  background-color: #c00000;
}

.undeground-color_38:after,
[data-line="Первая линия"]:after {
  background-color: #ffa8af;
}
.undeground-color_39:after {
  background-color: #007a3d;
}

.doc-adress,
.address-container .map-balloon-adress {
  font-size: 1rem;
  color: #868686;
  padding: 0;
  background: transparent;
}
.address-container {
  line-height: 1.2;
  padding-left: 32px;
  background: transparent url(/img/ic_Location_Solid.svg) left top -3px no-repeat;
}
.doc-adress {
  background: transparent url(/img/ic_Metro_Classic_Solid.svg) left top -5px no-repeat;
  padding-left: 32px;
  margin-top: 4px;
  line-height: 1.2;
}

.address-container button {
  border: 0;
  background-color: transparent;
  padding: 0;
  color: var(--lgreen);
  text-decoration: underline;
  font-size: 0.875rem;
  display: inline;
  text-underline-offset: 3px;
}
.doc-adress > span > span:last-child {
  margin-right: 8px;
}
.doc-adress > span > span + span {
  margin-left: 2px;
}
.doc-adress > span {
  margin-right: 8px;
}
p {
  margin: 0;
  padding: 0;
}
.map-balloon-phone,
.map-balloon-description-f {
  font-size: 0.875rem;
  color: #868686;
}
.map-balloon-description-t {
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.125rem;
}
.map-balloon-phone a {
  font-feature-settings: "tnum" on;
  text-decoration: underline dotted;
  text-underline-offset: 2px;
  color: var(--lgreen);
}
.agent-blocks {
  border-radius: 0 !important;
  border: 0 !important;
  position: relative;
  display: block !important;
}
.list-button .agent-blocks {
  padding: 20px 0;
}
.tab-vis-map .agent-blocks {
  padding: 0;
}

.control-select-object-from-map .list-button .agent-blocks {
  padding: 20px;
}
.agent-blocks:after {
  width: calc(100% - 40px);
  margin: 0 auto;
  content: "";
  height: 1px;
  background-color: #eff1f3;
  position: absolute;
  bottom: 0;
  left: 20px;
}

.agent-blocks.active {
  border: 0;
  background-color: #eff1f3 !important;
}
.btn-heart {
  background: url(/img/State-Active.svg) 50% 50% no-repeat;
}

.map-balloon-title {
  font-size: 1.125rem !important;
  font-weight: 700 !important;
  margin-bottom: 0 !important;
  order: 2;
  align-self: center;
  padding-right: 20px;
}
.list-button .map-balloon-title {
  align-self: baseline;
}

.btn-heart {
  order: 1;
}

.list-button .map-balloon-title {
  order: 1;
}
.list-button .btn-heart {
  order: 2;
}

.map-balloon-header {
  display: grid;
  grid-template-columns: 40px auto;
  margin-bottom: 8px;
  gap: 8px;
  align-items: start;
}
.list-button .map-balloon-header {
  grid-template-columns: auto 40px;
}
.address-container .copy-button {
  display: none;
}

@media (max-width: 992px) {
  .address-container {
    background: transparent url(/img/ic_Location_Solid.svg) left top -2px no-repeat;
  }

  .doc-adress,
  .address-container .map-balloon-adress {
    font-size: 0.875rem;
  }
  .tab-vis-map .agent-blocks {
    padding: 16px;
  }
  .address-container .copy-button {
    position: absolute;
    width: 24px;
    height: 24px;
    display: block;
    background: transparent url(/img/ic_Copy_Outline.svg) 50% 50% no-repeat;
    top: 0;
    right: 0;
  }
  .address-container {
    padding-right: 30px;
  }
  .map-balloon-title {
    font-size: 1rem !important;
    font-weight: 600 !important;
  }
  .map-balloon-description-t {
    font-size: 0.875rem;
  }
}
.agent-blocks {
  font-family: "SF Pro Display", Helvetica, Arial, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell,
    Noto Sans, sans-serif, sans-serif, "Apple Color Emoji";
}
.address-container {
  position: relative;
}
.btn-in-maps-balloon .btn-secondary {
  margin-right: 20px;
}
.btn-in-maps-balloon .btn-secondary:last-child {
  margin-right: 0px;
  margin-bottom: 0.5rem;
}
.tab-vis-map .agent-blocks + .agent-blocks {
  margin-top: 1.5rem;
}
</style>
