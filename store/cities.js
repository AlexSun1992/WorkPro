export const state = () => ({
    city: null
})

export const actions = {
    async getCity({ commit }, params) {
        try {
            debugger
            let { data: { ip } } = await this.$axios.get('https://api.ipify.org/?format=json');
            let { data: { location: { value } } } = await this.$axios.get(`https://dadata.reso.ru/suggestions/api/4_1/rs/iplocate/address?ip=${ip}`);
            commit('setCity', value)
        } catch (e) {
            console.log(e);
        }
    },
}

export const mutations = {
    setCity(state, params) {
      state.city = params;
    }
  }
  
