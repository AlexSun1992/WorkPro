jest.mock('@/node_modules/@nuxtjs/auth/lib/module/plugin');
import { shallowMount } from '@vue/test-utils';
import LoginModal from '@/components/Login/LoginModal.vue'

describe('LoginModal', () => {

    const $auth = {
        loginWith: jest.fn()
    }

    const user = {
        login: '9162641917',
        password: 'r12345'
    }

    const event = {
        preventDefault: jest.fn()
    }

    const wrapper = shallowMount(LoginModal, {
        data: function() {
            return {
                user
            }
        },
        propsData: {
            onAuth: jest.fn()
        }
    })

    wrapper.vm.$auth = $auth;
    wrapper.vm.$refs['auth-modal'].hide = jest.fn();
    wrapper.vm.$refs['auth-modal'].show = jest.fn();

    it('showLoginModal', () => {
        expect(wrapper.find({ref: 'auth-modal'}).exists()).toBe(true);
        wrapper.vm.showLoginModal();
        expect(wrapper.vm.$refs['auth-modal'].show).toHaveBeenCalled();
    })

    it('login', async () => {
        await wrapper.vm.login(event);
        expect(wrapper.vm.errorMessage).toBeNull()
        expect(event.preventDefault).toHaveBeenCalled();
        expect(wrapper.vm.$auth.loginWith).toHaveBeenCalled();
        expect(wrapper.vm.$refs['auth-modal'].hide).toHaveBeenCalled();
        expect(wrapper.vm.onAuth).toHaveBeenCalled();
    })
})