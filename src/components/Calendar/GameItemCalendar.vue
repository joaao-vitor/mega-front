<script>
    export default {
        props: {
            game: {
                type: Object,
                required: true
            }
        },
    }
</script>
<template>
    <div class="relative w-72 h-80 md:w-60 md:h-72 group overflow-hidden cursor-pointer">
        <div class=" flex absolute inset-0 w-full h-full bg-black-800 z-10 group-hover:bg-black-400 transition-all">
            <div
                class="self-end flex flex-col px-4 py-7 gap-2 text-white text-opacity-70 group-hover:text-opacity-90 transition-all">
                <h4 class="group-hover:opacity-100 font-semibold group-hover:-translate-y-3 opacity-0 text-2xl transition-all">{{ game.nome }}</h4>
                <div class="flex items-center gap-2">
                    <h5 class="text-4xl font-semibold">{{game.dia}}</h5>
                    <span class="text-4xl font-light">|</span>
                    <span class="text-2xl">{{game.mes}}</span>
                </div>
            </div>
        </div>
        <div class="gap-2 w-full h-full bg-center bg-cover group-hover:scale-105 transition-all z-0"
            :style="{ 'background-image': `url(${game.imgurl})` }">
        </div>
    </div>
</template>
<style></style>