<script>
import Button from '../components/Button.vue'
import axios from 'axios'
//import notify from '../utils/notify.js'
export default {
    //mixins: [notify],
    components: {
        Button,
    },
    methods: {
        async handleClick() {
            const { email, token } = this.$route.query

            if (email && token) {
                const apiUrl = `${
                    import.meta.env.VITE_API_URL
                }/auth/verify-email`
                try {
                    const res = await axios.post(apiUrl, {
                        email,
                        verificationToken: token,
                    })
                    //this.showSuccess(res.data.msg)
                } catch (error) {
                    const msg = error.response.data.msg
                    //this.showError(msg)
                }
            }
        },
    },
}
</script>
<template>
    <section
        class="h-screen flex flex-col justify-center items-center text-white text-opacity-80 gap-4"
    >
        <h1 class="text-3xl font-bold">Bem vindo!</h1>
        <h4 class="text-sm font-semibold w-60 text-center">
            Clique no botão abaixo para confirmar o seu email!
        </h4>
        <Button class="bg-green-800" @click="handleClick"
            >Verificar Email</Button
        >
    </section>
</template>
