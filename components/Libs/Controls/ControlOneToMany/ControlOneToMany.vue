<template>
  <div>
    <div
      data-v-15c7079a=""
      class="title-conf-block"
    >
      {{ data.label }}
    </div>
    <div
      :id="data.fieldId"
      v-for="(item, i) in data.value"
      :key="i + 'block'"
      class="otm-block"
    >
      <div
        :key="i + 'title'"
        class="inner-title-otm-block"
      >
        {{ data.helpText || "Элемент" }} {{ i + 1 }}
        <button
          @click="deleteItem(i)"
          :disabled="!editable"
          class="btn-otm-del"
        >
          Удалить
        </button>
      </div>
      <form-block
        class="mt-2"
        :key="i"
        :data="item"
        :oneToManyData="{ index: i, fieldId: data.fieldId }"
        :edit="editable"
        @update="updateItem($event, i)"
      />
    </div>
    <button
      @click="addItem"
      :disabled="!editable"
      :class="getClass"
    >
      {{ getLabel }}
    </button>
  </div>
</template>

<script>
export default {
  name: "ControlOneToMany",
  components: { formBlock: () => import("@/components/Libs/Form/Form") },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
    edit: {
      type: Boolean,
      required: true,
      default: () => false,
    },
  },
  methods: {
    addItem() {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        value: this.data.schema,
        action: "add",
      });
    },
    updateItem(value, index) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        value: { name: this.data.name, index, value },
        action: "update",
      });
    },
    deleteItem(index) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        value: { name: this.data.name, index },
        action: "delete",
      });
    },
  },
  computed: {
    loading() {
      return this.$store.getters["data_card/getLoading"];
    },
    editable() {
      return this.data.readonly === false;
    },
    getClass() {
      const controlName = this.data.schema.find((item) => item.name === "Add");
      if (controlName && controlName.cssClass) {
        return controlName.cssClass;
      }
      return "btn btn-secondary btn-add mt-4";
    },
    getLabel() {
      const controlName = this.data.schema.find((item) => item.name === "Add");

      if (controlName) {
        return controlName.label;
      }
      return "Добавить застрахованного";
    },
  },
};
</script>

