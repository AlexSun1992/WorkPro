<template>
  <yandex-map
    style="height: 500px; width: 100%"
    :coords="coords"
    :controls="['fullscreenControl']"
    :use-object-manager="true"
    @map-was-initialized="handleMapInit"
    @markers-was-change="changeMarkers"
    @balloonopen="baloonOpen($event)"
    @balloonclose="baloonClose($event)"
  >
    <ymap-marker
      :marker-id="1"
      :coords="coords"
      :balloon-template="balloonTemplate"
      :icon="icon"
      @marker-events="eventsMarkers"
    />
    <ymap-marker
      :marker-id="2"
      :coords="coords2"
      :balloon-template="balloonTemplate2"
    />
  </yandex-map>
</template>

<script>
export default {
  name: "ControlMap",
  data: () => ({
    coords: [55.737938, 37.244098],
    coords2: [65.737938, 47.244098],
    markerType: "Polygon",
    map: {
      activeImageHref:
        "https://reso.ru/system/modules/ru.reso.v2/resources/img/icons/ya_agent_active.svg",
      imageHref:
        "https://reso.ru/export/system/modules/ru.reso.v2/resources/img/icons/ya_agent.svg",
      isActiveIcon: false,
    },
    markerIcon: {
      layout: "default#imageWithContent",
      imageSize: [43, 43],
      imageOffset: [0, 0],
      contentOffset: [0, 0],
    },
  }),
  props: {
    Lattitude: {
      type: Number,
      required: false,
      default: () => null,
    },
    Longetude: {
      type: Number,
      required: false,
      default: () => null,
    },
  },
  computed: {
    balloonTemplate() {
      return `
        <h1 class="red">Hi, everyone!</h1>
        <p>I am here: ${this.coords}</p>
      `;
    },
    balloonTemplate2() {
      return `
        <h1 class="red">Hi, 123!</h1>
        <p>I am here: ${this.coords2}</p>
      `;
    },
    icon() {
      return {
        layout: "default#imageWithContent",
        imageSize: [43, 43],
        imageOffset: [0, 0],
        contentOffset: [0, 0],
        imageHref: this.map.isActiveIcon
          ? this.map.activeImageHref
          : this.map.imageHref,
      };
    },
  },
  methods: {
    onClick(e) {
      // const objectId = e.get("coords");
      // console.log(objectId);
      // this.coords = e.get("coords");
    },
    handleMapInit(e) {
      const objectManager = new ymaps.ObjectManager();
      objectManager.add({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            id: 0,
            geometry: {
              type: "Point",
              coordinates: [55.831903, 37.411961],
            },
            properties: {
              balloonContent: "Магазин на углу",
              data: {
                organization: "shop",
                open: "9am - 9pm",
              },
            },
            options: {
              hideIconOnBalloonOpen: false,
              iconLayout: "default#image",
              iconImageHref:
                "https://reso.ru/system/modules/ru.reso.v2/resources/img/icons/ya_agent.svg",
              iconImageSize: [56, 56],
              iconImageOffset: [0, 0],
            },
          },
          {
            type: "Feature",
            id: 1,
            geometry: {
              type: "Point",
              coordinates: [55.763338, 37.565466],
            },
            properties: {
              balloonContent: "Аптека",
              data: {
                organization: "pharmacy",
                open: "8am - 10pm",
              },
            },
            options: {
              hideIconOnBalloonOpen: false,
              iconLayout: "default#image",
              iconImageHref:
                "https://reso.ru/system/modules/ru.reso.v2/resources/img/icons/ya_agent.svg",
              iconImageSize: [56, 56],
              iconImageOffset: [0, 0],
            },
          },
        ],
      });

      const placemark = new ymaps.Placemark(
        [55.75, 37.61],
        {
          balloonContent:
            '<img src="http://img-fotki.yandex.ru/get/6114/82599242.2d6/0_88b97_ec425cf5_M" />',
          iconContent: "Азербайджан",
        },
        {
          preset: "islands#yellowStretchyIcon",
          // Отключаем кнопку закрытия балуна.
          balloonCloseButton: false,
          // Балун будем открывать и закрывать кликом по иконке метки.
          hideIconOnBalloonOpen: false,
        }
      );
      e.geoObjects.add(objectManager);
      console.log(e.geoObjects.getMap());

      objectManager.objects.events.add(
        ["balloonopen", "balloonclose"],
        (event) => {
          console.log(event.get("objectId"));
          const objectId = event.get("objectId");
          if (event.get("type") === "balloonopen") {
            objectManager.objects.setObjectOptions(objectId, {
              iconImageHref:
                "https://reso.ru/system/modules/ru.reso.v2/resources/img/icons/ya_agent_active.svg",
            });
          } else {
            objectManager.objects.setObjectOptions(objectId, {
              iconImageHref:
                "https://reso.ru/system/modules/ru.reso.v2/resources/img/icons/ya_agent.svg",
            });
          }
        }
      );
    },
    changeMarkers(e) {
      console.log("markers", e);
      // this.map.isActiveIcon = true;
    },
    eventsMarkers(e) {
      console.log("markersevents", e);
    },
    baloonOpen(e) {
      console.log(e.get("objectId"));
      // this.map.isActiveIcon = true;
    },
    baloonClose(e) {
      console.log("close");
      // this.map.isActiveIcon = false;
    },
  },
};
</script>

<style></style>
