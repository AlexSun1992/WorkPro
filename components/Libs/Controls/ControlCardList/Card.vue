<template>
  <div>
    <div
      class="card-box-list"
      :style="data.SCOLOR ? `background-color:${data.SCOLOR}` : ''"
    >
      <a
        :href="data.SURLAUTH"
        :class="['singl-card', data.SBUTTON_TEXT ? 'have_promo' : '']"
      >
        <div class="card-img">
          <img :src="`/img/${changeImg}.png`" />
        </div>
        <div class="card-title">{{ data.SNAME }}</div>
        <div>
          <div class="card-des">{{ data.SDESCRIPTION }}</div>
          <div
            v-if="data.SBUBBLE1"
            class="card-button-price_two"
            v-html="data.SBUBBLE1"
          ></div>
          <div
            v-if="data.SBUBBLE2"
            class="card-button-price"
            v-html="changeRub"
          ></div>

          <div
            v-if="data.SBUTTON_TEXT"
            class="card-button"
          >
            {{ data.SBUTTON_TEXT }}
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "ControlCard",
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    changeRub() {
      return this.data.SBUBBLE2.replace(/\\[uU]20[bB][dD]/g, "&#8381;");
    },
    changeImg() {
      return this.data.SIMAGE.replace("@@theme/", "");
    },
  },
};
</script>

<style scoped>
.singl-card {
  display: grid;
  grid-template-columns: 72px auto;
  grid-template-rows: min-content auto;
  grid-template-areas:
    "img title"
    "img description";
  grid-column-gap: 1rem;
  grid-row-gap: 0px;
  padding: 0.75rem;
}

.singl-card.have_promo {
  display: grid;
  grid-template-columns: auto 68px;
  grid-template-areas:
    "title title"
    "description img";
  grid-column-gap: 0px;
  grid-row-gap: 0.5rem;
  padding: 0.75rem;
}
.card-img img {
  max-width: 72px;
}
.have_promo .card-img img {
  max-width: 68px;
}

.card-img {
  grid-area: img;
}
.card-d {
  grid-area: description;
}
a {
  text-decoration: none;
}
.card-title {
  grid-area: title;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.5rem;
  color: var(--black);
}
.have_promo .card-title {
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.card-des {
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--greyd);
}
.have_promo .card-des {
  font-size: 0.625rem;
  color: var(--sblack);
  line-height: 0.75rem;
  font-weight: 600;
}
.card-button {
  color: var(--color_02);
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border: 1px solid var(--color_02);
  padding: 6px 12px;
  display: table;
  border-radius: 1rem;
  margin-top: 0.5rem;
}

.card-button-price {
  background-color: var(--color_01);
  padding: 0 4px 0 8px;
  font-size: 0.75rem;
  line-height: 0.875rem;
  font-weight: 500;
  border-radius: 1.25rem;
  display: inline-block;
  color: var(--black);
  text-decoration: none;
  margin-top: 6px;
}
.card-button-price_two {
  color: var(--white);
  font-size: 0.75rem;
  line-height: 0.875rem;
  padding: 0 4px;
  background-color: var(--lgreen);
  border-radius: 0.65rem;
  display: inline-block;
  margin-right: 6px;
  text-decoration: none;
  margin-top: 6px;
}
.card-box-list {
  box-shadow: 0px 0px 32px -4px rgba(0, 0, 0, 0.1);
  height: 100%;
  border-radius: 1rem;
  display: grid;
}
</style>
