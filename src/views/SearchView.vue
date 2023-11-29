<script>
import { useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import GameItem from '../components/CarouselSmall/GameItem.vue'
import axios from 'axios'

export default {
    setup() {
        const router = useRouter();
        const search = ref('');
        const games = ref([])
        const fetchGames = async () => {
            if (search.value.length > 0) {
                const { data: dataGames } = await axios.get(`${import.meta.env.VITE_API_URL}/jogo/buscar?nome=${search.value}`)
                games.value = dataGames
            }
        }
        onMounted(async () => {
            search.value = router.currentRoute.value.query.q || ''
            await fetchGames()

        });
        watch(() => router.currentRoute.value.query.q, async (newValue) => {
            search.value = newValue || ''
            await fetchGames()
        });
        return {
            search, games
        }
    },
    components: { GameItem }
}
</script>

<template>
    <div class="min-h-screen px-12 py-24 w-screen">
        <h1 class="text-3xl text-white font-semibold opacity-80 self-start mb-8">Resultados da busca: {{ search }} </h1>
        <section class="text-white text-opacity-80 flex gap-4 flex-wrap">
            <GameItem type="small" v-for="game in games" :game="game" class="mb-2" />
        </section>
    </div>
</template>
