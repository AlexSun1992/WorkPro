<template>
  <div>
    <input
      @click="open"
      :placeholder="placeholder"
      v-model="selectedValue"
      :readonly="true"
      :disabled="editable"
    />

    <div>
      <dialog
        ref="modal"
        :class="modalClass"
        @close="close"
      >
        <button
          @click="modalClose"
          class="close_clinic"
        >
          {{ goBackCaption }}
        </button>
        <template v-if="isModalOpen">
          <MapList
            :itemId="itemId"
            :key="counter"
            class="map-list"
            @update="handleClose"
          ></MapList>
        </template>
      </dialog>
    </div>
  </div>
</template>

<script>
import { isEqual } from "lodash";
import MapList from "./MapList.vue";

export default {
  name: "SelectObjectFromMap",
  components: {
    MapList,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    edit: {
      type: Boolean,
      default: true,
    },
    oneToManyData: {
      type: Object,
      default: () => ({}),
    },
    getOptions: {
      type: Function,
      default: () => {},
    },
    currentValue: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      counter: 0,
      isErr: false,
      isModalOpen: false,
      selected: null,
    };
  },

  computed: {
    options() {
      return (
        this.$store.getters["data_card/getDataFieldByFieldId"](
          this.itemId,
          this.oneToManyData?.fieldId,
          this.oneToManyData?.index
        )?.options ?? []
      );
    },
    addFields() {
      return this.$store.getters["data_card/getAddFields"];
    },
    itemId() {
      return this.data.fieldId;
    },
    placeholder() {
      return this.data.placeholder ?? "Выберите из списка";
    },
    goBackCaption() {
      return this.addFields?.CLOSE_CAPTION ?? "Назад";
    },
    fieldName() {
      return this.data.name;
    },
    editable() {
      return !this.edit || this.data.readonly;
    },

    modalClass() {
      return `control-select-object-from-map ${this.isModalOpen ? "modal-open" : "modal-closed"}`;
    },
    // TODO: find fieldName duplication
    selectedValue() {
      return this.currentValue?.[this.fieldName] ? this.currentValue?.[this.fieldName].SNAME : this.currentValue?.SNAME;
    },
  },

  watch: {
    options(opts, oldOpts) {
      if (!opts || isEqual(opts, oldOpts)) return;
      const block = this.$store.getters["blocks/getUnfilteredBlockById"](this.itemId);
      const action = block ? "blocks/updateBlock" : "blocks/addBlock";
      this.$store.commit(action, {
        blockId: this.itemId,
        data: { items: opts, addFields: this.addFields },
      });
    },

    // this.selected cleanup
    currentValue(newData, oldData) {
      // value is reset through relationFields
      if (newData === null && oldData) {
        this.selected = null;
      }
    },
  },

  methods: {
    open() {
      this.isModalOpen = true;
      if (!this.options.length) {
        this.getOptions();
      }
      this.$refs?.modal.showModal();
    },

    modalClose() {
      this.handleClose(null);
    },

    handleClose(card) {
      if (card) {
        this.selected = card;
      }

      this.$refs.modal.close();
    },

    close() {
      this.isModalOpen = false;
      this.counter++;
      let value;
      if (this.selected) {
        value = { [this.data.name]: { ID: this.selected.ID, SNAME: this.selected.SNAME } };
        this.$emit("blur", {
          [this.fieldName]: value,
        });
      } else {
        value = null;
        this.$emit("blur", null);
      }
    },
  },
};
</script>

<style scoped>
.control-select-object-from-map {
  width: 1000px;
  z-index: 20;
  height: 700px;
  overflow: hidden;
}

.close_clinic {
  border: 0;
  position: absolute;
  background: transparent url(/img/icon-titlte-back.svg) left 22px center no-repeat;
  padding-left: 66px;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 2.375rem;
  top: 24px;
  left: 20px;
  z-index: 2;
  color: var(--black);
}

dialog {
  border-radius: 30px;
  background-color: #fff;
  padding: 24px 0px;
  border: 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18) !important;
}

@media (max-width: 992px) {
  .control-select-object-from-map {
    padding: 0px;
    border: 0;
    margin: 0;
    box-shadow: none;
    border-radius: 30px 30px 0 0;
    width: 100vw;
    max-width: 100vw;
    z-index: 20;
    height: auto;
    max-height: 100vh;
    overflow: hidden;
  }

  .close_clinic {
    background: transparent url(/img/icon-titlte-back.svg) left 0px center no-repeat;
    padding-left: 32px;
    font-size: 1.125rem;
    font-weight: 700;
    line-height: 1.875rem;
    top: 33px;
  }

  .control-select-object-from-map::after {
    content: "";
    width: 69px;
    height: 5px;
    border-radius: 5px;
    background-color: #c3c3c3;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
  }
}
</style>
