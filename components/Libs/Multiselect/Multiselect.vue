<template>
  <div>
    <model-select
      :options="list"
      v-model="selectedItem"
      :placeholder="placeholder"
      ref="select"
    >
    </model-select>
  </div>
</template>

<script>
import { ModelSelect } from "vue-search-select";

export default {
  components: {
    ModelSelect,
  },
  props: {
    list: {
      type: Array,
      required: true,
    },
    placeholder: {
      type: String,
      required: false,
    },
  },

  //Обращение к списку List
  //this.$refs["select"].$options.propsData.options.length

  mounted() {
    if (this.$refs["select"]._uid === 39) {
      // this.$refs["select"].showMenu = true;
      console.log(this.$refs["select"].$options);
    }
  },

  data() {
    return {
      selectedItem: {
        value: "",
        text: "",
      },
    };
  },
  methods: {},
  watch: {
    selectedItem(val) {
      this.$emit("update", val);
    },
  },
};
</script>
