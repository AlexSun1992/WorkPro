<template>
  <b-card class="office-mobile-list">
    <b-card-text>
      <div v-if="office.info">
        <div v-for="(item, i) in office.info" :key="i">
          <div v-if="i == 0 && office.station" class="name">
            <div>
              <span
                :class="
                  'undeground-color_' + getUnderlineId(office.station, item)
                "
              ></span>
              <span>{{ "м. " + office.station }}</span>
            </div>
            <button class="oml-btn-open"></button>
          </div>
          <div v-if="i == 0 && !office.station" class="name">
            {{ item.SSHORTNAME }}
            <button class="oml-btn-open"></button>
          </div>
          <div v-if="i == 0" class="count-office">{{ count(office) }}</div>
          <div class="card-body">
            <div class="card-title">{{ item.SSHORTNAME }}</div>
            <div class="card-office-adress row">
              <div class="col-4 pe-0" v-if="item.SPATH1">
                <div class="position-relative">
                  <img
                    :src="
                      'https://www.reso.ru/export/sites_reso/' + item.SPATH1
                    "
                  />
                  <button class="office-image-zoom" type="button"></button>
                </div>
              </div>
              <div :class="[item.SPATH1 ? 'col-8' : 'col-12']">
                <div>{{ item.SADDRESS }}</div>
                <div
                  :class="[
                    isOpened ? 'card-office-opened' : 'card-office-closed',
                  ]"
                >
                  {{ showWorkingHours(item) }}
                </div>
              </div>
              <div class="col-12">
                <button
                  @click="$emit('open', item)"
                  type="button"
                  class="show-maps-balloon"
                >
                  Показать на карте
                </button>
              </div>
            </div>
            <div class="card-office-undeground">
              <div>
                <span
                  :class="
                    'undeground-color_' + getUnderlineId(office.station, item)
                  "
                ></span>
                <span>{{ "м. " + office.station }}</span>
                <span v-if="item.NDISTANSE" class="card-office-distance">
                  {{ item.NDISTANSE.toFixed(1) + " км" }}
                </span>
              </div>
            </div>
            <div v-if="item.SGRAF" class="card-office-time">
              <button type="button">Режим работы:</button>
              <div class="card-office-times">
                <div v-for="(graf, i) in getGrafs(item.SGRAF)" :key="i">
                  {{ graf }}
                </div>
              </div>
            </div>
            <div v-if="item.SPHONE" class="card-office-contacts">
              <div v-for="(phone, i) in getPhones(item.SPHONE)" :key="i">
                <div v-if="item.SPHONE" class="card-office-phone">
                  <a v-bind:href="'tel:' + item.SPHONE">{{ phone }}</a>
                </div>
              </div>
              <div v-if="item.SEMAIL">
                <a
                  v-bind:href="'mailto:' + item.SEMAIL"
                  class="card-office-e-mail"
                  >{{ item.SEMAIL }}</a
                >
              </div>
            </div>
            <button class="open-office-more-info" type="button">
              Подробнее
            </button>
          </div>
        </div>
      </div>
    </b-card-text>
  </b-card>
</template>

<script>
import { BCard, BButton, BCardText } from "bootstrap-vue";
import {
  count,
  getUnderlineId,
  getPhones,
  getGrafs,
} from "../../../../utils/map/helpers";
export default {
  name: "OfficeCardMobile",
  components: {
    BCard,
    BButton,
    BCardText,
  },
  props: ["office"],
  data() {
    return {
      count,
      getUnderlineId,
      getPhones,
      getGrafs,
      isInfoShown: false,
      isGrafShown: false,
      isOpened: true,
    };
  },
  methods: {
    // count(office) {
    //   let str;
    //   if (!office.info) return;
    //   if (office.info.length == 1) {
    //     str = office.info.length + " отделение";
    //   } else if (office.info.length > 1 && office.info.length < 5) {
    //     str = office.info.length + " отделения";
    //   } else {
    //     str = office.info.length + " отделений";
    //   }
    //   return str;
    // },
    // getUnderlineId(station, item) {
    //   let obj = item.IDUNDERGROUND.find((element) => {
    //     return element.SNAME.includes(station);
    //   });
    //   return obj?.IDUNDERLINE;
    // },
    // getPhones(phones) {
    //   let phonesArr = phones.split(";");
    //   phonesArr.pop();
    //   return phonesArr;
    // },
    // getGrafs(grafs) {
    //   let grafsArr = grafs.split("\n");
    //   grafsArr.pop();
    //   return grafsArr;
    // },
    showWorkingHours(office) {
      let dateNow = new Date();
      let day = dateNow.getDay();
      let dateEnd = new Date();
      day = day == 0 ? 7 : day;
      if (office.GRAF && office.GRAF[day - 1]) {
        const [endHour, endMinute] = office.GRAF[day - 1]?.SEND.split(".");
        dateEnd.setHours(endHour);
        dateEnd.setMinutes(endMinute);
        let str;
        if (dateNow < dateEnd) {
          str = `Открыт до ${dateEnd.getHours()}:${
            dateEnd.getMinutes() == 0
              ? dateEnd.getMinutes() + "0"
              : dateEnd.getMinutes()
          }`;
        } else if (dateNow > dateEnd && office.GRAF[day]) {
          str = `Откроется завтра в ${office.GRAF[day].SBEGIN}`;
        } else if (dateNow > dateEnd && !office.GRAF[day]) {
          this.isOpened = false;
          dateNow.setDate(
            dateNow.getDate() + ((1 + 7 - dateNow.getDay()) % 7 || 7)
          );
          str =
            "Закрыт до " +
            ("0" + dateNow.getDate()).slice(-2) +
            "." +
            ("0" + (dateNow.getMonth() + 1)).slice(-2) +
            "." +
            dateNow.getFullYear();
        }
        return str;
      }
    },
  },
};
</script>

<style scoped>
.name {
  display: flex;
  justify-content: space-between;
}
</style>
