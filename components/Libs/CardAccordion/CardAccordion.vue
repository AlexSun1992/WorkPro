<template>
  <div>
    <div class="mb-1">
      <div
        style="border-color: #1eb869"
        class="block-border-one block p-1 mb-1 header"
      >
        <b-button class="btn" v-b-toggle.accordion-1 variant="primary"
          >Заголовок 1</b-button
        >
      </div>
      <b-collapse
        accordion="my-accordion"
        id="accordion-1"
        class="bg-six block-border-one block p-5"
        role="tabpanel"
      >
        Тело
      </b-collapse>
    </div>
    <div class="mb-1">
      <div
        style="border-color: #1eb869"
        class="block-border-one block p-1 mb-1 header"
      >
        <b-button class="btn" v-b-toggle.accordion-2 variant="primary"
          >Заголовок 2</b-button
        >
      </div>
      <b-collapse
        accordion="my-accordion"
        id="accordion-2"
        class="bg-six block-border-one block p-5"
        role="tabpanel"
      >
        Тело
      </b-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardAccordion",
};
</script>

<style scoped>
.header {
  background-color: #cbe0d7;
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
