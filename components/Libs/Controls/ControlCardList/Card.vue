<template>
  <div>
    <div
      class="card-box-list"
      :data-color="data.SCOLOR"
      :style="data.SCOLOR ? `background-color:${data.SCOLOR}` : ''"
    >
      <cabinet-link
        :class="['singl-card', data.SBUTTON_TEXT ? 'have_promo' : '']"
        :url="data.SURLAUTH"
      >
        <div class="card-img">
          <img :src="`/img/${changeImg}.png`" />
        </div>
        <div class="card-title">
          <div class="card-title-name">{{ data.SNAME }}</div>
          <div
            v-if="data.SBUBBLE1 || data.SBUBBLE2"
            class="card-title-sale"
          >
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
          </div>
        </div>
        <div class="card-d">
          <div class="card-des">{{ data.SDESCRIPTION }}</div>
        </div>
        <div v-if="data.SBUTTON_TEXT">
          <div
            class="card-button"
            :style="{ 'background-color': data.SCOLOR_BUTTON, color: data.SCOLOR_TEXT }"
          >
            {{ data.SBUTTON_TEXT }}
          </div>
        </div>
      </cabinet-link>
    </div>
  </div>
</template>

<script>
import CabinetLink from "@/components/common/CabinetLink";

export default {
  name: "ControlCard",
  components: { CabinetLink },
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
  grid-template-columns: auto 90px;
  grid-template-rows: 92px auto;
  grid-template-areas:
    "title img"
    "description description";
  grid-column-gap: 0;
  grid-row-gap: 8px;
  padding: 0.75rem;
}

.card-title {
  grid-area: title;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 72px 16px;
  gap: 4px;
}
.have_promo .card-title {
  grid-template-columns: 100%;
  grid-template-rows: min-content;
  gap: 0;
}

.singl-card.have_promo {
  display: grid;
  grid-template-columns: auto 1px;
  grid-template-rows: minmax(40px, max-content) auto 34px;
  grid-template-areas:
    "title title"
    "description img";
  grid-column-gap: 0px;
  grid-row-gap: 0.5rem;
  padding: 0.75rem;
  overflow: hidden;
  border-radius: 1rem;
  position: relative;
}
.card-img img {
  max-width: 90px;
  max-height: 90px;
}
.have_promo .card-img img {
  max-width: 176px;
  max-height: 176px;
  position: absolute;
  bottom: -30px;
  right: -30px;
  opacity: 0.25;
}

.card-img {
  grid-area: img;
}

a {
  text-decoration: none;
}

.card-title-name {
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.5rem;
  color: var(--black);
  display: flex;
  align-self: center;
}
.have_promo .card-title-name {
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.25rem;
}

.card-d {
  grid-area: description;
}
.card-des {
  font-size: 0.875rem;
  line-height: 1.125rem;
  color: var(--warmgrey_80);
}
.have_promo .card-des {
  font-size: 1rem;
  color: var(--sblack);
  line-height: 1.25rem;
  font-weight: 400;
}
.card-button {
  color: var(--black);
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border: 1px solid var(--warmgrey_60);
  padding: 6px 12px;
  display: table;
  border-radius: 1rem;
  position: relative;
}
.have_promo .card-button {
  border: 0;
}

.card-button-price {
  background-color: var(--red_10);
  padding: 0 8px;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 400;
  border-radius: 1rem;
  display: inline-block;
  color: var(--black);
  text-decoration: none;
  margin-top: 6px;
}
.card-button-price_two {
  color: var(--white);
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0 8px;
  background-color: var(--lgreen);
  border-radius: 1rem;
  display: inline-block;
  margin-right: 6px;
  text-decoration: none;
}
.card-box-list {
  box-shadow: 0px 0px 32px -4px rgba(0, 0, 0, 0.1);
  height: 100%;
  border-radius: 1rem;
  display: grid;
}
.card-title-sale {
  align-self: center;
}
</style>
