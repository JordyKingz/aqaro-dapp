import { defineStore } from 'pinia'
import {axiosInstance} from "@/lib/http/axios.client";

type WalletAuthDto = {
    signature: string;
    address: string;
}

export const tokenStore = defineStore('aqaroToken', {
  state: () => ({
    balance: '',
  }),
  actions: {
    setTokenBalance(balance: string) {
      this.balance = balance
    },
  },
  getters: {
    getBalance: (state): string => state.balance,
  }
});
