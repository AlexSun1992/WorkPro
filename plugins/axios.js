export default function ({ $axios, redirect, store }) {
  $axios.onError(error => {
    if (error?.response?.status == 401) {
      store.commit('resetUser')
      redirect('/login')
    } else {
      store.commit('setAxiosError', error)
    }
  })
}
