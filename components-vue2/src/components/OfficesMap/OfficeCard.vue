<template>
  <b-card :title="office.SSHORTNAME" class="mb-2">
    <b-card-text>
      <div class="card-office-adress row">
        <div v-if="office.SPATH1" class="col-4 pe-0">
          <div class="position-relative">
            <img
              :src="'https://www.reso.ru/export/sites_reso/' + office.SPATH1"
            />
            <button class="office-image-zoom" type="button"></button>
          </div>
        </div>
        <div :class="[office.SPATH1 ? 'col-8' : 'col-12']">
          <div>{{ office.SADDRESS }}</div>
          <div
            :class="[isOpened ? 'card-office-opened' : 'card-office-closed']"
          >
            {{ showWorkingHours(office) }}
          </div>
        </div>
        <div class="col-12">
          <button
            @click="$emit('open', office)"
            type="button"
            class="show-maps-balloon"
          >
            Показать на карте
          </button>
        </div>
      </div>
      <div v-if="office.SDADATAMETRO" class="card-office-undeground">
        <div v-for="(item, i) in office.SDADATAMETRO" :key="i">
          <span :class="'undeground-color_'" :data-line="item.LINE"></span>
          <span>{{ item.SNAME }}</span>
          <!-- <span v-if="office.NDISTANSE" class="card-office-distance">
            {{ getTime(office.NDISTANSE) }}
          </span> -->
          <span v-if="item.DISTANCE" class="card-office-distance">
            {{ getTime(item.DISTANCE) }}
          </span>
        </div>
      </div>

      <div v-if="office.SGRAF" class="card-office-time">
        <button type="button" @click="isGrafShown = !isGrafShown">
          Режим работы:
        </button>
        <div class="card-office-times">
          <div v-for="(graf, i) in getGrafs(office.SGRAF)" :key="i">
            {{ graf }}
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
import {
  getTime,
  getPhones,
  getGrafs,
  showWorkingHours,
} from "../../../../utils/map/helpers/helpers";
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
      getTime,
      getPhones,
      getGrafs,
      isGrafShown: false,
      isOpened: true,
      showWorkingHours,
    };
  },
  methods: {
    // showWorkingHours(office) {
    //   let dateNow = new Date();
    //   let day = dateNow.getDay();
    //   let dateEnd = new Date();
    //   day = day == 0 ? 7 : day;
    //   let dayObj = office.GRAF?.find((item) => item.NDAY == day);
    //   if (office.GRAF && dayObj) {
    //     const [endHour, endMinute] = dayObj?.SEND.split(".");
    //     dateEnd.setHours(endHour);
    //     dateEnd.setMinutes(endMinute);
    //     let str;
    //     if (dateNow < dateEnd) {
    //       str = `Открыт до ${dateEnd.getHours()}:${
    //         dateEnd.getMinutes() == 0
    //           ? dateEnd.getMinutes() + "0"
    //           : dateEnd.getMinutes()
    //       }`;
    //     } else if (dateNow > dateEnd && office.GRAF[day]) {
    //       str = `Откроется завтра в ${office.GRAF[day].SBEGIN}`;
    //     } else if (dateNow > dateEnd && !office.GRAF[day]) {
    //       this.isOpened = false;
    //       dateNow.setDate(
    //         dateNow.getDate() + ((1 + 7 - dateNow.getDay()) % 7 || 7)
    //       );
    //       str =
    //         "Закрыт до " +
    //         ("0" + dateNow.getDate()).slice(-2) +
    //         "." +
    //         ("0" + (dateNow.getMonth() + 1)).slice(-2) +
    //         "." +
    //         dateNow.getFullYear();
    //     }
    //     return str;
    //   }
    // },
  },
};
</script>

<style scoped></style>
