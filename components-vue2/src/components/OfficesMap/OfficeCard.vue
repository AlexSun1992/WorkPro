<template>
  <b-card :title="office.SSHORTNAME" class="mb-2">
    <b-card-text>
      <div class="card-office-adress row">
        <div class="col-4">
          <img
            :src="'https://www.reso.ru/export/sites_reso/' + office.SPATH1"
          />
        </div>
        <div class="col-8">
          <div>{{ office.SADDRESS }}</div>
          <div class="card-office-opened">открыт до</div>
        </div>
        <div class="col-12">
          <button type="button" class="show-maps-balloon">
            Показать на карте
          </button>
        </div>
      </div>
      <div v-if="office.IDUNDERGROUND.length" class="card-office-undeground">
        <span class="undeground-color"></span
        ><span v-for="(item, index) in office.IDUNDERGROUND" :key="index">
          {{ item.SNAME }}</span
        >
        <span v-if="office.NDISTANSE" class="card-office-distance">
          {{ office.NDISTANSE.toFixed(1) + " км" }}
        </span>
      </div>

      <div v-if="office.SGRAF" class="card-office-time">
        <button type="button" @click="isGrafShown = !isGrafShown">
          Режим работы:
        </button>

        <div v-for="(graf, i) in getGrafs(office.SGRAF)" :key="i">
          <div v-if="isGrafShown">
            <div>{{ graf }}</div>
          </div>
        </div>
      </div>
      <div v-if="office.SGRAF" class="card-office-contacts">
        <div v-for="(phone, i) in getPhones(office.SPHONE)" :key="i">
          <div v-if="office.SPHONE" class="card-office-phone">
            <a v-bind:href="'tel:' + office.SPHONE">{{ phone }}</a>
          </div>
        </div>
        <div v-if="office.SEMAIL">
          <a
            v-bind:href="'mailto:' + office.SEMAIL"
            class="card-office-e-mail"
            >{{ office.SEMAIL }}</a
          >
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
  data() {
    return {
      isGrafShown: false,
    };
  },
  methods: {
    getPhones(phones) {
      let phonesArr = phones.split(";");
      phonesArr.pop();
      return phonesArr;
    },
    getGrafs(grafs) {
      debugger;
      let grafsArr = grafs.split("\n");
      grafsArr.pop();
      return grafsArr;
    },
  },
};
</script>

<style scoped></style>
