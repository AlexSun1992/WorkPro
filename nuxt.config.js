
module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: 'https://www.google.com/recaptcha/api.js?render=6LeO2dgUAAAAAOCANdOMWTfUW0eLjluo7UKC366h' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3ea662' },
  /*
  ** Global CSS
  */
  css: [
    /* Import Font Awesome Icons Set */
    '~/node_modules/flag-icon-css/css/flag-icon.min.css',
    /* Import Font Awesome Icons Set */
    '~/node_modules/font-awesome/css/font-awesome.min.css',
    /* Import Simple Line Icons Set */
    '~/node_modules/simple-line-icons/css/simple-line-icons.css',
    { src: '~/assets/scss/style.scss', lang: 'scss' }
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    // '~plugins/devextreme',
    '~/plugins/captcha.js',
    '~/plugins/mask.js',
    '~/plugins/validate'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/router',
    '@nuxtjs/proxy',
    '@nuxt/typescript-build'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    ['@nuxtjs/axios', { proxy: true }],
    '@nuxtjs/auth'
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    vendor: ['axios'],
    extend (config, ctx) {
      config.resolve.alias["vue"] = "vue/dist/vue.common";
    }
  },
  proxy: {
    // Simple proxy
    '/wp-json': 'http://192.168.200.89:8080',
    '/free': 'http://172.17.0.33:8080',
    // '/am': 'http://172.17.0.33:8080',
    '/am': 'https://mobile2.reso.ru'
  },

  serverMiddleware: [
    '~/api/index.js',
  ],

  auth: {
    strategies: {
      local: {
        _scheme: 'refresh',
        autoRefresh: {
          enable: true
        },
        dataRefreshToken: 'REFRESH_TOKEN',
        clientId: false,
        dataClientId: false,
        grantType: false,
        dataGrantType: false,
        token: {
          property: 'ACCESS_TOKEN',
          maxAge: 1800
        },
        refreshToken: {
          property: 'REFRESH_TOKEN'
        },
        user: '',
        endpoints: {
          // login: { url: 'http://localhost:8000/api/authorize', method: 'post' },
          login: { url: '/am/auth/v2/authorize', method: 'post' },
          refresh: { url: '/am/auth/v2/token_refresh', method: 'post' },
          // user: { url: 'http://localhost:8000/api/userinfo', method: 'get' },
          user: { url: '/am/main/v2/userinfo', method: 'get' },
          logout: false
        }
      }
    },
    resetOnError: true,
    fullPathRedirect: true,
    redirect: {
      login: false,
      logout: '/',
      home: false,
      user: false,
    }
  },
  server: {
    port: 8000, // default: 3000
    host: '0.0.0.0' // default: localhost
  }
}
