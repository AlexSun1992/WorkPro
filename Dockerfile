FROM node:16.13 AS preparation
WORKDIR /home/node/app
COPY package*.json ./
RUN npm config set registry https://nexus.reso.ru/repository/npm/ && npm ci
COPY components-vue2/package*.json ./components-vue2/
RUN (cd components-vue2 && npm ci)
COPY . ./
RUN npm test && cd components-vue2 && npm run component

FROM node:16.13
WORKDIR /home/node/app
COPY package*.json ./
RUN npm config set registry https://nexus.reso.ru/repository/npm/ && npm ci
COPY --from=preparation /home/node/app/static/js ./static/js
ENV TZ=Europe/Moscow
COPY . ./
RUN npm run build
ARG APP_VERSION
ENV APP_VERSION=$APP_VERSION
EXPOSE 8000
HEALTHCHECK --interval=12s --timeout=12s --start-period=30s --retries=3 CMD [ "curl --fail http://localhost:8000/api/healthcheck || exit 1" ]
CMD [ "npm", "start" ]
