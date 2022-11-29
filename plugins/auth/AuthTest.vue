<template>
  <div>
    <div>{{ AuthTest }}</div>
    <button id="btn" @click="makeToast(err)">Press</button>
  </div>
</template>
<script>
import { makeToast } from "./toast";

const SYSTEM_ERROR_TEXT =
  "Приносим извинения, в Личном Кабинете что-то пошло не так.\nПросим обновить страницу или перейти на Главную Личного кабинета.";

export default {
  name: "AuthTest",
  data() {
    return {
      AuthTest: "SoWeBegin",
      err: SYSTEM_ERROR_TEXT,
    };
  },
  methods: {
    makeToast,
  },
};
</script>
