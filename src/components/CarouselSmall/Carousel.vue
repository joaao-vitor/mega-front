<script>

import GameItem from './GameItem.vue';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'

export default {
    components: { GameItem, ChevronLeftIcon, ChevronRightIcon },
    props: {
        games: {
            type: Array,
            required: true,
        }
    },
    data() {
        return {
            currentIndex: 0,
            translateValue: 0,
            gamesToSkip: 0,
            itemWidth: 0,

            isDragging: false,
            dragStart: 0,

            gamesPerPage: 0,
        };
    },
    methods: {
        updateItemWidth() {
            let width = window.innerWidth
            if (width < 768) {
                this.itemWidth = 168
                this.gamesToSkip = 1,
                    this.gamesPerPage = (width - 48) / 168
            } else {
                this.gamesToSkip = 3
                this.itemWidth = 232
                this.gamesPerPage = (width - 96) / 232
            }
            this.totalPages = Math.ceil((this.games.length) / this.gamesToSkip);

        },
        next() {
            const newIndex = this.currentIndex + this.gamesToSkip;

            if (newIndex < this.games.length) {
                this.currentIndex = newIndex;
                this.translateValue -= this.gamesToSkip * this.itemWidth;
            }
        },
        prev() {
            const newIndex = this.currentIndex - this.gamesToSkip;

            if (newIndex >= 0) {
                this.currentIndex = newIndex;
                this.translateValue += this.gamesToSkip * this.itemWidth;
            }
        },
        startDrag(event) {
            this.isDragging = true;
            this.dragStart = event.clientX || event.touches[0].clientX;
        },
        dragging(event) {
            if (this.isDragging) {
                const clientX = event.clientX || event.touches[0].clientX;
                const dragOffset = this.dragStart - clientX;

                this.translateValue = -(this.currentIndex * this.itemWidth) + dragOffset;

                // Limita o arrasto para o número exato de itens por página
                this.translateValue = Math.max(
                    Math.min(this.translateValue, 0),
                    -(this.totalPages - 1) * this.itemWidth
                );
            }
        },
        endDrag(event) {
            if (this.isDragging) {
                this.isDragging = false;

                // Lógica de limite de arraste para determinar a página atual
                const dragThreshold = this.itemWidth / 3;
                const dragDistance = this.dragStart - (event.clientX || event.changedTouches[0].clientX);

                if (dragDistance > dragThreshold && this.currentIndex < this.games.length - 1) {
                    this.currentIndex++;
                } else if (dragDistance < -dragThreshold && this.currentIndex > 0) {
                    this.currentIndex--;
                }

                // Ajusta a posição do carrossel para a página atual
                this.translateValue = -this.currentIndex * this.itemWidth;
            }
        },
    },
    computed: {
    },
    mounted() {
        this.updateItemWidth();
        window.addEventListener('resize', this.updateItemWidth);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.updateItemWidth);
    },
}
</script>
<template>
    <div class="carousel flex flex-col" @mousedown="startDrag" @touchstart="startDrag" @mousemove="dragging"
        @touchmove="dragging" @mouseup="endDrag" @touchend="endDrag" @mouseleave="endDrag">
        <div class="carousel-inner flex gap-6" :style="{ transform: `translateX(${translateValue}px)` }">

            <GameItem class="carousel-item" type="small" v-for="game in games" :game="game" />
        </div>
        <button v-if="currentIndex > 0" @click="prev" class="btn">
            <ChevronLeftIcon class="w-8" />
        </button>
        <button v-if="currentIndex + gamesToSkip < games.length - 1" @click="next" class="btn right-0">
            <ChevronRightIcon class="w-8" />
        </button>
    </div>
</template>
<style scoped>
.btn {
    @apply absolute text-white w-12 h-full transition-all duration-500 hover:bg-black-800 flex items-center justify-center
}

.carousel {
    position: relative;
    overflow: hidden;
    width: 100%;
}

.carousel-inner {
    display: flex;
    transition: transform 0.5s ease;
}

.carousel-item {
    flex: 0 0 auto;
    /* Alterado para `auto` para permitir que os itens tenham larguras variáveis */
    box-sizing: border-box;
}
</style>