import axios from 'axios'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
    state: () => ({
        user: null,
    }),
    actions: {
        removeUser() {
            this.user = null
        },
        saveUser(user) {
            this.user = user
        },
        async fetchUser() {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_URL}/user/me`
                )
                this.saveUser(data.user)
            } catch (error) {
                this.removeUser()
            }
        },
        async logoutUser() {
            try {
                await axios.delete(
                    `${import.meta.env.VITE_API_URL}/auth/logout`
                )
                this.removeUser()
            } catch (error) {
                console.log(error)
            }
        },
    },
})
