<template>
  <div>
    <button id="show-btn" @click="$bvModal.show('bv-modal-example')">
      Open Modal
    </button>

    <b-modal id="bv-modal-example" hide-footer>
      <template #modal-title> Выберите ваш город</template>
      <div class="d-block text-center">
        <p class="my-4">
          Воспользуйтесь поиском если не нашли ваш регион в списке:
        </p>
        <b-form-group>
          <template>
            <span> </span>
          </template>
          <autocomplete> </autocomplete>
          <b-form-invalid-feedback>
            {{ errorText }}
          </b-form-invalid-feedback>
        </b-form-group>
      </div>
      <button block @click="$bvModal.hide('bv-modal-example')">Close Me</button>
    </b-modal>
  </div>
</template>

<script>
import Autocomplete from "@trevoreyre/autocomplete-vue";
import "@trevoreyre/autocomplete-vue/dist/style.css";
export default {
  name: CityesListModal,
  components: { Autocomplete },
};
</script>

<style lang="scss" scoped></style>
