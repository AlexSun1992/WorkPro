
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
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
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
    '~plugins/devextreme'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/router',
    '@nuxtjs/proxy'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt'
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
    }
  },
  proxy: {
    // Simple proxy
    '/wp-json': 'http://192.168.200.89:8080',
    '/free': 'http://172.17.0.33:8080',

  },
  server: {
    port: 8000, // default: 3000
    host: '0.0.0.0' // default: localhost
  }
}
