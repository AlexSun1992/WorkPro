FROM node:18.12 AS preparation
WORKDIR /home/node/app
COPY package*.json ./
RUN npm config set registry https://nexus.reso.ru/repository/npm/ && npm ci
COPY components-vue2/package*.json ./components-vue2/
RUN (cd components-vue2 && npm ci)
COPY . ./
RUN npm test && cd components-vue2 && npm run component

FROM node:18.12
WORKDIR /home/node/app
COPY package*.json ./
RUN npm config set registry https://nexus.reso.ru/repository/npm/ && npm ci
COPY --from=preparation /home/node/app/static/js ./static/js
ENV TZ=Europe/Moscow
COPY . ./
ARG APP_VERSION
ENV APP_VERSION=$APP_VERSION
ARG APP_VERSION_DATE
ENV APP_VERSION_DATE=$APP_VERSION_DATE
RUN npm run build
EXPOSE 8000
CMD [ "npm", "start" ]
HEALTHCHECK --interval=12s --timeout=12s --start-period=30s --retries=3 CMD curl --fail http://localhost:8000/api/healthcheck || exit 1
