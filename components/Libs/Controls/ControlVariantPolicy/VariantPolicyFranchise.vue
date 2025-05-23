<template>
  <div :class="{ 'overflow-hidden': !isHaveListData, 'w-100': true }">
    <ControlDropdown
      v-if="isHaveListData"
      :options="optionsComputed"
      :visibleOptions="visibleOptions"
      :isStopPropagation="true"
      v-model="valueComputed"
      placeholder="Выберете..."
    />

    <div
      v-else-if="isTrueFalse"
      class="text-center"
      :class="optionsComputed"
    ></div>

    <div
      v-else
      :title="optionsComputed"
      class="text-center w-100 text-truncate"
    >
      {{ optionsComputed }}
    </div>
  </div>
</template>

<script>
import ControlDropdown from "../ControlDropdown/ControlDropdown.vue";

const defValues = {
  N: "attr_yes",
  Y: "attr_no",
  NULL: "",
};

export default {
  name: "VariantPolicyFranchise",
  components: { ControlDropdown },
  props: {
    value: {
      type: [String, Number],
      default: null,
    },
    defaultValue: {
      type: Number,
      default: null,
    },
    options: {
      type: Object,
      default: () => ({
        list: null,
        value: null,
      }),
    },
  },
  data() {
    return {};
  },
  computed: {
    optionsComputed() {
      const { list, value } = this.options;

      if (Array.isArray(list)) {
        const options = list.map((item) => ({
          value: item.id,
          text: this.toCurrency(item.sname),
        }));

        if(!options.find((item) => item.id === 0)) {
          options.push({ text: "Без франшизы", value: 0, invisible: true });
        }

        return options;
      }

      return value && Object.keys(defValues).includes(value)
        ? defValues[value]
        : value;
    },
    valueComputed: {
      get() {
        return this.value || this.defaultValue || this.firstVisibleValue;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    isTrueFalse() {
      return [ "Y", "N" ].includes(this.options.value);
    },
    firstVisibleValue() {
      const { list } = this.options;
      const visibleValue = list?.find((val) => !val.invisible);

      return visibleValue ? visibleValue.id : null;
    },
    visibleOptions() {
      return this.optionsComputed.length;
    },

    isHaveListData() {
      return Array.isArray(this.options.list);
    },
  },
  methods: {
    toCurrency(val = "") {
      const value = val.toString().trim();

      if (isNaN(value) || !isFinite(value)) {
        return val;
      }

      return `${new Intl.NumberFormat("ru-RU", { stale: "currency, " }).format(value)}\u00A0₽`;
    }
  }
};
</script>

<style lang="scss" scoped>
.attr_no {
  background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTEiIHZpZXdCb3g9IjAgMCAxNCAxMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMy42NzUyIDAuMzI0NzZDMTQuMTA4MyAwLjc1Nzc3MyAxNC4xMDgzIDEuNDU5ODMgMTMuNjc1MiAxLjg5Mjg0TDUuNTY2NDQgMTAuMDAxNkM1LjEzMzQzIDEwLjQzNDcgNC40MzEzNyAxMC40MzQ3IDMuOTk4MzYgMTAuMDAxNkwwLjMyNDc2IDYuMzI4MDRDLTAuMTA4MjUzIDUuODk1MDMgLTAuMTA4MjUzIDUuMTkyOTcgMC4zMjQ3NiA0Ljc1OTk2QzAuNzU3NzczIDQuMzI2OTUgMS40NTk4MyA0LjMyNjk1IDEuODkyODQgNC43NTk5Nkw0Ljc4MjQgNy42NDk1MkwxMi4xMDcyIDAuMzI0NzZDMTIuNTQwMiAtMC4xMDgyNTMgMTMuMjQyMiAtMC4xMDgyNTMgMTMuNjc1MiAwLjMyNDc2WiIgZmlsbD0iIzQzQjAyQSIvPgo8L3N2Zz4K")
    50% 50% no-repeat;
  min-width: 20px;
  min-height: 50px;
}

.attr_yes {
  background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIyIDEyQzIyIDE3LjUxNCAxNy41MTQgMjIgMTIgMjJDNi40ODYgMjIgMiAxNy41MTQgMiAxMkMyIDYuNDg2IDYuNDg2IDIgMTIgMkMxNy41MTQgMiAyMiA2LjQ4NiAyMiAxMlpNMjAgMTJDMjAgNy41ODkgMTYuNDExIDQgMTIgNEM3LjU4OSA0IDQgNy41ODkgNCAxMkM0IDE2LjQxMSA3LjU4OSAyMCAxMiAyMEMxNi40MTEgMjAgMjAgMTYuNDExIDIwIDEyWiIgZmlsbD0iI0VCNTc1NyIvPgo8cGF0aCBkPSJNMTUuNzA3MiA5LjcwNzMxTDEzLjQxNDIgMTIuMDAwM0wxNS43MDcyIDE0LjI5MzNDMTYuMDk4MiAxNC42ODQyIDE2LjA5ODIgMTUuMzE2MyAxNS43MDcyIDE1LjcwNzNDMTUuNTEyMiAxNS45MDIzIDE1LjI1NjIgMTYuMDAwMyAxNS4wMDAyIDE2LjAwMDNDMTQuNzQ0MiAxNi4wMDAzIDE0LjQ4ODIgMTUuOTAyMyAxNC4yOTMzIDE1LjcwNzNMMTIuMDAwMiAxMy40MTQyTDkuNzA3MTkgMTUuNzA3M0M5LjUxMjE5IDE1LjkwMjMgOS4yNTYyMiAxNi4wMDAzIDkuMDAwMjIgMTYuMDAwM0M4Ljc0NDIyIDE2LjAwMDMgOC40ODgyNSAxNS45MDIzIDguMjkzMjUgMTUuNzA3M0M3LjkwMjI1IDE1LjMxNjMgNy45MDIyNSAxNC42ODQyIDguMjkzMjUgMTQuMjkzM0wxMC41ODYyIDEyLjAwMDNMOC4yOTMyNSA5LjcwNzMxQzcuOTAyMjUgOS4zMTYzMSA3LjkwMjI1IDguNjg0MjUgOC4yOTMyNSA4LjI5MzI1QzguNjg0MjUgNy45MDIyNSA5LjMxNjE5IDcuOTAyMjUgOS43MDcxOSA4LjI5MzI1TDEyLjAwMDIgMTAuNTg2M0wxNC4yOTMzIDguMjkzMjVDMTQuNjg0MiA3LjkwMjI1IDE1LjMxNjIgNy45MDIyNSAxNS43MDcyIDguMjkzMjVDMTYuMDk4MiA4LjY4NDI1IDE2LjA5ODIgOS4zMTYzMSAxNS43MDcyIDkuNzA3MzFaIiBmaWxsPSIjRUI1NzU3Ii8+Cjwvc3ZnPgo=")
    50% 50% no-repeat;
  min-width: 20px;
  min-height: 50px;
}
</style>
