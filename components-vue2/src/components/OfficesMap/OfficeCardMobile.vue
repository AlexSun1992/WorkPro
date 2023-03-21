<template>
  <b-card
    class="office-mobile-list"
    :class="{ 'single-office show': !office.station }"
  >
    <b-card-text>
      <div v-if="office.info">
        <div v-for="(item, i) in office.info" :key="i">
          <div v-if="i == 0 && office.station" class="name">
            <div v-if="office.station">
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
            <button v-if="office.station" class="oml-btn-open"></button>
          </div>
          <div v-if="i == 0 && office.station" class="count-office">
            {{ countOffices(office) }}
          </div>
          <div class="card-body">
            <div v-if="!office.station" class="count-office"></div>
            <div class="card-office-adress row">
              <div class="col-4 pe-0" v-if="item.SPATH1">
                <div class="position-relative">
                  <img :src="'/export/sites/reso' + item.SPATH1" />
                  <button class="office-image-zoom" type="button"></button>
                </div>
              </div>
              <div :class="[item.SPATH1 ? 'col-8' : 'col-12']">
                <div class="card-title mb-2">{{ item.SSHORTNAME }}</div>
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
            <div class="mt-2">
              <div
                class="green-tags"
                v-if="office.LSPR === true || office.LREG_CENTER === true"
              >
                Урегулирование страховых случаев
              </div>
            </div>
            <div v-if="office.station" class="card-office-undeground">
              <div>
                <span
                  :class="
                    'undeground-color_' + getUnderlineId(office.station, item)
                  "
                ></span>
                <span>{{ "м. " + office.station }}</span>
                <span v-if="item.NDISTANSE" class="card-office-distance">
                  {{ getTime(item.NDISTANSE) }}
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
import { BCard, BCardText } from "bootstrap-vue";
import {
  countOffices,
  getUnderlineId,
  getPhones,
  getGrafs,
  getTime,
  showWorkingHours,
} from "../../../../utils/map/helpers/helpers";

export default {
  name: "OfficeCardMobile",
  components: {
    BCard,
    BCardText,
  },
  props: ["office"],
  data() {
    return {
      countOffices,
      getUnderlineId,
      getPhones,
      getGrafs,
      getTime,
      isInfoShown: false,
      isGrafShown: false,
      isOpened: true,
      showWorkingHours,
    };
  },
};
</script>

<style scoped>
.name {
  display: flex;
  justify-content: space-between;
}
.green-tags {
  font-family: "SF Pro Display";
  font-style: normal;
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 20px;
  align-items: center;
  color: #ffffff;
  padding: 4px 12px;
  background: #43b02a;
  border-radius: 100px;
  display: table;
}
</style>
