<template>
  <b-form-group :label="data.label">
    <div>
      <b-form-input
        @click="open()"
        placeholder="Нажмите для выбора клиники"
        v-model="selectedValue"
        :readonly="true"
        :disabled="data.edit"
        :state="inputState"
      />
      <b-form-invalid-feedback v-if="data.error || isErr">
        {{ data.error ? data.error : validationErrorText }}
      </b-form-invalid-feedback>

      <div>
        <dialog
          ref="modal"
          class="control-select-object-from-map"
          @close="handleClose"
        >
          <button
            @click="close()"
            class="close_clinic"
          >
            Клиника
          </button>
          <MapList
            ref="modalContent"
            :itemId="this.data.menudic"
            v-if="showModal"
            :key="counter"
            class="map-list"
            @update="handleUpdate"
          ></MapList>
        </dialog>
      </div>
    </div>
  </b-form-group>
</template>

<script>
import { isEqual } from "lodash";
import MapList from "./MapList.vue";

export default {
  name: "ControlSelectObjectFromMap",
  components: {
    MapList,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      counter: 0,
      selected: null,
      validationErrorText: "Укажите клинику",
      isErr: false,
      showModal: false,
    };
  },

  computed: {
    selectedValue() {
      if (this.selected && Object.keys(this.data.value).length === 0) {
        this.selected = this.data.value;
        return;
      }
      return this.selected?.SNAME;
    },
    inputState() {
      if (this.selectedValue) {
        return true;
      }
      if (this.isErr || this.data.state === false) {
        return false;
      }
      return undefined;
    },
    fieldsRelations() {
      if (this.data.fieldRelation) {
        return this.$store.getters["data_card/getDataFieldsByNames"](this.data.fieldRelation.split(";"));
      }
      return [];
    },
  },
  watch: {
    fieldsRelations(value) {
      const isRelationValueUpdated = value?.find((item) => {
        const valueHistory = this.$store.getters["data_card/getFormValueHistoryByField"](item.name);

        if (valueHistory?.[1]) {
          return !isEqual(valueHistory[1], item.value);
        }

        return false;
      });

      if (isRelationValueUpdated) {
        this.selected = this.data.value;
        this.fetchData();
      }
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    open() {
      this.$refs?.modal.showModal();
      this.showModal = true;
    },
    async fetchData() {
      try {
        await this.$store.dispatch("blocks/fetchBlock", {
          id: this.data.menudic,
          query: this.$store.getters["data_card/getFilters"],
          ...this.$route.params,
        });
      } catch (err) {
        console.error(err);
      }
    },
    handleClose() {
      this.showModal = false;
      this.counter++;
      this.isErr = !Boolean(this.selected);
    },
    close() {
      this.$refs?.modal.close();
      this.handleClose();
    },
    handleUpdate(card) {
      if (!card) {
        this.$emit("update", this.selected);
        return;
      }
      this.selected = card;
      this.close();
      try {
        const json = JSON.stringify(card);
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: json,
        });
      } catch (err) {
        console.error(err);
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
