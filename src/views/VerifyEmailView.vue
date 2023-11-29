<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from '../components/Button.vue'
import axios from 'axios'
import { useNotification } from '../utils/notify'

export default {
    components: {
        Button,
    },
    setup() {
        const router = useRouter();
        const token = ref('');
        const email = ref('');

        const { showError, showSuccess } = useNotification()
        onMounted(async () => {
            token.value = router.currentRoute.value.query.token || ''
            email.value = router.currentRoute.value.query.email || ''
        });
        const handleClick = async () => {


            if (email && token) {
                const apiUrl = `${import.meta.env.VITE_API_URL}/auth/verify-email`
                try {
                    const res = await axios.post(apiUrl, {
                        email: email.value,
                        verificationToken: token.value,
                    })
                    showSuccess('Email confirmado!')

                } catch (error) {
                    const msg = error.response.data.msg
                    showError(msg)
                }
            }
        }

        return {
            handleClick,
        }
    },
}
</script>

<template>
    <section class="h-screen flex flex-col justify-center items-center text-white text-opacity-80 gap-4">
        <h1 class="text-3xl font-bold">Bem vindo!</h1>
        <h4 class="text-sm font-semibold w-60 text-center">
            Clique no botão abaixo para confirmar o seu email!
        </h4>
        <Button class="bg-green-800" @click="handleClick">Verificar Email</Button>
    </section>
</template>
