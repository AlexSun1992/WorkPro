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
    <!-- {{ isDirty }} -->
    <model-select
      v-model="fieldValue"
      :is-disabled="!edit || data.readonly"
      :class="validClass"
      :options="data.options"
      :placeholder="data.placeholder"
      ref="sign"
    >
    </model-select>

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
      point: null,
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
  // updated() {
  // if (this.$refs["sign"].showMenu === false && this.hub.length > 1) {
  //   this.fieldValue === undefined
  //     ? this.eventHandlerBlur(null)
  //     : this.eventHandlerBlur(this.fieldValue);
  //   this.hub = [];
  // }
  // if (this.isDirty === false && this.point === null) {
  //   console.log("updated");
  // this.fieldValue === undefined
  //   ? this.eventHandlerBlur(null)
  //   : this.eventHandlerBlur(this.fieldValue);
  // console.log("field:", this.data.fieldId);
  // console.log("name:", this.data.name);
  // console.log("value:", this.point);
  // }
  // if (this.isDirty === false && this.point === null) {
  //   console.log("Необходима валидация");
  //   // console.log("field:", this.data.fieldId);
  //   // console.log("name:", this.data.name);
  //   // console.log("value:", this.point);
  //   this.$emit("update", {
  //     fieldId: this.data.fieldId,
  //     name: this.data.name,
  //     value: this.point,
  //   });
  //   this.point = "";
  // }
  // },

  methods: {
    async eventHandlerBlur(target) {
      //await this.$store.dispatch("data_card/fetchDic", this.data);
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: target,
      });
    },
  },
  computed: {
    // isDirty() {
    //   if (this.isRefsExist === true) {
    //     if (this.$refs["sign"].showMenu === this.test) {
    //       this.hub.push(this.flag);
    //     }
    //     if (
    //       this.$refs["sign"].showMenu === false &&
    //       this.hub.length > 1 &&
    //       this.point === null
    //     ) {
    //       return this.$refs["sign"].showMenu;
    //     }
    //   }
    // },

    fieldValue: {
      get: function () {
        return this.data.value;
      },
      set: function (value) {
        this.point = value;
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value,
        });
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
