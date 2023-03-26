import { defineStore } from 'pinia'

export const useAuthStore = defineStore('authentication', {
    state: () => ({
        authenticated: false,
    }),
    actions: {
        login(data: any) {
            // if type string token already set
            if (typeof data !== 'string') {
                localStorage.setItem('token', data.jwtToken);
                localStorage.setItem('refreshtoken', data.refreshToken);
            }

            this.authenticated = true;
        },
        logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshtoken');
            this.authenticated = false;
        }
    },
    getters: {
        getAuth: (state) => state.authenticated,
    },
})
