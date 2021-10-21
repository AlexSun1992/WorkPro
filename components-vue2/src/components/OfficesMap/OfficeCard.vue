<template>
  <b-card :title="office.SSHORTNAME" class="mb-2">
    <b-card-text>
      <div class="distance" v-if="office.NDISTANSE">
        <h4>{{ office.NDISTANSE.toFixed(1) + " км" }}</h4>
      </div>
      <div v-if="office.SADDRESS">
        <strong>Адрес: </strong>{{ office.SADDRESS }}
      </div>
      <div v-if="office.SPHONE">
        <strong>Телефон:</strong> {{ office.SPHONE }}
      </div>
      <div v-if="office.SEMAIL">
        <strong>Email:</strong> {{ office.SEMAIL }}
      </div>
      <div v-if="office.SGRAF">
        <strong>Режим работы: </strong>{{ office.SGRAF }}
      </div>
      <div v-if="office.IDUNDERGROUND.length">
        <span><strong>Ближайшее метро: </strong></span>
        <span v-for="(item, index) in office.IDUNDERGROUND" :key="index">
          {{ item.SNAME }}
        </span>
      </div>
      <a href="#">Схема проезда</a>
    </b-card-text>
  </b-card>
</template>

<script>
import { BCard, BButton, BCardText } from "bootstrap-vue";
export default {
  name: "OfficeCard",
  components: {
    BCard,
    BButton,
    BCardText,
  },
  props: ["office"],
};
</script>

<style scoped>
.distance {
  display: flex;
  justify-content: end;
}
</style>
