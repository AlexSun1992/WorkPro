<template>
  <div class="map-container">
    <div id="map" class="map"></div>
  </div>
</template>

<script>
export default {
  name: "MapViewer",
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
      var myMap = new ymaps.Map("map", {
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
      let myClusterer = new ymaps.Clusterer();
      myClusterer.add(myGeoObjects);
      myMap.geoObjects.add(myClusterer);
    },
  },
};
</script>

<style scoped>
.map {
  width: 800px;
  height: 600px;
}
.map-container {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  position: absolute;
  height: 100%;
}
</style>
