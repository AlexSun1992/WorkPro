export default function ({$axios, app, store}) {
    $axios.onError(error => {
        store.commit('setAxiosError', error)
    })
}