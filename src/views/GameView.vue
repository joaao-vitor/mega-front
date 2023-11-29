<script>
import { PlusIcon, PlusSmallIcon, StarIcon as StarFull, TrashIcon, ChevronLeftIcon } from '@heroicons/vue/24/solid'
import { StarIcon as StarEmpty } from '@heroicons/vue/24/outline'
import Button from '../components/Button.vue';
import { onBeforeMount, ref, watch } from 'vue';
import axios from 'axios';

import ModalNewReview from '../components/Game/ModalNewReview.vue';
import { useUserStore } from '../stores/UserStore';
import { useNotification } from '../utils/notify';

import { storeToRefs } from 'pinia'
export default {
    components: {
        StarFull, StarEmpty, Button,
        PlusIcon,
        PlusSmallIcon,
        ModalNewReview,
        TrashIcon,
        ChevronLeftIcon
    },
    props: ['id'],
    setup(props, { emit }) {
        const { showError, showSuccess } = useNotification()
        const { user } = storeToRefs(useUserStore())
        const { id } = props
        const game = ref({})
        const reviews = ref([])
        const reviewAvg = ref(0)
        const modalShown = ref(false)
        const showAllReviews = ref(false)

        const displayedReviews = ref([])

        const catProgresso = ref([])
        watch(reviews, () => displayedReviews.value = reviews.value.slice(0, 3))
        const fetchGame = async () => {
            const { data: dataGame } = await axios.get(`${import.meta.env.VITE_API_URL}/jogos/${props.id}`)
            game.value = dataGame

            const { data: dataAvgReview } = await axios.get(`${import.meta.env.VITE_API_URL}/review/avg/${props.id}`)
            reviewAvg.value = parseInt(dataAvgReview.media) || 0
        }
        const fetchReviews = async () => {
            const { data: dataReviews } = await axios.get(`${import.meta.env.VITE_API_URL}/review/game/${props.id}`)
            reviews.value = dataReviews
        }
        const fetchCategories = async () => {
            const { data: dataCat } = await axios.get(`${import.meta.env.VITE_API_URL}/catProgresso`)
            catProgresso.value = dataCat.categories
        }
        const showModal = () => {
            modalShown.value = true
        }
        const deleteReview = async (id) => {
            try {
                const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/review/${id}`)
                showSuccess('Review deletada com sucesso!')
                fetchReviews()
            } catch (error) {
                const msg = error.response.data.msg || 'Ocorreu um erro ao enviar a avaliação!'
                showError(msg)
            }
        }
        const handleChangeCategory = async (e) => {
            const progressoid = parseInt(e.target.value)
            if (progressoid === 0) {
                const { data: dataDelProg } = await axios.delete(`${import.meta.env.VITE_API_URL}/userProgress`)
                showSuccess(`Progresso deletado com sucesso!`)
            } else {
                const { data: dataDelProg } = await axios.post(`${import.meta.env.VITE_API_URL}/userProgress`, { progressoid, jogoid: game.value.jogoid })
                showSuccess('Progresso atualizado com sucesso!')
            }
        }
        onBeforeMount(async () => {
            await fetchGame()
            await fetchReviews()
            await fetchCategories()
        })
        return {
            game,
            reviewAvg,
            reviews,
            showModal,
            modalShown,
            id,
            fetchReviews,
            user,
            deleteReview,
            displayedReviews,
            showAllReviews,
            catProgresso,
            handleChangeCategory
        }
    }
}
</script>
<template>
    <ModalNewReview :game="parseInt(id)" :modalReview="modalShown" @close="modalShown = false"
        @refreshReview="fetchReviews" />
    <div class="min-h-screen lg:h-screen w-full relative overflow-hidden">
        <div class=" bg-cover bg-center opacity-10 absolute top-0 left-0 w-full h-full "
            :style="`background-image: url(${game.imgurl});`">
        </div>
        <div v-if="!showAllReviews"
            class="relative font-inter md:p-20 p-10 py-24 flex flex-col h-full w-full justify-center md:items-center md:grid lg:grid-cols-2 lg:gap-20">
            <div class="md:flex md:flex-col md:justify-center">
                <select name="" id="" @change="handleChangeCategory"
                    v-if="!!user && new Date(game.data_lancamento) <= new Date()"
                    class="mb-4 w-36 px-4 py-2 text-xs border border-gray-300 bg-transparent rounded-full text-gray-300 font-semibold">

                    <option value="0" class="text-black-1000">Marcar como</option>
                    <option v-for="cat in catProgresso" :key="cat.progressoid" :value="cat.progressoid"
                        class="text-black-1000">{{ cat.nome }}</option>
                </select>
                <h1 class="text-white text-3xl font-bold">{{ game.nome }}</h1>
                <h4 class="text-white text-sm flex gap-2"><span v-for="emp in game.empresas">{{ emp.nome }}</span> - <span
                        class="opacity-80"> {{ new Date(game.data_lancamento).getFullYear() }} </span></h4>
                <div class="flex mt-2">
                    <StarFull class="w-6 text-yellow-400" v-for="i in reviewAvg" />
                    <StarEmpty class="w-6 text-yellow-400 text-opacity-50" v-for="i in 5 - reviewAvg" />
                </div>
                <div class="mt-2">
                    <p class="text-white text-sm">
                        {{ game.descricao }}
                    </p>
                </div>
            </div>
            <div class="mt-14 lg:mt-0 lg:justify-self-end lg:flex lg:flex-col lg:items-end w-full">
                <h1 class="text-white font-bold text-3xl opacity-70">Últimas Reviews</h1>
                <section class="flex flex-col gap-4 mt-4 w-full ">
                    <div v-if="reviews.length === 0">
                        <h3 class="text-md text-white font-semibold opacity-70 lg:text-right">Nenhuma review ainda, seja o
                            primeiro!</h3>
                    </div>
                    <div class="bg-black-400 group w-full h-32 rounded-lg" v-for="review in displayedReviews"
                        :key="review.avaliacaoid">
                        <div class="px-8 p-5  h-full w-full">
                            <div class="flex flex-col mt-2 h-full w-full">
                                <header class="flex justify-between w-full">
                                    <div class="flex">
                                        <span class="text-white text-sm font-semibold mr-2">
                                            {{ review.nome }}
                                        </span>
                                        <StarFull class="w-3.5 text-yellow-400 opacity-50 group-hover:opacity-100"
                                            v-for="i in review.classificacao" />
                                        <StarEmpty class="w-3.5 text-yellow-400 opacity-50 group-hover:opacity-100"
                                            v-for="i in 5 - review.classificacao" />
                                    </div>
                                    <div v-if="review.usuarioid === user?.usuarioid"
                                        @click="deleteReview(review.avaliacaoid)">
                                        <TrashIcon class="w-5 text-red-600 cursor-pointer hover:scale-110 transition-all" />
                                    </div>
                                </header>
                                <p
                                    class=" text-white h-full overflow-clip text-clip text-sm opacity-80 group-hover:opacity-100">
                                    {{ review.descricao }}
                                </p>
                            </div>
                        </div>

                    </div>
                    <div class="flex gap-3 self-end">
                        <Button class="text-white bg-yellow-600 flex gap-2 items-center" @click="showModal"
                            v-if="!!user && new Date(game.data_lancamento) <= new Date()">
                            <PlusIcon class="w-4" />
                            Nova Review
                        </Button>

                        <Button class="text-white border opacity-70 border-zinc-400" @click="showAllReviews = true">
                            Ver Todas
                        </Button>
                    </div>
                </section>
            </div>


        </div>
        <div v-if="showAllReviews" class="relative font-inter md:p-20 p-10 py-24 flex flex-col w-full">
            <header class="flex justify-between">
                <div class="flex gap-2">
                    <div class="w-6 text-white opacity-80 hover:scale-115 transition-all cursor-pointer flex items-center"
                        @click="showAllReviews = false">
                        <ChevronLeftIcon />
                    </div>
                    <h1 class="text-white text-3xl font-bold opacity-80">Todas as reviews</h1>
                </div>
                <div class="flex gap-3 self-end">
                    <Button v-if="user" class="text-white bg-yellow-600 flex gap-2 items-center" @click="showModal">
                        <PlusIcon class="w-4" />
                        Nova Review
                    </Button>
                </div>
            </header>
            <section class="flex flex-col gap-4 mt-4 w-full ">
                <div v-if="reviews.length === 0">
                    <h3 class="text-md text-white font-semibold opacity-70 lg:text-right">Nenhuma review ainda, seja o
                        primeiro!
                    </h3>
                </div>
                <div class="bg-black-400 group w-full h-32 rounded-lg" v-for="review in reviews" :key="review.avaliacaoid">
                    <div class="px-8 p-5  h-full w-full">
                        <div class="flex flex-col mt-2 h-full w-full">
                            <header class="flex justify-between w-full">
                                <div class="flex">
                                    <span class="text-white text-sm font-semibold mr-2">
                                        {{ review.nome }}
                                    </span>
                                </div>
                                <div class="flex">
                                    <StarFull class="w-3.5 text-yellow-400 opacity-50 group-hover:opacity-100"
                                        v-for="i in review.classificacao" />
                                    <StarEmpty class="w-3.5 text-yellow-400 opacity-50 group-hover:opacity-100"
                                        v-for="i in 5 - review.classificacao" />
                                    <div v-if="review.usuarioid === user?.usuarioid"
                                        @click="deleteReview(review.avaliacaoid)" class="ml-5">

                                        <TrashIcon class="w-5 text-red-600 cursor-pointer hover:scale-110 transition-all" />
                                    </div>
                                </div>
                            </header>
                            <p
                                class=" text-white h-full overflow-clip text-clip text-sm opacity-80 group-hover:opacity-100">
                                {{ review.descricao }}
                            </p>
                            <footer>
                                <span class="text-xs opacity-50 text-white"> {{ new Date(review.data).toLocaleString()
                                }}</span>
                            </footer>
                        </div>
                    </div>

                </div>
            </section>
        </div>

    </div>
</template>

<style scoped>
select {
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
}
</style>