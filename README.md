# Личный кабинет v2
Описание проекта находится по ссылке https://confluence.reso.ru/pages/viewpage.action?pageId=27132060
# Окружение разработчика ЛК2
Для запуска проекта локально необходимо
- Установить Node.js 18 https://nodejs.org/
- Задать зеркало npm-репозитория `npm config set registry https://nexus.reso.ru/repository/npm/`
- Установить зависимости в директории components-vue2 `cd components-vue2 && npm install`
- Установить зависимости в корневой директории `cd .. && npm install`
- В корневой директории запустить `npm run dev`, страница авторизации будет доступна по адресу http://localhost:8000/login

# Окружение разработчика компонентов сайта
Для разработки компонентов сайта необходимо
- Выполнить все действия для "Окружения разработчика ЛК2" в том числе запуск сервера
- Перейти в директорию components-vue2 `cd components-vue2`
- Запустить локальный сервер разработки компонентов `npm run serve`
- Прописанные в файле components-vue2\public\index.html компоненты будут доступны по адресу http://localhost:8080/
