<template>
  <div class="map-container mt-3">
    <div>
      <input type="text" id="suggest" />
      <div class="mt-2 mb-2">
        <a href="https://reso.ru/About/Contacts/OfficesList"
          >Список офисов продаж и центров выплат</a
        >
      </div>
    </div>
    <div>
      <div ref="map" id="map" class="map"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MapViewer",
  data() {
    return {
      myMap: null,
      suggestion: "",
      site: "",
      myClusterer: null,
    };
  },
  async fetch() {
    try {
      await this.$store.dispatch("fetchAgencies");
    } catch (error) {
      console.log(error);
    }
  },
  head() {
    return {
      script: [
        {
          src: `https://api-maps.yandex.ru/2.1/?apikey=95a56d05-41db-462a-a2ea-2c49ff3417a1&lang=ru_RU`,
        },
      ],
    };
  },
  created() {
    if (process.client) {
      ymaps.ready(this.init);
    }
  },
  methods: {
    init() {
      let suggestView = new ymaps.SuggestView("suggest");
      let showOnMap = this.showOnMap.bind(this);
      suggestView.events.add("select", function (e) {
        showOnMap(e.get("item").value);
      });

      this.myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 6,
      });

      let agencies = this.$store.getters["getAgencies"];
      let myGeoObjects = [];
      for (let i = 0; i < agencies.length; i++) {
        myGeoObjects[i] = new ymaps.GeoObject({
          geometry: {
            type: "Point",
            coordinates: [agencies[i].NLAT, agencies[i].NLONG],
          },
          properties: {
            balloonContentBody: `
          <strong><span>${agencies[i].SSHORTNAME}</span></strong><br><br>
          <span>${agencies[i].SADDRESS}</span><br>
          <strong>Тел.:</strong><span>${agencies[i].SPHONE}</span><br>
          <strong>Email.:</strong><span>${agencies[i].SPHONE}</span><br>
          <strong>Режим работы:</strong><br><span>${agencies[i].SGRAF}</span>
        `,
            hintContent: `${agencies[i].SSHORTNAME}`,
          },
        });
      }
      this.myClusterer = new ymaps.Clusterer();
      this.myClusterer.add(myGeoObjects);
      this.myMap.geoObjects.add(this.myClusterer);
    },
    updateMap(state, caption) {
      let placemark = new ymaps.Placemark(
        this.myMap.getCenter(),
        {
          iconCaption: caption,
          balloonContent: caption,
        },
        {
          preset: "islands#redDotIconWithCaption",
        }
      );
      this.myMap.geoObjects.add(placemark);
      this.myMap.setCenter(state.center, state.zoom);
      placemark.geometry.setCoordinates(state.center);
      placemark.properties.set({
        iconCaption: caption,
        balloonContent: caption,
      });
      this.myMap.setCenter(state.center, state.zoom);
    },
    showResult(obj) {
      let mapContainer = document.getElementById("map");
      let bounds = obj.properties.get("boundedBy");
      // Рассчитываем видимую область для текущего положения пользователя.
      let mapState = ymaps.util.bounds.getCenterAndZoom(bounds, [
        mapContainer.clientWidth,
        mapContainer.clientHeight,
      ]);
      // Сохраняем полный адрес для сообщения под картой.
      let address = [obj.getCountry(), obj.getAddressLine()].join(", ");
      // Сохраняем укороченный адрес для подписи метки.
      let shortAddress = [
        obj.getThoroughfare(),
        obj.getPremiseNumber(),
        obj.getPremise(),
      ].join(" ");
      this.updateMap(mapState, shortAddress);
    },
    showOnMap(suggest) {
      let showResult = this.showResult.bind(this);
      ymaps.geocode(suggest).then(function (res, context) {
        let obj = res.geoObjects.get(0);
        if (obj) {
          showResult(obj);
        }
      });
    },
  },
};
</script>

<style scoped>
.map {
  width: 800px;
  height: 600px;
}
select,
.form-control,
input {
  min-width: 500px !important;
}
/* .map-container {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: absolute;
  height: 100%;
} */
</style>
