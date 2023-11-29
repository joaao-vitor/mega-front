import { defineStore } from 'pinia'

export const useModalLoginStore = defineStore('modalLoginStorage', {
    state: () => ({
        isVisible: false
    }),
    actions: {
        showModal() {
            this.isVisible = true
        },
        hideModal() {
            this.isVisible = false
        },
    },
})
