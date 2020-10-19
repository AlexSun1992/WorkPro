<template>
  <div class="wrapper">
    <div class="col-auto pl-0">
      <b-dropdown class="m-md-2 dpd-link">
        <template v-slot:button-content>
          <span v-text="text"></span>
        </template>
        <b-dropdown-item
          v-for="item in options.items"
          :key="options.items.text"
          @click="changeSelected(item)"
          >{{ item.text }}</b-dropdown-item
        >
      </b-dropdown>
    </div>
    <div class="col-auto">
      <b-button
        type="button"
        :to="value"
        class="btn-large btn-arrow-right position-relative uppercase d-block"
        >{{ options.buttonName }}
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SelectValue",
  props: {
    options: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      selected: { ...this.options.selected },
    };
  },
  methods: {
    changeSelected(data) {
      this.selected = data;
    },
  },
  computed: {
    text() {
      return this.selected.text;
    },
    value() {
      return this.selected.value;
    },
  },
};
</script>

<style scoped>
.wrapper {
  display: contents;
}
</style>
