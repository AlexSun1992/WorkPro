<template>
  <div class="map-balloon">
    <div class="map-balloon-title">
      {{ data.SLPU }}
    </div>
    <div class="map-balloon-adress">{{ data.SADDRESS }}</div>
    <button id="btn" type="button" class="btn-secondary mt-4">Выбрать</button>
  </div>
</template>

<script>
export default {
  name: "BaloonMap",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
};
</script>

<style scoped>
.map-balloon {
  padding: 10px;
}
.map-balloon-title {
  font-feature-settings: "pnum" on, "lnum" on;
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.2;
  color: #292929;
  margin-bottom: 1.5rem;
}
.map-balloon-adress {
  font-weight: 400;
  font-size: 1.25rem;
  line-height: 1.2;
  color: #292929;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAxNiAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTguMDAwNDkgMy45OTk1MUM1Ljc5NDQ5IDMuOTk5NTEgNC4wMDA0OSA1Ljc5MzUxIDQuMDAwNDkgNy45OTk1MUM0LjAwMDQ5IDEwLjIwNTUgNS43OTQ0OSAxMS45OTk1IDguMDAwNDkgMTEuOTk5NUMxMC4yMDY1IDExLjk5OTUgMTIuMDAwNSAxMC4yMDU1IDEyLjAwMDUgNy45OTk1MUMxMi4wMDA1IDUuNzkzNTEgMTAuMjA2NSAzLjk5OTUxIDguMDAwNDkgMy45OTk1MVpNOC4wMDA0OSA5Ljk5OTUxQzYuODk3NDkgOS45OTk1MSA2LjAwMDQ5IDkuMTAyNTEgNi4wMDA0OSA3Ljk5OTUxQzYuMDAwNDkgNi44OTY1MSA2Ljg5NzQ5IDUuOTk5NTEgOC4wMDA0OSA1Ljk5OTUxQzkuMTAzNDkgNS45OTk1MSAxMC4wMDA1IDYuODk2NTEgMTAuMDAwNSA3Ljk5OTUxQzEwLjAwMDUgOS4xMDI1MSA5LjEwMzQ5IDkuOTk5NTEgOC4wMDA0OSA5Ljk5OTUxWk03Ljk5NjQ5IC0wLjAwMDQ4ODI4MUMzLjQzNzQ5IC0wLjAwMDQ4ODI4MSAwLjAwMDQ4ODI4MSAzLjQzODUxIDAuMDAwNDg4MjgxIDcuOTk5NTFDMC4wMDA0ODgyODEgMTQuMzI1NSA0LjgxMjQ4IDE4LjI1OTUgNi44ODE0OCAxOS42NTY1QzcuMjE5NDggMTkuODg1NSA3LjYwODQ5IDIwLjAwMDUgNy45OTY0OSAyMC4wMDA1QzguMzgzNDkgMjAuMDAwNSA4Ljc3MDQ5IDE5Ljg4NjQgOS4xMDg0OSAxOS42NTg0QzExLjE4MDUgMTguMjU5NCAxNS45OTk1IDE0LjMyMzUgMTUuOTk5NSA3Ljk5OTUxQzE2LjAwMDUgMy40Mzg1MSAxMi41NTk1IC0wLjAwMDQ4ODI4MSA3Ljk5NjQ5IC0wLjAwMDQ4ODI4MVpNOC4wMDE1IDE3Ljk5OTVDNi4xOTc1IDE2Ljc4MDUgMi4wMDA0OSAxMy4zNjY1IDIuMDAwNDkgNy45OTk1MUMyLjAwMDQ5IDQuNTIyNTEgNC41MjE0OSAxLjk5OTUxIDcuOTk2NDkgMS45OTk1MUMxMS40MTk1IDEuOTk5NTEgMTQuMDAwNSA0LjU3ODUxIDE0LjAwMDUgNy45OTk1MUMxNC4wMDA1IDEzLjM2MzUgOS43OTc0OSAxNi43ODA1IDguMDAxNSAxNy45OTk1WiIgZmlsbD0iI0E0QTRBNCIvPgo8L3N2Zz4K);
  background-repeat: no-repeat;
  padding-left: 24px;
}
</style>
<style>
ymaps[class*="-balloon_layout_normal "] {
  background: #fff;
  border: 1px solid #dfe3e5;
  box-sizing: border-box;
  border-radius: 30px;
  overflow: hidden;
  box-sizing: border-box !important;
}

.ymaps-2-1-79-balloon__close-button {
  display: block;
  width: 20px;
  height: 30px;
  cursor: pointer;
  background: transparent;
  opacity: 1;
}

ymaps[class*="balloon__close-button"]:after,
ymaps[class*="balloon__close-button"]:before {
  position: absolute;
  width: 15px;
  height: 2px;
  content: "";
  top: 5px;
  left: 0;
  background: #292929;
  transform: rotate(45deg);
}
ymaps[class*="balloon__close-button"]:after {
  transform: rotate(-45deg);
}
ymaps[class*="balloon__close-button"] {
  position: absolute;
  width: 17px;
  height: 15px;
  right: 10px;
  display: block;
  border: 0;
  background: 0 0;
  top: 10px;
  padding: 0;
  cursor: pointer;
  opacity: 1;
}
.ymaps-2-1-79-balloon__tail {
  display: none !important;
}
</style>
