## Принцип работы BrandLoader

Компонент BrandLoader расположен в компоненте CabinetLayout.vue и в CardEditor.vue (для публичной зоны).
Там же и описаны базовые правила отображения лоудера.

За отображение лоудера отвечают 2 параметра, которые находятся в сторе "ui/loader/":

- showLoader (boolean) - определяет, нужно ли вообще показывать лодар или нет.
- getShowLoader (number) - представляет собой счётчик, который хранит число активных в данный момент запросов.
  Счётчик формируется с помощью axios interceptor.

Что бы принудительно активировать лоадер, рекомендуется вызвать this.$store.commit('data_card/setShowLoader', true);
и не забыть this.$store.commit('data_card/setIsShowLoader', false) например в хуке beforeDestroy для декативации.
Так же можно активировать лоадер непосредственно через вызов сеттера самого лоудера
this.$store.commit('ui/loader/setShowLoader', true) который тоже нужно вызвать дополнительно с параметром false
в хуку beforeDestroy, чтобы лоадер не отображался там где не надо. Однако, использование 
this.$store.commit('ui/loader/setShowLoader', true) не рекомендуется, так как это метод более низкого уровня, 
который может быть перебит.
Для EventHandler в компоненте прослушивается событие setBrandLoaderState которое можно
зарегистрировать в EventHandler через new CustomEvent и далее в нужноый момент выполнить
document.dispatchEvent().
