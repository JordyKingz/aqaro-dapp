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
        async getAll() {
            return await axiosAuthInstance.get('/proposal/get-all/1/100');
        },
        async getById(id: string) {
            return await axiosAuthInstance.get(`/proposal/${id}`);
        },
        async likeProposal(id: string) {
            return await axiosAuthInstance.post(`/proposal/${id}/like`);
        },
        async dislikeProposal(id: string) {
            return await axiosAuthInstance.post(`/proposal/${id}/dislike`);
        }
    },
    getters: {
        getProposals: (state) => state.proposals,
    },
})
