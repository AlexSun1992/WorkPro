# Личный кабинет v2

Описание проекта находится по ссылке https://confluence.reso.ru/pages/viewpage.action?pageId=27132060

# Окружение разработчика ЛК2

Для запуска проекта локально необходимо

- Установить Node.js 20 https://nodejs.org/
- Задать зеркало npm-репозитория `npm config set registry https://nexus.reso.ru/repository/npm/`
- Установить зависимости в директории components-vue2 `cd components-vue2 && npm install`
- Установить зависимости в корневой директории `cd .. && npm install`
- В корневой директории запустить `npm run dev`, страница авторизации будет доступна по адресу http://localhost:8000/login

# Окружение разработчика компонентов сайта

Для разработки компонентов сайта необходимо

- Выполнить все действия для "Окружения разработчика ЛК2" в том числе запуск сервера
- Перейти в директорию components-vue2 `cd components-vue2`
- Запустить локальный сервер разработки компонентов `npm run serve`
- Прописанные в файле [index.html](components-vue2/public/index.html#L113) компоненты (в виде `<component-header></component-header>` и другие) будут доступны по адресу http://localhost:8080/

# Переключение между базами данных

Окружение разработчика ЛК2 можно подключить к разным базам данных [nuxt.config.js](nuxt.config.js#L112)

- `npm run dev` сервисы подключаются к БД Actuary, API https://mobiletest.reso.ru
- `npm run dev-prod` - сервисы подключаются к БД RESO-M, API https://mobile.reso.ru и https://mobile2.reso.ru (в продакшене используется https://lk.reso.ru)
