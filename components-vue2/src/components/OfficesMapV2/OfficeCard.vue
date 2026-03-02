<template>
  <b-card
    :title="office.SSHORTNAME ? office.SSHORTNAME : 'Офис продаж'"
    class="mb-2"
  >
    <b-card-text>
      <div class="card-office-adress row">
        <div
          v-if="office.SPATH1"
          class="col-4 pe-0"
        >
          <div class="position-relative">
            <img :src="'/export/sites/reso' + office.SPATH1" />
            <button
              class="office-image-zoom"
              type="button"
            ></button>
          </div>
        </div>
        <div :class="[office.SPATH1 ? 'col-8' : 'col-12']">
          <div>{{ office.SADDRESS }}</div>
          <div :class="[isOpened ? 'card-office-opened' : 'card-office-closed']">
            {{ showWorkingHours(office) }}
          </div>
        </div>
        <div
          v-if="showOnMapButton"
          class="col-12"
        >
          <button
            @click="$emit('open', office)"
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
      <div
        v-if="office.SDADATAMETRO"
        class="card-office-undeground"
      >
        <div
          v-for="(item, i) in office.SDADATAMETRO"
          :key="i"
        >
          <span
            :class="'undeground-color_'"
            :data-line="item.LINE"
          ></span>
          <span>{{ item.SNAME }}</span>
          <span
            v-if="item.DISTANCE"
            class="card-office-distance"
          >
            {{ getTime(item.DISTANCE) }}
          </span>
        </div>
      </div>

      <div
        v-if="office.SGRAF"
        class="card-office-time"
      >
        <button
          type="button"
          @click="isGrafShown = !isGrafShown"
        >
          Режим работы:
        </button>
        <div class="card-office-times">
          <div
            v-for="(graf, i) in getGrafs(office.SGRAF)"
            :key="i"
          >
            {{ graf }}
          </div>
        </div>
      </div>
      <div
        v-if="office.SGRAF"
        class="card-office-contacts"
      >
        <div v-if="office.PHONES">
          <div
            v-for="(phone, i) in phones(office.PHONES)"
            :key="i"
          >
            <div class="card-office-phone">
              <a v-bind:href="'tel:' + phone.clear">{{ phone.view }}</a>
            </div>
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
      <button
        v-if="mobile"
        class="open-office-more-info"
        type="button"
      >
        Подробнее
      </button>
    </b-card-text>
  </b-card>
</template>

<script>
import { BCard, BCardText } from "bootstrap-vue";
import { getTime, getGrafs, showWorkingHours } from "@/utils/map/helpers/helpers";

export default {
  name: "OfficeCard",
  components: {
    BCard,
    BCardText,
  },
  props: {
    office: Object,
    mobile: Boolean,
    showOnMapButton: Boolean,
  },
  data() {
    return {
      getTime,
      getGrafs,
      isGrafShown: false,
      isOpened: true,
      showWorkingHours,
    };
  },
  methods: {
    phones(officePhones) {
      const phones = [];
      Object.values(JSON.parse(officePhones)).forEach((phone) => {
        phones.push({
          clear: phone,
          view: `${phone.substring(0, 2)}(${phone.substring(2, 5)})${phone.substring(5, 8)}-${phone.substring(
            8,
            10
          )}-${phone.substring(10, 12)}${phone.includes(",") ? ` доб. ${phone.split(",")[1]}` : ""}`,
        });
      });
      return phones;
    },
  },
};
</script>

<style scoped>
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
