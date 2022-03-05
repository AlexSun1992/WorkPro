<template>
  <b-form-group
    :label="data.label"
    :class="{ required: data.required }"
    :label-for="data.name"
  >
    <template v-slot:label
      ><span v-html="data.label"></span
      ><span v-if="data.helpText">
        (?)<vue-easy-tooltip with-arrow="true" position="top" offset="4">
          <span v-html="data.helpText"></span></vue-easy-tooltip></span
    ></template>

    <model-select
      v-model="fieldValue"
      :is-disabled="!edit || data.readonly"
      :class="validClass"
      :options="data.options"
      :placeholder="data.placeholder"
      ref="sign"
    >
    </model-select>
    {{ isDirty }}
    <b-form-invalid-feedback :state="data.state"
      >{{ data.error ? data.error : "Обязательно для заполнения" }}
    </b-form-invalid-feedback>
  </b-form-group>
</template>

<script>
import { ModelSelect } from "vue-search-select";

export default {
  name: "ControlCustomCombobox",
  components: {
    ModelSelect,
  },

  data() {
    return {
      isRefsExist: false,
      test: false,
      flag: 1,
      hub: [],
    };
  },

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

  mounted() {
    if (this.$refs["sign"].showMenu !== null) {
      this.isRefsExist = true;
    }
  },

  methods: {
    async eventHandlerBlur(target) {
      await this.$store.dispatch("data_card/fetchDic", this.data);
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: target,
      });
    },
  },
  computed: {
    isDirty() {
      if (this.isRefsExist === true) {
        if (this.$refs["sign"].showMenu === this.test) {
          this.hub.push(this.flag);
        }
        if (this.$refs["sign"].showMenu === false && this.hub.length > 1) {
          // this.fieldValue === undefined
          //   ? this.eventHandlerBlur(null)
          //   : this.eventHandlerBlur(this.fieldValue);
          return this.$refs["sign"].showMenu;
        }
      }
    },

    fieldValue: {
      get: function () {
        console.log("!!!");
        console.log(this.data.value);
        return this.data.value;
      },
      set: function (value) {
        // console.log(value);
        // if (this.isRefsExist === true) {
        //   if (this.$refs["sign"].showMenu === this.test) {
        //     this.hub.push(this.flag);
        //   }
        //   if (this.$refs["sign"].showMenu === false && this.hub.length > 1) {
        //     this.fieldValue === undefined
        //       ? this.eventHandlerBlur(null)
        //       : this.eventHandlerBlur(value);
        //   }
        // }
        // this.$emit("update", {
        //   fieldId: this.data.fieldId,
        //   name: this.data.name,
        //   value,
        // });
        // this.fieldValue === undefined
        //   ? this.eventHandlerBlur(null)
        //   : this.eventHandlerBlur(value);
        if (this.isRefsExist === true) {
          if (this.$refs["sign"].showMenu === this.test) {
            this.hub.push(this.flag);
          }
        }
      },
    },
    validClass() {
      if (this.data.state !== null && this.data.state !== undefined) {
        return this.data.state === true ? "is-valid" : "is-invalid";
      } else {
        return "";
      }
    },
  },
};
</script>
