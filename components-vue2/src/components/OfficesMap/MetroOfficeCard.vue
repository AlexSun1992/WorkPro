<template>
  <div>
    <svg
      width="56"
      height="56"
      style="display: none"
      version="1.1"
      xlmns="http://www.w3.org/2000/svg"
    >
      <g id="balloon-open">
        <rect
          x="4"
          y="3"
          width="16"
          height="16"
          rx="8"
          stroke="#43B02A"
          fill="white"
          stroke-width="4"
        />
      </g>
      <g id="balloon-close">
        <rect
          x="4"
          y="3"
          width="16"
          height="16"
          rx="8"
          stroke="#C3C3C3"
          fill="white"
          stroke-width="4"
        />
      </g>
      <g id="balloon-select">
        <path
          d="M8 24C8 12.9543 16.9543 4 28 4C39.0457 4 48 12.9543 48 24C48 35.0457 39.0457 44 28 44C16.9543 44 8 35.0457 8 24Z"
          fill="#43B02A"
        ></path>
        <path
          d="M28 18C25.794 18 24 19.794 24 22C24 24.206 25.794 26 28 26C30.206 26 32 24.206 32 22C32 19.794 30.206 18 28 18ZM28 24C26.897 24 26 23.103 26 22C26 20.897 26.897 20 28 20C29.103 20 30 20.897 30 22C30 23.103 29.103 24 28 24ZM27.996 14C23.437 14 20 17.439 20 22C20 28.326 24.812 32.26 26.881 33.657C27.219 33.886 27.608 34.001 27.996 34.001C28.383 34.001 28.77 33.8869 29.108 33.6589C31.18 32.2599 35.999 28.324 35.999 22C36 17.439 32.559 14 27.996 14ZM28.001 32C26.197 30.781 22 27.367 22 22C22 18.523 24.521 16 27.996 16C31.419 16 34 18.579 34 22C34 27.364 29.797 30.781 28.001 32Z"
          fill="#ffffff"
        ></path>
        <path
          d="M28 42C18.0589 42 10 33.9411 10 24H6C6 36.1503 15.8497 46 28 46V42ZM46 24C46 33.9411 37.9411 42 28 42V46C40.1503 46 50 36.1503 50 24H46ZM28 6C37.9411 6 46 14.0589 46 24H50C50 11.8497 40.1503 2 28 2V6ZM28 2C15.8497 2 6 11.8497 6 24H10C10 14.0589 18.0589 6 28 6V2Z"
          fill="#009639"
        ></path>
      </g>
    </svg>
    <div>
      <div
        v-for="(office, index) in offices"
        :key="index"
        class="office-list-containers"
      >
        <div class="card-body">
          <h4 class="card-title">{{ office.SSHORTNAME }}</h4>
          <div class="card-text">
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
              <div class="col-12">
                <button
                  type="button"
                  @click="$emit('open', office)"
                  class="show-maps-balloon"
                >
                  Показать на карте
                </button>
              </div>
            </div>
            <div
              class="green-tags mt-2"
              v-if="office.LSPR === true || office.LREG_CENTER === true"
            >
              Урегулирование страховых случаев
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
              <button type="button">Режим работы:</button>
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
              <div
                v-for="(phone, i) in getPhones(office.SPHONE)"
                :key="i"
              >
                <div
                  v-if="office.SPHONE"
                  class="card-office-phone"
                >
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
          </div>
        </div>
      </div>
    </div>
    <div
      @click="$emit('close')"
      class="office-metro-btn-close"
    ></div>
  </div>
</template>

<script>
import { showWorkingHours, getTime, getGrafs, getPhones } from "../../../../utils/map/helpers/helpers";

export default {
  name: "MetroOfficeCard",
  props: ["offices"],
  data() {
    return {
      isOpened: true,
      isGrafShown: false,
      showWorkingHours,
      getTime,
      getGrafs,
      getPhones,
    };
  },
};
</script>

<style scoped>
.btn-close {
  cursor: pointer;
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
