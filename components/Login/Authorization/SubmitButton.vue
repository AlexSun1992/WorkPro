<template>
  <button
    type="submit"
    :disabled="disabled"
  >
    <slot> Далее </slot>
  </button>
</template>

<script>
export default {
  name: "SubmitButton",

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style scoped>
button {
  text-align: center;
  padding: 0;
  border-radius: 15px;
  font-size: 1rem;
  line-height: 50px;
  box-sizing: border-box;
  font-weight: 700;
  white-space: nowrap;
  display: block;
  position: relative;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 54px;
  margin-top: 1rem;
  width: 100%;
  border: 2px solid #fe7333;
  color: #fe7333;
  background: transparent;
}
button:hover {
  background-color: #fff1eb;
}
button:disabled {
  background-color: transparent;
  color: #c3c3c3;
  border: 2px solid #f0f0f0;
  pointer-events: none;
}
</style>
