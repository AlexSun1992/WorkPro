<template>
  <button
    id="esia-login"
    class="goesia"
    @click="goESIA"
  >
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <use href="/img/login.svg#esia"></use>
    </svg>
    Госуслуги
  </button>
</template>

<script>
import { redirectWithRef } from "./redirect";

export default {
  name: "EsiaButton",

  setup() {
    const goESIA = () => {
      redirectWithRef("/sso?auth&type=esia");
    };
    return { goESIA };
  },
};
</script>

<style scoped>
svg {
  margin-right: 8px;
}
button {
  background: #fff;
  border-radius: 16px;
  border: 2px solid #a4a4a4;
  width: 100%;
  height: 56px;
  margin-top: 1.5rem;
  font-weight: 700;
  color: #292929;
  transition: 0.3s;
}
button:hover {
  background: #f2f4f5;
  transition: 0.3s;
}
button:focus {
  background: #e1e1e1;
  transition: 0.3s;
}
</style>
