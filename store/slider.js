export const state = () => ({
  isButtonLeftDisabled: true,
  isButtonRightDisabled: false
})

export const getters = {
  isButtonLeftDisabled: state => state.isButtonLeftDisabled,
  isButtonRightDisabled: state => state.isButtonRightDisabled
}

export const mutations = {
  setButtonLeftDisabled (state, value) {
    state.isButtonLeftDisabled = value
  },
  setButtonRightDisabled (state, value) {
    state.isButtonRightDisabled = value
  }
}
