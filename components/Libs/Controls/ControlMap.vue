<template>
  <yandex-map style="height: 500px; width: 100%" :coords="coords">
    <ymap-marker
      marker-id="123"
      :coords="coords"
      :balloon-template="balloonTemplate"
    />
  </yandex-map>
</template>

<script>
export default {
  name: "ControlMap",
  data: () => ({
    coords: [55.737938, 37.244098],
    markerIcon: {
      layout: "default#imageWithContent",
      imageHref: "https://image.flaticon.com/icons/png/512/33/33447.png",
      imageSize: [43, 43],
      imageOffset: [0, 0],
      content: "123 v12",
      contentOffset: [0, 15],
      contentLayout:
        '<div style="background: red; width: 50px; color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>',
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
  },
  methods: {
    onClick(e) {
      this.coords = e.get("coords");
    },
  },
};
</script>

<style></style>
