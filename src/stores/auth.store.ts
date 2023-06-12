import { defineStore } from 'pinia'

export const useAuthStore = defineStore('authentication', {
    state: () => ({
        authenticated: false,
        bearerToken: '',
    }),
    actions: {
        login(data: any) {
            // if type string token already set
            if (typeof data !== 'string') {
                localStorage.setItem('aqaro.auth.token', data.jwtToken);
                localStorage.setItem('aqaro.auth.refreshToken', data.refreshToken);
            }

            this.authenticated = true;
        },
        logout() {
            localStorage.removeItem('aqaro.auth.token');
            localStorage.removeItem('aqaro.auth.refreshToken');
            this.authenticated = false;

            this.bearerToken = '';
        },
        setToken(token: string) {
            this.bearerToken = token;
        }
    },
    getters: {
        getAuth: (state) => state.authenticated,
        getToken: (state) => {
            return state.bearerToken;
        }
    },
})
