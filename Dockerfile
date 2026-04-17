FROM node:20.9-alpine AS preparation
COPY package.json package-lock.json ./
RUN ["node", "-e", "\
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));\
    const pkgLock = JSON.parse(fs.readFileSync('package-lock.json', 'utf-8'));\
    fs.writeFileSync('package.json', JSON.stringify({ ...pkg, version: '0.0.0' }));\
    fs.writeFileSync('package-lock.json', JSON.stringify({ ...pkgLock, packages: {...pkgLock.packages, '': {...pkgLock.packages[''], version: '0.0.0'}}, version: '0.0.0' }));\
    "]

FROM node:20.9 AS preparation_js
WORKDIR /home/node/app
COPY --from=preparation package.json package-lock.json ./
RUN npm config set registry https://nexus.reso.ru/repository/npm/ && npm ci
COPY . ./
RUN npm test && npm run build:wc

FROM node:20.9
WORKDIR /home/node/app
COPY --from=preparation package.json package-lock.json ./
RUN npm config set registry https://nexus.reso.ru/repository/npm/ && npm ci
COPY --from=preparation_js /home/node/app/static/js ./static/js
ENV TZ=Europe/Moscow
COPY .env.production .env
COPY . ./
ARG APP_VERSION
ENV APP_VERSION=$APP_VERSION
ARG APP_VERSION_DATE
ENV APP_VERSION_DATE=$APP_VERSION_DATE
ARG APP_VERSION_BRANCH
ENV APP_VERSION_BRANCH=$APP_VERSION_BRANCH
RUN npm run build
EXPOSE 8000
CMD [ "npm", "start" ]
HEALTHCHECK --interval=12s --timeout=12s --start-period=30s --retries=3 CMD curl --fail http://localhost:8000/api/healthcheck || exit 1
