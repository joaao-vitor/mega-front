<script>
import TextArea from '../components/TextArea.vue'
import Button from '../components/Button.vue'
import Input from '../components/Input.vue'

import { ref, watch, onBeforeMount } from 'vue'

import { UserIcon, GlobeAmericasIcon, CalendarIcon, InboxArrowDownIcon } from '@heroicons/vue/24/outline'
import { useUserStore } from '../stores/UserStore'
import axios from 'axios'
import { storeToRefs } from 'pinia'
import { useNotification } from '../utils/notify'
export default {
    components: {
        TextArea, Button, Input
    },
    setup() {
        const { fetchUser: storeFetchUser } = useUserStore()
        const { user } = storeToRefs(useUserStore())

        const { showError, showSuccess } = useNotification()

        const name = ref('')
        const isNameValid = ref({
            isValid: name.value.length > 0,
            error: 'Insira um nome válido'
        })
        watch(name, () => isNameValid.value.isValid = name.value.length > 0)

        const city = ref('')
        const isCityValid = ref({
            isValid: true,
            error: ''
        })

        const state = ref('')
        const isStateValid = ref({
            isValid: state.value.length < 2,
            error: 'Insira um estado válido'
        })
        watch(state, () => isStateValid.value.isValid = state.value.length < 2)

        const birthDay = ref('')
        const isBirthDayValid = {
            isValid: true,
            error: ''
        }


        const imgProfile = ref(null)
        const isImgValid = ref({
            isValid: imgProfile.value,
            error: 'Insira uma imagem sua',
        })
        const onImgChange = (e) => {
            const img = e.target.files[0]
            if (!img) return false

            const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif']
            const extension = img.name.split('.').pop().toLowerCase()

            isImgValid.value.isValid = allowedExtensions.includes(extension)
            isImgValid.value.isValid
                ? (imgProfile.value = img)
                : (imgProfile.value = null)
        }

        const fetchUser = async () => {
            try {
                const { data: userData } = await axios.get(`${import.meta.env.VITE_API_URL}/user/${user.value.usuarioid}`)
                name.value = userData.nome
                city.value = userData.cidade
                state.value = userData.estado
                birthDay.value = userData.data_nascimento
            } catch (error) {
                console.log(error)
            }
        }

        const handleSubmit = async () => {
            try {
                const formData = new FormData()
                formData.append('image', imgProfile.value)
                const {
                    data: {
                        image: { src },
                    },
                } = await axios.post(
                    `${import.meta.env.VITE_API_URL}/jogo/upload`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                )

                const user = {
                    nome: name.value,
                    cidade: city.value,
                    estado: state.value,
                    data_nascimento: birthDay.value,
                    imgurl: src
                }
                const { data: userData } = await axios.put(`${import.meta.env.VITE_API_URL}/user`, user)
                showSuccess(userData.msg)
                storeFetchUser()
                await fetchUser()
            } catch (error) {
                showError('Ocorreu um erro ao atualizar os dados')
                console.log(error)
            }
        }
        onBeforeMount(async () => {
            await fetchUser()
        })
        watch(user, fetchUser)
        return {
            name, isNameValid,
            city, isCityValid,
            state, isStateValid,
            birthDay, isBirthDayValid,
            imgProfile, isImgValid, onImgChange,
            UserIcon, GlobeAmericasIcon, CalendarIcon, InboxArrowDownIcon,
            handleSubmit
        }
    }

}
</script>
<template>
    <div class="min-h-screen px-12 py-24 flex justify-center items-center">
        <div class="lg:w-6/12">
            <h1 class="text-white opacity-80 text-3xl font-bold mb-8">Configurações da conta</h1>
            <section class="w-full flex flex-col gap-5">
                <Input type="text" :icon="UserIcon" placeholder="Insira o seu nome" v-model="name"
                    :validate="isNameValid" />
                <Input type="text" :icon="GlobeAmericasIcon" placeholder="Insira a sua cidade" v-model="city"
                    :validate="isCityValid" />
                <Input type="text" :icon="GlobeAmericasIcon" placeholder="Insira o seu estado (sigla)" v-model="state"
                    :validate="isStateValid" />
                <Input type="date" :icon="CalendarIcon" v-model="birthDay" :validate="isBirthDayValid" />

                <Input type="file" :icon="InboxArrowDownIcon" placeholder="Insira a imagem do jogo" :validate="isImgValid"
                    @change="onImgChange" />
                <div class="flex justify-end gap-5">
                    <Button class="bg-green-600 self-end" @click="handleSubmit">Enviar</Button>
                </div>
            </section>
        </div>
    </div>
</template>