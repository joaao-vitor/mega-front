<script>
import { ref, onBeforeMount } from 'vue'
import axios from 'axios'
import GameItem from '../components/Calendar/GameItemCalendar.vue'
export default {
    components: { GameItem },
    setup() {
        const futureGames = ref([])
        const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']
        const fetchFutureGames = async () => {
            try {
                const { data: dataFuture } = await axios.get(`${import.meta.env.VITE_API_URL}/jogo/future`)
                for (const game of dataFuture) {
                    game.dia = new Date(game.data_lancamento).getDate() + 1
                    game.mes = meses[new Date(game.data_lancamento).getMonth()]
                }
                futureGames.value = dataFuture
            } catch (error) {
                console.log(error)
            }
        }

        onBeforeMount(async () => {
            await fetchFutureGames()
        })
        return {
            futureGames
        }
    }
}
</script>
<template>
    <section class="h-screen p-6 md:px-12 flex flex-col justify-center font-inter">
        <h1 class=" text-white text-4xl font-bold">Calendário de Lançamentos</h1>
        <section class="mt-5 flex gap-4">
            <GameItem v-for="game in futureGames" :game="game" />
        </section>
        <div v-if="futureGames.length === 0">
            <h2 class="text-xl font-semibold text-white">
                Nenhum jogo a ser lançado
            </h2>
        </div>
    </section>
</template>