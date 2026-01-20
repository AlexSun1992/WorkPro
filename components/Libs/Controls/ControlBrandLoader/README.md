## Принцип работы BrandLoader

Компонент BrandLoader расположен в компоненте CabinetLayout.vue и в CardEditor.vue (для публичной зоны).
Там же и описаны базовые правила отображения лоудера.

За отображение лоудера отвечают 2 параметра, которые находятся в сторе "ui/loader/":

- showLoader (boolean) - определяет, нужно ли вообще показывать лодар или нет.
- getShowLoader (number) - представляет собой счётчик, который хранит число активных в данный момент запросов.
  Счётчик формируется с помощью axios interceptor.

Чтобы принудительно активировать лоадер, рекомендуется вызвать this.$store.commit('ui/loader/setShowLoader', true);
и не забыть this.$store.commit('ui/loader/setShowLoader', false), например в хуке beforeDestroy для деактивации.
