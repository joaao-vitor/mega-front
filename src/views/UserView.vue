<script>
import { onBeforeMount, ref } from 'vue'
import axios from 'axios'
import Button from '../components/Button.vue'
import { UserPlusIcon, UserMinusIcon } from '@heroicons/vue/24/outline'
import { useNotification } from '../utils/notify'
import { useUserStore } from '../stores/UserStore'
import { storeToRefs } from 'pinia'
import { StarIcon as StarEmpty } from '@heroicons/vue/24/outline'
import { StarIcon as StarFull } from '@heroicons/vue/24/solid'
export default {
    props: ['id'],
    components: {
        Button, UserPlusIcon, UserMinusIcon, StarEmpty, StarFull
    },
    setup(props) {
        const { user: userAtual } = storeToRefs(useUserStore())
        const { id: usuarioid } = props
        const user = ref({})
        const { showError, showSuccess } = useNotification()

        const lastReviews = ref([])
        const doFollow = ref(false)

        const fetchUser = async () => {
            try {
                const { data: userData } = await axios.get(`${import.meta.env.VITE_API_URL}/user/${usuarioid}`)
                user.value = userData
                const { data: doFollowData } = await axios.get(`${import.meta.env.VITE_API_URL}/user/doFollow/${usuarioid}`)
                doFollow.value = doFollowData.follow
            } catch (error) {
                console.log(error)
            }
        }
        const followUser = async () => {
            try {
                if (!doFollow.value) {
                    const { data: followData } = await axios.post(`${import.meta.env.VITE_API_URL}/user/follow/${usuarioid}`)
                    await fetchUser()
                    showSuccess(followData.msg)
                } else {
                    const { data: followData } = await axios.delete(`${import.meta.env.VITE_API_URL}/user/unfollow/${usuarioid}`)

                    await fetchUser()
                    showSuccess(followData.msg)
                }
            } catch (error) {
                console.log(error)
                showError('Ocorreu um erro ao seguir o usuário')
            }
        }
        const fetchLastReviews = async () => {
            const { data: reviewsData } = await axios.get(`${import.meta.env.VITE_API_URL}/user/lastReviews/${usuarioid}`)
            lastReviews.value = reviewsData
        }
        onBeforeMount(async () => {
            console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')

            await fetchUser()
            await fetchLastReviews()
        })
        return {
            user, followUser, doFollow, userAtual, lastReviews, usuarioid
        }
    }
}
</script>
<template>
    <div class="min-h-screen px-12 py-24 flex flex-col">
        <header
            class="self-center text-white text-opacity-90 flex lg:flex-row flex-col gap-10 lg:w-7/12 lg:h-64 h-fit justify-center">
            <img :src="user.imgurl" class="w-40 h-40 md:w-52 md:h-52 rounded-full" alt="">
            <div class="flex flex-col w-full h-full lg:items-start lg:justify-start justify-center items-center">
                <button v-if="userAtual && parseInt(usuarioid) !== parseInt(userAtual.usuarioid)"
                    class="font-inter px-4 py-2 font-semibold items-center justify-center rounded-lg border border-zinc-700 flex gap-2 w-fit"
                    :class="{ 'text-red-500': doFollow, 'border-red-500': doFollow }" @click="followUser">
                    <UserPlusIcon class="w-4" v-if="!doFollow" />
                    <UserMinusIcon class="w-4" v-else />
                    {{ !doFollow ? 'Seguir' : 'Parar de seguir' }}
                </button>
                <h1 class="text-3xl font-semibold mt-4">{{ user.nome }}</h1>
                <p class="text-sm opacity-70 mt-1"><span v-if="user.cidade">{{ user.cidade }}</span><span
                        v-if="user.cidade && user.estado"> - </span> <span v-if="user.estado">{{ user.estado }}</span></p>
                <div class="self-center justify-self-center lg:self-end lg:justify-self-end flex gap-4 text-sm mt-5">
                    <p><span class="font-bold">{{ user.seguidores }}</span> seguidores</p>
                    <p><span class="font-bold">{{ user.seguindo }}</span> seguindo</p>
                </div>
            </div>
        </header>
        <section class="grid md:grid-cols-4 grid-cols-2 gap-4 justify-center self-center mt-4">
                <div class="w-24 h-24 md:w-32 md:h-32 p-4 text-center bg-black-400 rounded-lg flex flex-col justify-center items-center">
                    <h1 class="text-white opacity-90 text-xl md:text-3xl font-bold">{{ user.reviewCount }}</h1>
                    <p class="text-white opacity-90 text-sm md:text-md">Reviews Feitas</p>
                </div>
                <div class="w-24 h-24 md:w-32 md:h-32  p-4 text-center bg-black-400 rounded-lg flex flex-col justify-center items-center">
                    <h1 class="text-white opacity-90 text-xl md:text-3xl font-bold">{{ user.completadosCount }}</h1>
                    <p class="text-white opacity-90 text-sm md:text-md">Jogos Completos</p>
                </div>
                <div class="w-24 h-24 md:w-32 md:h-32  p-4 text-center bg-black-400 rounded-lg flex flex-col justify-center items-center">
                    <h1 class="text-white opacity-90 text-xl md:text-3xl font-bold">{{ user.jogandoCount }}</h1>
                    <p class="text-white opacity-90 text-sm md:text-md">Jogando agora</p>
                </div>
                <div class="w-24 h-24 md:w-32 md:h-32  p-4 text-center bg-black-400 rounded-lg flex flex-col justify-center items-center">
                    <h1 class="text-white opacity-90 text-xl md:text-3xl font-bold">{{ user.abandonadosCount }}</h1>
                    <p class="text-white opacity-90 text-sm md:text-md">Jogos Abandonados</p>
                </div>
        </section>
        <h1 class="text-2xl text-white opacity-80 font-semibold mt-4">Últimas reviews</h1>
        <section class="flex gap-4 w-full mt-4">
            <div class="bg-black-800 w-full lg:w-1/3 h-40 flex items-start  overflow-hidden" v-for="review in lastReviews">
                <img :src="review.imgurl" class="w-1/3 h-full object-cover" alt="">
                <div class="flex flex-col p-4 ">
                    <div class="flex text-right">
                        <StarFull class="w-4 text-yellow-400" v-for="i in review.classificacao" />
                        <StarEmpty class="w-4 text-yellow-400 text-opacity-50" v-for="i in 5 - review.classificacao" />
                    </div>
                    <h2 class="text-sm text-white font-semibold mt-2">{{ review.nome }}</h2>
                    <p class="text-white">{{ review.descricao }}</p>
                </div>
            </div>

        </section>
    </div>
</template>