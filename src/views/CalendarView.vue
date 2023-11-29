<script>
import GameItem from '../components/Calendar/GameItemCalendar.vue'
export default {
    components: { GameItem },
    data() {
        return {
            games: [{
                imgUrl: 'src/assets/imgs/gta-v.jpg',
                name: 'GTA V',
                day: 12,
                month: 'SET'
            },
            {
                imgUrl: 'src/assets/imgs/gta-v.jpg',
                name: 'GTA V',
                day: 12,
                month: 'SET'
            },
            {
                imgUrl: 'src/assets/imgs/gta-v.jpg',
                name: 'GTA V',
                day: 12,
                month: 'SET'
            }]
        }
    },
}
</script>
<template>
    <section class="h-screen p-6 md:px-12 flex flex-col justify-center font-inter">
        <h1 class=" text-white text-4xl font-bold">Calendário de Lançamentos</h1>
        <section class="mt-5 flex gap-4">
            <GameItem v-for="game in games" :game="game"/>
        </section>
    </section>
</template>