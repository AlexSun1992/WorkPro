<template>
  <div class="autocomplete">
    <b-form-input
      class="form-control"
      autocomplete="off"
      type="search"
      v-model="data.value"
      v-mask="data.mask"
      :disabled="!edit ? !edit : data.readonly"
      :required="data.required"
      :state="data.state"
      :placeholder="showPlaceholder(data.name)"
      @keydown.enter="enter"
      @keydown.tab="enter"
      @keydown.down="down"
      @keydown.up="up"
      @input="getSuggestions(data.name)"
      @blur="debouncedClose()"
      :id="data.name"
      @change="debouncedChange()"
    ></b-form-input>
    <b-form-invalid-feedback
      >Обязательно для заполнения</b-form-invalid-feedback
    >
    <p class="error">{{ data.error }}</p>
    <ul
      v-if="open && suggestions && suggestions.data && suggestions.data.length"
      :class="{ 'dropdown-menu': open }"
    >
      <li
        v-for="(suggestion, i) in suggestions.data"
        :key="i"
        :class="{ active: isActive(i) }"
        @click="suggestionClick(i)"
      >
        <span>{{ suggestion }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import _ from "lodash";
import { applyMask as _mask } from "~/utils/utils";
export default {
  directives: {
    mask: _mask
  },
  data() {
    return {
      open: false,
      current: 0,
      suggestions: {},
      debouncedClose: null,
      debouncedChange: null
    };
  },
  props: ["data", "edit"],
  created() {
    this.debouncedClose = _.debounce(this.closeList, 300);
    this.debouncedChange = _.debounce(this.changeValue, 300);
  },
  methods: {
    changeValue() {
      let value;
      const fields = this.$store.getters["data_card/getForm"];
      let relatedValue;
      const type = this.suggestions.type;
      if (
        this.suggestions.type === "SISSUED_WHERE" ||
        this.suggestions.type === "SDOCDEP"
      ) {
        const { fieldId } = this.$store.getters["data_card/getDataFieldByName"](
          type === "SISSUED_WHERE" ? "SDOCDEP" : "SISSUED_WHERE"
        );
        value = this.suggestions.data[this.index].split(" - ")[0];
        relatedValue = this.suggestions.data[this.index].split(" - ")[1];
        this.$emit("update", { fieldId: this.data.fieldId, value });
        this.$emit("update", { fieldId, value: relatedValue });
        this.$store.commit("data_card/filterFields");
      } else {
        if (this.suggestions.data && this.suggestions.data.length) {
          if (this.index >= 0) {
            value = this.suggestions.data[this.index];
          } else {
            value = this.data.value
          }
          this.$emit("update", { fieldId: this.data.fieldId, value });
        }
      }
      this.$forceUpdate();
    },
    closeList() {
      this.open = false;
    },
    enter() {
      this.open = false;
      this.suggestionClick(this.current);
    },
    up() {
      if (this.current > 0) {
        this.current--;
      }
    },
    down() {
      if (this.current < this.suggestions.data.length - 1) {
        this.current++;
      }
    },
    isActive(index) {
      return index === this.current;
    },
    suggestionClick(index) {
      this.index = index;
      this.open = false;
    },
    async getSuggestions(name) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        value: this.data.value,
      });
      const API_KEY = "7a6080c3383b4dc69e786e1cd5c88366ab58a14c";
      this.open = true;
      this.current = -1;
      let suggestionType;
      const params = {
        query: this.data.value,
        suggestionType,
        key: API_KEY,
      };
      if (
        name === "SFIRSTNAME" ||
        name === "SSECONDNAME" ||
        name === "STHIRDNAME"
      ) {
        params.suggestionType = "fio";
        if (name === "SFIRSTNAME") {
          params.parts = ["NAME"];
        } else if (name === "SSECONDNAME") {
          params.parts = ["SURNAME"];
        } else if (name === "STHIRDNAME") {
          params.parts = ["PATRONYMIC"];
        }
        const result = await this.$store.dispatch(
          "card/fetchSuggestions",
          params
        );
        this.$set(
          this.suggestions,
          "data",
          result.map((item) => item.value)
        );
      } else if (name.includes("ADDRESS")) {
        params.suggestionType = "address";
        const result = await this.$store.dispatch(
          "card/fetchSuggestions",
          params
        );
        this.$set(
          this.suggestions,
          "data",
          result.map((item) => item.value)
        );
      } else if (name === "SISSUED_WHERE" || name === "SDOCDEP") {
        params.suggestionType = "fms_unit";
        const suggestions = {};
        suggestions.data = await this.$store.dispatch(
          "card/fetchSuggestions",
          params
        );
        const obj = {};
        let values;
        if (name === "SISSUED_WHERE") {
          values = suggestions.data.map((item) => {
            return `${item.data.name} - ${item.data.code}`;
          });
          obj.type = "SISSUED_WHERE";
        }
        if (name === "SDOCDEP") {
          values = suggestions.data.map((item) => {
            return `${item.data.code} - ${item.data.name}`;
          });
          obj.type = "SDOCDEP";
        }
        obj.values = values;
        this.$set(this.suggestions, "data", obj.values);
        this.$set(this.suggestions, "type", obj.type);
      }
    },
    showPlaceholder(name) {
      if (name === "SNEWPHONE") {
        return "Введите 10 цифр Вашего телефона";
      } else if (name === "SCODEFIELD") {
        return "Введите код";
      } else if (name === "SNEWEMAIL") {
        return "Введите новый email";
      }
    }
  }
};
</script>

<style scoped>
.autocomplete {
  position: relative;
}
.dropdown-menu {
  display: block;
  width: 100%;
}
.active {
  background-color: lightgrey;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.error {
  margin-top: 0.25rem;
  font-size: 80%;
  color: #f86c6b;
}
</style>
