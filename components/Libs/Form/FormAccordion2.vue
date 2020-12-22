<template>
  <div>
    <div v-for="(tab, index) in captions" :key="index" class="mb-1">
      <div
        style="border-color: #1eb869"
        class="block-border-one block p-1 mb-1 header"
      >
        <b-button class="btn" v-b-toggle="'acc_' + index" variant="primary">{{
          tab.label
        }}</b-button>
      </div>
      <b-collapse
        :visible="tab.toggle"
        accordion="my-accordion"
        :id="'acc_' + index"
        class="bg-six block-border-one block p-3"
        role="tabpanel"
      >
      </b-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: "FormAccordion2",
  props: {
    data: {
      type: Array | null,
      required: true,
    },
    captions: {
      type: Array,
      required: false,
    },
  },
};
</script>

<style scoped>
.header {
  background-color: #cbe0d7;
  cursor: pointer;
  text-align: center;
}
.error {
  background-color: #f5c6cb;
  cursor: pointer;
  text-align: center;
}
.btn {
  border: 0;
  cursor: pointer;
  padding: 0;
  width: 99%;
  background-color: #cbe0d7;
}
</style>
