
<script>
import { ref, onBeforeMount } from 'vue';
import Carousel from '../components/CarouselSmall/Carousel.vue';
import GameItem from '../components/CarouselSmall/GameItem.vue';
import HeroPrincipal from '../components/HeroPrincipal.vue';
import axios from 'axios'
export default {
    components: { HeroPrincipal, GameItem, Carousel },
    setup() {
        const latestGames = ref([])
        const futureGames = ref([])
        const basedReviewsGames = ref([])
        const highlightGame = ref({})
        const fetchLatestGames = async () => {
            try {
                const { data: dataLatest } = await axios.get(`${import.meta.env.VITE_API_URL}/jogo/latest`)
                latestGames.value = dataLatest

            } catch (error) {
                console.log(error)
            }
        }
        const fetchFutureGames = async () => {
            try {
                const { data: dataFuture } = await axios.get(`${import.meta.env.VITE_API_URL}/jogo/future`)
                futureGames.value = dataFuture

            } catch (error) {
                console.log(error)
            }
        }

        const fetchBasedReviewsGames = async () => {
            try {
                const { data: dataBasedReviews } = await axios.get(`${import.meta.env.VITE_API_URL}/jogo/basedReviews`)
                basedReviewsGames.value = dataBasedReviews

            } catch (error) {
                console.log(error)
            }
        }
        const fetchHighlightGames = async () => {
            const { data: highlightGames } = await axios.get(`${import.meta.env.VITE_API_URL}/jogo/highlight`)
            highlightGame.value = highlightGames[Math.floor(Math.random() * highlightGames.length)]
        }
        onBeforeMount(async () => {
            await fetchLatestGames()
            await fetchFutureGames()
            await fetchBasedReviewsGames()
            await fetchHighlightGames()
        })
        return { latestGames, futureGames, basedReviewsGames, highlightGame };
    },
};
</script>

<template>
    <main class="font-inter mb-5">
        <HeroPrincipal :game="highlightGame" />
        <br>

        <section class="flex flex-col text-white w-full px-6 md:px-12" v-if="basedReviewsGames.length > 0">
            <h3 class="text-md font-semibold mb-5">
                Baseado nas suas reviews
            </h3>
            <Carousel :games="basedReviewsGames" />
        </section>
        <section class="flex flex-col text-white w-full px-6 md:px-12">
            <h3 class="text-md font-semibold mb-5">
                Últimos lançamentos
            </h3>
            <Carousel :games="latestGames" />
        </section>

        <section class="flex flex-col text-white w-full px-6 md:px-12" v-if="futureGames.length > 0">
            <h3 class="text-md font-semibold mb-5">
                Próximos lançamentos
            </h3>
            <Carousel :games="futureGames" />
        </section>
    </main>
</template>
  
<style></style>
  