<style scoped>
.otm-block {
  background: #ffffff;
  border: 1px solid #c3c3c3;
  border-radius: 16px;
  padding: 20px;
}
.inner-title-otm-block {
  font-family: "Raleway";
  font-style: normal;
  font-weight: 700;
  font-size: 1.25rem;
  font-feature-settings: "pnum" on, "lnum" on;
  position: relative;
  padding-right: 35px;
}
.btn-otm-del {
  width: 24px;
  height: 24px;
  position: absolute;
  background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTguMDc0MjIgMy44ODU5N0g3Ljg2NzU5QzcuOTgxMjQgMy44ODU5NyA4LjA3NDIyIDMuNzk2OTIgOC4wNzQyMiAzLjY4ODA3VjMuODg1OTdIMTUuOTI2MVYzLjY4ODA3QzE1LjkyNjEgMy43OTY5MiAxNi4wMTkgMy44ODU5NyAxNi4xMzI3IDMuODg1OTdIMTUuOTI2MVY1LjY2NzA5SDE3Ljc4NTdWMy42ODgwN0MxNy43ODU3IDIuODE0ODMgMTcuMDQ0NCAyLjEwNDg2IDE2LjEzMjcgMi4xMDQ4Nkg3Ljg2NzU5QzYuOTU1ODUgMi4xMDQ4NiA2LjIxNDU4IDIuODE0ODMgNi4yMTQ1OCAzLjY4ODA3VjUuNjY3MDlIOC4wNzQyMlYzLjg4NTk3Wk0yMS4wOTE3IDUuNjY3MDlIMi45MDg1NEMyLjQ1MTM4IDUuNjY3MDkgMi4wODIwMyA2LjAyMDg0IDIuMDgyMDMgNi40NTg2OVY3LjI1MDNDMi4wODIwMyA3LjM1OTE1IDIuMTc1MDEgNy40NDgyIDIuMjg4NjYgNy40NDgySDMuODQ4NjlMNC40ODY2NiAyMC4zODZDNC41Mjc5OCAyMS4yMjk2IDUuMjU2MzQgMjEuODk1IDYuMTM3MDkgMjEuODk1SDE3Ljg2MzJDMTguNzQ2NSAyMS44OTUgMTkuNDcyMyAyMS4yMzIxIDE5LjUxMzYgMjAuMzg2TDIwLjE1MTYgNy40NDgySDIxLjcxMTZDMjEuODI1MyA3LjQ0ODIgMjEuOTE4MiA3LjM1OTE1IDIxLjkxODIgNy4yNTAzVjYuNDU4NjlDMjEuOTE4MiA2LjAyMDg0IDIxLjU0ODkgNS42NjcwOSAyMS4wOTE3IDUuNjY3MDlaTTE3LjY2NDMgMjAuMTEzOUg2LjMzNTk3TDUuNzEwOTIgNy40NDgySDE4LjI4OTRMMTcuNjY0MyAyMC4xMTM5WiIgZmlsbD0iIzQzQjAyQSIvPgo8L3N2Zz4K")
    50% 50% no-repeat;
  top: 3px;
  right: 0;
  font-size: 0;
  border: 0;
}
.btn-secondary.btn-add {
  padding-left: 70px;
  padding-right: 40px;
  background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwLjQ1ODMgMi4wNTU2NEMxMC40NTgzIDEuMjg4NTcgOS44MDU0MiAwLjY2Njc0OCA5IDAuNjY2NzQ4QzguMTk0NTggMC42NjY3NDggNy41NDE2NyAxLjI4ODU3IDcuNTQxNjcgMi4wNTU2NFY3LjYxMTE5SDEuNzA4MzNDMC45MDI5MTcgNy42MTExOSAwLjI1IDguMjMzMDIgMC4yNSA5LjAwMDA4QzAuMjUgOS43NjcxNCAwLjkwMjkxNyAxMC4zODkgMS43MDgzMyAxMC4zODlINy41NDE2N1YxNS45NDQ1QzcuNTQxNjcgMTYuNzExNiA4LjE5NDU4IDE3LjMzMzQgOSAxNy4zMzM0QzkuODA1NDIgMTcuMzMzNCAxMC40NTgzIDE2LjcxMTYgMTAuNDU4MyAxNS45NDQ1VjEwLjM4OUgxNi4yOTE3QzE3LjA5NzEgMTAuMzg5IDE3Ljc1IDkuNzY3MTQgMTcuNzUgOS4wMDAwOEMxNy43NSA4LjIzMzAyIDE3LjA5NzEgNy42MTExOSAxNi4yOTE3IDcuNjExMTlIMTAuNDU4M1YyLjA1NTY0WiIgZmlsbD0iI0ZFNzMzMyIvPgo8L3N2Zz4K")
    40px 50% no-repeat;
}
.otm-block + .otm-block {
  margin-top: 20px;
}
.btn-link.btn-add::first-letter {
  font-size: 20px;
}

@media (max-width: 992px) {
  .inner-title-otm-block {
    font-weight: 600;
    font-size: 1rem;
  }
  .icon-add {
    background-size: 13px;
  }
  .otm-block + .otm-block {
    margin-top: 10px;
  }
  .btn-secondary.btn-add {
    padding-left: 54px;
    padding-right: 24px;
    background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwLjQ1ODMgMi4wNTU2NEMxMC40NTgzIDEuMjg4NTcgOS44MDU0MiAwLjY2Njc0OCA5IDAuNjY2NzQ4QzguMTk0NTggMC42NjY3NDggNy41NDE2NyAxLjI4ODU3IDcuNTQxNjcgMi4wNTU2NFY3LjYxMTE5SDEuNzA4MzNDMC45MDI5MTcgNy42MTExOSAwLjI1IDguMjMzMDIgMC4yNSA5LjAwMDA4QzAuMjUgOS43NjcxNCAwLjkwMjkxNyAxMC4zODkgMS43MDgzMyAxMC4zODlINy41NDE2N1YxNS45NDQ1QzcuNTQxNjcgMTYuNzExNiA4LjE5NDU4IDE3LjMzMzQgOSAxNy4zMzM0QzkuODA1NDIgMTcuMzMzNCAxMC40NTgzIDE2LjcxMTYgMTAuNDU4MyAxNS45NDQ1VjEwLjM4OUgxNi4yOTE3QzE3LjA5NzEgMTAuMzg5IDE3Ljc1IDkuNzY3MTQgMTcuNzUgOS4wMDAwOEMxNy43NSA4LjIzMzAyIDE3LjA5NzEgNy42MTExOSAxNi4yOTE3IDcuNjExMTlIMTAuNDU4M1YyLjA1NTY0WiIgZmlsbD0iI0ZFNzMzMyIvPgo8L3N2Zz4K")
      24px 50% no-repeat;
  }
}
</style>
