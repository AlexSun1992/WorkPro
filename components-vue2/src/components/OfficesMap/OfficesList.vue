<template>
  <div class="container">
    <div v-if="offices && offices.length" class="offices">
      <div
        v-for="(office, index) in mobile ? slicedOffices : offices"
        :key="index"
      >
        <OfficeCardMobile
          v-if="mobile"
          @open="$emit('open', $event)"
          :office="office"
        />
        <OfficeCard v-else @open="$emit('open', $event)" :office="office" />
      </div>
    </div>
    <button
      v-if="!station"
      class="mobile-pagination"
      type="button"
      @click="isShownMore = !isShownMore"
    >
      {{ !isShownMore ? "Показать еще" : "Свернуть" }}
    </button>
    <!-- <div v-else>
      <div class="row search-result-row">
        <div class="col-md-12 col-12 search-results">
          <div class="search-no-result">
            <div class="search-no-result-img"></div>
            <div class="search-no-result-txt">
              По вашему запросу ничего не найдено
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <Paginator
      v-if="data && !mobile"
      @update="page = $event"
      :items-count="officesLength"
      :pages-count="pagesCount"
    />
  </div>
</template>

<script>
import Paginator from "./Paginator.vue";
import OfficeCard from "./OfficeCard.vue";
import OfficeCardMobile from "./OfficeCardMobile.vue";
export default {
  name: "OfficesList",
  props: {
    data: {
      type: Array,
    },
    pagesCount: {
      type: Number,
      default: 15,
    },
    mobile: {
      type: Boolean,
    },
    station: {
      type: String,
    },
  },
  components: {
    OfficeCard,
    Paginator,
    OfficeCardMobile,
  },
  data() {
    return {
      page: 0,
      isShownMore: false,
    };
  },
  methods: {
    showFullList() {
      return this.offices.slice(6);
    },
  },
  computed: {
    officesLength() {
      return this.data?.length;
    },
    offices() {
      if (this.mobile) {
        let officesArr = [];
        let countedOffices = this.data?.reduce((acc, office) => {
          if (office.IDUNDERGROUND.length > 0) {
            office.IDUNDERGROUND.forEach((metroObj) => {
              let stationsArr = [];
              if (metroObj.SNAME.includes(",")) {
                stationsArr = metroObj.SNAME.split(", ");
                stationsArr.forEach((station) => {
                  if (acc[station]) {
                    acc[station].push(office);
                  } else {
                    acc[station] = [office];
                  }
                });
              } else {
                if (acc[metroObj.SNAME]) {
                  acc[metroObj.SNAME].push(office);
                } else {
                  acc[metroObj.SNAME] = [office];
                }
              }
            });
          } else {
            officesArr.push({
              station: "",
              info: [office],
            });
          }
          return acc;
        }, {});

        for (let key in countedOffices) {
          officesArr.push({
            station: key,
            info: countedOffices[key],
          });
        }
        if (this.station) {
          officesArr = officesArr.filter((item) => {
            return item.station == this.station;
          });
        }
        return officesArr;
      } else {
        if (this.data) {
          let start = this.page * this.pagesCount;
          let end = start + this.pagesCount;
          this.page = null;
          return this.data.slice(start, end);
        }
      }
    },
    slicedOffices() {
      let offices = this.offices;
      offices = offices.sort((a, b) => {
        return a.info[0].NDISTANSE - b.info[0].NDISTANSE;
      });
      if (!this.isShownMore) {
        return offices.slice(0, 6);
      } else {
        return offices;
      }
    },
  },
  watch: {
    page: function (val) {
      this.$emit("update", val);
    },
  },
};
</script>

<style scoped>
.empty {
  display: flex;
  justify-content: center;
}
</style>
