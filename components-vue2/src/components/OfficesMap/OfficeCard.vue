<template>
  <b-card :title="office.SSHORTNAME" class="mb-2">
    <b-card-text>
    <div class="card-office-adress row">
      <div class="col-4">
        <img src="">
      </div>
      <div class="col-8">
        <div>{{ office.SADDRESS }}</div>
        <div class="card-office-opened">открыт до</div>
      </div>
      <div class="col-12">
            <button type="button" class="show-maps-balloon">Показать на карте</button>
      </div>
    </div>
    <div v-if="office.IDUNDERGROUND.length" class="card-office-undeground">
        <span class="undeground-color"></span><span v-for="(item, index) in office.IDUNDERGROUND" :key="index">
          {{ item.SNAME }}</span>
        <span v-if="office.NDISTANSE" class="card-office-distance">
          {{ office.NDISTANSE.toFixed(1) + " км" }}
        </span>
      </div>
    </div>
    <div v-if="office.SGRAF" class="card-office-time">
        <button type="button">Режим работы:</button>
        <div class="card-office-times">{{ office.SGRAF }}</div>
    </div>
    <div v-if="office.SGRAF" class="card-office-contacts">
      <div v-if="office.SPHONE" class="card-office-phone">
        <a v-bind:href="'tel:'+office.SPHONE">{{ office.SPHONE }}</a>
      </div>
      <div v-if="office.SEMAIL">
      <a v-bind:href="'mailto:'+office.SEMAIL" class="card-office-e-mail">{{ office.SEMAIL }}</a>
      </div>
    </div>
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

</style>
