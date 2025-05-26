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
          <div v-if="!office.station" class="count-office"></div>
          <OfficeCard @open="$emit('open', $event)" :office="item" :mobile="true" :showOnMapButton="true"/>
        </div>
      </div>
    </b-card-text>
  </b-card>
</template>

<script>
/* eslint-disable */
import { BCard, BCardText } from "bootstrap-vue";
import OfficeCard from "./OfficeCard.vue";
import {
  countOffices,
  getUnderlineId,
} from "../../../../utils/map/helpers/helpers2";

export default {
  name: "OfficeCardMobile",
  components: {
    BCard,
    BCardText,
    OfficeCard,
  },
  props: ["office"],
  data() {
    return {
      countOffices,
      getUnderlineId,
      isInfoShown: false,
      isGrafShown: false,
      isOpened: true,
    };
  },
};
</script>

<style scoped>
.name {
  display: flex;
  justify-content: space-between;
}
</style>
