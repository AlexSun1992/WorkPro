Принцип работы BrandLoader

Компонент BrandLoader расположен в компоненте CabinetLayout.vue и в CardEditor.vue (для публичной зоны). 
Там же и описаны базовые правила отображения лоудера.

За отображение лоудера отвечает 2 параметра, которые находятся в сторе "ui/loader/":
 - showLoader (boolean) - определяет, нужно ли вообще показывать лодар или нет
 - getShowLoader (number) - представляет собой счётчик который хранит число активных в данный момент запросов. 
Счётчик формирует с помощью axios interceptor.

   
Что бы принудительно активировать лоадер, рекомендуется вызвать this.$store.commit('data_card/setIsShowLoader', true);
и не забыть this.$store.commit('data_card/setIsShowLoader', false) например в хуке beforeDestroy для декативации. 
Так же можно активировать лоадер непосредственно через вызов сеттера самого лоудера
this.$store.commit('ui/loader/setIsShowLoader', true) который тоже нужно вызвать дополнительно с параметром false, 
чтобы лоадер не отображался там где не надо. Однако, использование this.$store.commit('ui/loader/setIsShowLoader', true)
не рекомендуется, так как это метод более низкого уровня, который может быть перебит правилом из CabinetLayout.vue
