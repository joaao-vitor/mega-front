<script>
import { ref } from 'vue'
import Modal from '../Modal.vue'
import Button from '../Button.vue'
import axios from 'axios'
import Loading from '../Loading.vue'
import Input from '../Input.vue'
import TextArea from '../TextArea.vue'

import { useUserStore } from '../../stores/UserStore'
import { Bars3Icon } from '@heroicons/vue/24/solid'
import { StarIcon as StarFull } from '@heroicons/vue/24/solid'
import { StarIcon as StarEmpty } from '@heroicons/vue/24/outline'

import { useNotification } from '../../utils/notify'
export default {
    props: {
        modalReview: {
            type: Boolean,
            required: true
        },
        game: {
            type: Number,
            required:true
        }
    },
    setup(props, { emit }) {
        const { showError, showSuccess } = useNotification()
        const loading = ref(false)
        const submitted = ref(false)

        const reviewDescription = ref('')
        const validReviewDescription = ref({
            isValid: true,
            error: 'A review não deve ser deixada vazia',
        })

        const hoveringStar = ref(0)
        const selectedRating = ref(0)
        const validateDescription = () => validReviewDescription.value.isValid = reviewDescription.value.length > 0
        const closeModal = () => {
            resetValues()
            emit('close')
        }
        const handleSubmit = async () => {
            if(!validReviewDescription.value.isValid){
                showError('Insira uma descrição válida!')
                return
            }
            const review = {
                descricao: reviewDescription.value,
                classificacao:  selectedRating.value,
                jogoid: props.game
            }

            try {
                console.log(review)
                loading.value = true
                const { data: dataReview } = await axios.post(`${import.meta.env.VITE_API_URL}/review`, review)
                showSuccess(dataReview.msg)
                submitted.value = true
                loading.value = false

                setTimeout(() => {
                    emit('refreshReview')
                    resetValues()
                    closeModal()
                }, 2000);
            } catch (error) {
                const msg = error.response.data.msg || 'Ocorreu um erro ao enviar a avaliação!'
                showError(msg)
                resetValues()
            }
        }
        const resetValues = () => {
            hoveringStar.value = 0
            selectedRating.value = 0
            reviewDescription.value = ''
            loading.value = false
            submitted.value = false
        }
        return {
            closeModal,
            loading,
            submitted,
            Bars3Icon,
            reviewDescription,
            validReviewDescription,
            validateDescription,
            handleSubmit,
            hoveringStar,
            selectedRating
        }
    },
    components: {
        Button, Input, Loading, TextArea, Modal, StarFull, StarEmpty
    },
}
</script>

<template>
    <Modal :modalShown="modalReview" @close="closeModal" class="">
        <template #content v-if="loading">
            <div class="flex items-center justify-center">
                <Loading />
            </div>
        </template>
        <template #content v-if="submitted && !loading">
            <div class="flex text-white flex-col items-center justify-center">
                <h1 class="text-xl text-green-600 font-bold">
                    Review enviada com sucesso!
                </h1>
            </div>
        </template>
        <template #header v-if="!submitted && !loading">
            <h2 class="text-white text-opacity-90 font-semibold text-xl mb-5">
                Escreva sua review!
            </h2>
            <hr class="border border-zinc-700 border-opacity-80 w-full mt-5 mb-5" />
        </template>
        <template #content v-if="!submitted && !loading">
            <p class="text-white opacity-80 text-sm -mb-2">Selecione sua avaliação:</p>
            <div class="flex mb-2">
                <StarFull v-for="i in 5" class="w-6 hover:text-yellow-500" :class="{ 'text-zinc-800': hoveringStar < i && selectedRating < i, 'text-yellow-500': hoveringStar >= i || selectedRating >= i}" @click="selectedRating = i" @mouseover="hoveringStar = i" @mouseleave="hoveringStar=0" />
            </div>
            <TextArea @input="validateDescription" placeholder="Escreva a sua review" :icon="Bars3Icon"
                :validate="validReviewDescription" v-model="reviewDescription" />
        </template>
        <template #footer v-if="!submitted && !loading">
            <div class="flex gap-2 justify-end w-full">
                <Button class="font-normal w-24 bg-zinc-800" @click="handleSubmit">Cancelar</Button>
                <Button class="font-normal w-24 bg-green-500" @click="handleSubmit">Enviar</Button>
            </div>
        </template>
    </Modal>
</template>
