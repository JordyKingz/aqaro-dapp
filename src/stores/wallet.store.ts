import { defineStore } from 'pinia'

export const walletConnectionStore = defineStore('walletConnection', {
  state: () => ({
    connectedWallet: '',
    chainId: 0,
    connected: false,
  }),
  actions: {
    setConnectedWallet(wallet: string) {
      this.connectedWallet = wallet
    },
    setChainId(chainId: number) {
      this.chainId = chainId
    },
    setConnected(connected: boolean) {
      this.connected = connected
    },
    disconnect() {
        this.connectedWallet = ''
        this.chainId = 0
        this.connected = false
    }
  },
  getters: {
    getConnectedWallet: (state): string => state.connectedWallet,
    getChainId: (state): number => state.chainId,
    isConnected: (state): boolean => state.connected,
  }
});
