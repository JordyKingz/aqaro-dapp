import { defineStore } from 'pinia'
import {axiosAuthInstance, axiosFormDataInstance, axiosInstance} from "@/lib/http/axios.client";

export const proposalStore = defineStore('proposals', {
    state: () => ({
        proposals: <any>[],
        createdProposal: <any>{},
    }),
    actions: {
        async listProposalService(dto: FormData) {
            return await axiosFormDataInstance.post('/proposal/create' , dto);
        },
    },
    getters: {
        getProposals: (state) => state.proposals,
    },
})
