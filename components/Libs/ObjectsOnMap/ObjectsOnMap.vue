<template>
  <div
    id="map"
    @click="closeCurrentBalloon"
    style="width: 600px; height: 400px"
  ></div>
</template>

<script>
export default {
  name: "ObjectsOnMap",
  props: {
    moduleId: {
      type: Number,
      required: true,
    },
    template: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      myMap: null,
      items: null,
      selectedItem: null,
    };
  },
  async created() {
    try {
      await this.$loadScript(
        `https://api-maps.yandex.ru/2.1/?apikey=95a56d05-41db-462a-a2ea-2c49ff3417a1&lang=ru_RU`
      );
    } catch (error) {
      console.log(error);
    }
  },
  computed: {
    dataContent() {
      return this.$store.getters["blocks/getBlockById"](this.moduleId);
    },
  },
  methods: {
    closeCurrentBalloon() {
      let close = document.querySelector(
        'ymaps[class$="-balloon__close-button"]'
      );
      if (close != null) {
        close.click();
      }
    },
    setSelectedItem() {
      let elem = document.getElementById("elem");
      elem.addEventListener("click", this.update);
      this.selectedItem = JSON.parse(elem.dataset.obj);
      console.log(this.selectedItem);
    },
    update() {
      console.log(this.selectedItem);
      this.$emit("update", this.selectedItem);
    },
    init() {
      this.myMap?.destroy();
      this.myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 11,
      });
      this.myMap.events.add("balloonopen", this.setSelectedItem);
      this.myMap.events.add("click", (e) => {
        e.get("target").balloon.close();
      });
      let clusterer = new ymaps.Clusterer();
      let items = this.items.data.items.filter(
        (item) => item.NLAT && item.NLON
      );
      clusterer.add(this.getGeoObjects(items));
      this.myMap.geoObjects.add(clusterer);
      let myPlacemark = new ymaps.Placemark(
        [55.76, 37.64],
        {
          hintContent: "Я здесь",
        },
        {
          preset: "islands#redDotIconWithCaption",
        }
      );
      this.myMap.geoObjects.add(myPlacemark);
    },
    getTemplate(item) {
      let str;
      Object.keys(item).forEach((field) => {
        str = (str ? str : this.template).replace(field, item[field]);
      });
      return (
        str +
        `<br><button data-obj='${JSON.stringify(
          item
        )}' id='elem'>Выбрать</button>`
      );
    },
    getGeoObjects(items) {
      let myGeoObjects = [];
      for (let i = 0; i < items.length; i++) {
        myGeoObjects[i] = new ymaps.GeoObject({
          geometry: {
            type: "Point",
            coordinates: [items[i].NLAT, items[i].NLON],
          },
          properties: {
            balloonContentBody: this.getTemplate(items[i]),
            hintContent: `${items[i].SLPU}`,
          },
        });
      }
      return myGeoObjects;
    },
  },
  watch: {
    dataContent() {
      this.items = this.$store.getters["blocks/getBlockById"](this.moduleId);
      if (ymaps && this.items) {
        ymaps.ready(this.init);
      }
    },
  },
};
</script>

<style scoped></style>
