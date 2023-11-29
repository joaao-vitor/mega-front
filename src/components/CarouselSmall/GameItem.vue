<script>
import { StarIcon as StarFull } from '@heroicons/vue/24/solid'
import { StarIcon as StarEmpty } from '@heroicons/vue/24/outline'
export default {
    components: { StarFull, StarEmpty },
    props: {
        game: Object,
        type: {
            required: true,
            validator(value) {
                return ['small', 'large'].includes(value)
            }
        }
    }
}
</script>
<template>
    <router-link :to="`/game/${game.jogoid}`">
        <article class="group relative font-inter cursor-pointer overflow-hidden transition-all rounded-md"
            :class="{ 'w-36 h-56 md:w-52 md:h-72': type === 'small', 'w-1/3 h-60': type === 'large' }">
            <div class="w-full h-full bg-cover bg-center rounded-md group-hover:scale-105 transition-all"
                :style="`background-image: url(${game.imgurl});`"></div>
            <div class="hover:bg-black-800 transition-all 
            flex flex-col items-center justify-end pb-14 
            w-full h-full absolute inset-0 bg-gradient-to-b from-transparent to-black-800 rounded-md
            ">

                <div
                    class="flex mb-2 transition-all duration-500 group-hover:-translate-y-4 group-hover:opacity-100 delay-200 opacity-0">
                    <StarFull v-for="i in game.rating" class="w-6 h-6 text-yellow-500" />
                    <StarEmpty v-for="i in 5 - game.rating" class="w-6 h-6 text-yellow-500 " />
                </div>
                <h1
                    class="text-xl text-center font-bold opacity-80 group-hover:-translate-y-4 transition-transform duration-500">
                    {{
                        game.nome }}</h1>
            </div>
        </article>
    </router-link>
</template>
<style></style>