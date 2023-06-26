<template>
  <div v-if="featureFlag" class="validation">
    <div class="validation_title">Требования к паролю</div>
    <div class="validation_description">
      допускаются спецсимволы !#$%^*()-=+[]{};,.|/?
    </div>
    <div class="indicator">
      <div class="indicator_color" :style="{ width: goIndicator }"></div>
    </div>
    <ul>
      <li
        v-for="item in validationList"
        :key="item.errorText"
        :class="{
          default: passwordValue.length === 0 && v.$anyDirty === false,
          error: item.isError && v.$anyDirty === true,
          success: !item.isError,
        }"
      >
        {{ item.errorText }}
      </li>
    </ul>
  </div>
</template>
<script>
import { passwordValidationWindow } from "../../RegForm/regform.helper";
export default {
  name: "ValidationWindow",
  props: { passwordValue: String, v: Object },
  computed: {
    goIndicator() {
      let indicator = 0;
      this.validationList.forEach((item) => {
        indicator += item.indicator;
      });
      return `${indicator}%`;
    },
    featureFlag() {
      if (!process.server) {
        return new URL(
          window.location.href,
          "https://reso.ru"
        ).searchParams.has("LK2-882");
      }
      return null;
    },
    validationList() {
      return Object.entries(passwordValidationWindow(this.passwordValue)).map(
        ([, item]) => item
      );
    },
  },
};
</script>
<style scoped>
.validation_title {
  font-weight: 600;
}
.validation_description {
  color: #868686;
  font-size: 0.875rem;
}
.validation {
  z-index: 1;
  color: #434343;
  position: absolute;
  left: 0;
  width: 100%;
  padding: 10px;
  background-color: white;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  top: 85px;
}
.validation ul {
  padding-left: 20px;
}
.validation ul li {
  list-style: circle;
  position: relative;
  margin-top: 5px;
  line-height: 20px;
}
.validation ul li.success,
.validation ul li.error {
  list-style: none;
}
.validation ul li.success:after {
  top: 50%;
  margin-top: -6px;
  content: "";
  position: absolute;
  width: 12px;
  height: 12px;
  left: -20px;
  background: url(/system/modules/ru.reso.v2/resources/img/icons/success-list.svg)
    50% 50% no-repeat;
}
.validation ul li.error:after {
  top: 50%;
  margin-top: -6px;
  content: "";
  position: absolute;
  width: 12px;
  height: 12px;
  left: -20px;
  background: url(/system/modules/ru.reso.v2/resources/img/icons/error-list.svg)
    50% 50% no-repeat;
}
.indicator {
  width: 100%;
}
.indicator_color {
  width: 0%;
  height: 2px;
  background: linear-gradient(90deg, #56ab2f 0%, #a8e063 100%);
}
@media (max-width: 992px) {
  .validation_title {
    font-weight: 700;
    font-size: 0.875rem;
  }
  .validation_description {
    font-size: 0.75rem;
  }
  .validation ul li {
    font-size: 0.875rem;
  }
}
</style>
