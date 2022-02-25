<template>
  <div>
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
              <div v-if="office.SPATH1" class="col-4 px-0">
                <img
                  :src="
                    'https://www.reso.ru/export/sites_reso/' + office.SPATH1
                  "
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
            <div class="card-office-undeground">
              <span class="undeground-color"></span>
              <span> Данных нет (во вью пусто)</span>
              <span class="card-office-distance"> 0.7 км </span>
            </div>
            <div class="card-office-time">
              <button type="button">Режим работы:</button>
              <div class="card-office-times">{{ office.SGRAF }}</div>
            </div>
            <div class="card-office-contacts">
              <div class="card-office-phone">
                <a :href="'tel:' + office.SPHONE">{{ office.SPHONE }}</a>
              </div>
              <div>
                <a
                  :href="'mailto:' + office.SEMAIL"
                  class="card-office-e-mail"
                  >{{ office.SEMAIL }}</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div @click="$emit('close')" class="office-metro-btn-close"></div>
  </div>
</template>

<script>
export default {
  name: "MetroOfficeCard",
  props: ["offices"],
};
</script>

<style scoped>
.btn-close {
  cursor: pointer;
}
</style>
