export default function (param) {
  param.$axios.onRequest(config => {
    config.headers.common['x-os'] = "Windows"
  })
}
