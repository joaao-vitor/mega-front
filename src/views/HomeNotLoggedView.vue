<script>
import { ref } from 'vue'
import Button from '../components/Button.vue'
import Hero from '../components/Hero.vue'
import ModalLogin from '../components/HomePage/ModalLogin.vue'
import { useModalLoginStore } from '../stores/ModalLoginStore'
import { storeToRefs } from 'pinia'

export default {
    components: {
        Hero,
        Button,
        ModalLogin,
    },
    setup() {
        const {showModal} = useModalLoginStore()
        return {
            showModal
        }
    },
}
</script>

<template>

    <main class="relative w-full h-full flex justify-center items-center">
        <Hero :imgUrl="'src/assets/imgs/gta-v.jpg'" />
        <section
            class="max-w-5xl p-5 absolute h-full flex flex-col justify-center items-center"
        >
            <h3
                class="font-outline font-poppins font-bold outline-3 tracking-wide text-transparent text-3xl md:text-4xl lg:text-5xl"
            >
                MEGA
            </h3>
            <h2
                class="text-white text-opacity-60 font-bebas text-center text-5xl md:text-7xl lg:text-9xl"
            >
                EXPLORE JOGUE
                <span class="text-opacity-100 text-violet-500"> AVALIE</span>
            </h2>
            <p
                class="text-white text-opacity-60 font-inter text-center text-sm max-w-md md:max-w-xl md:text-xl tracking-widest"
            >
                Venha participar da maior e mais unida comunidade de jogos da
                America Latina
            </p>
            <Button class="bg-violet-500 mt-10" @click="showModal">
                ENTRE AGORA
            </Button>
        </section>
    </main>
</template>
<style>
.font-outline {
    -webkit-text-stroke-width: 1.15px;
    -webkit-text-stroke-color: #8c63ff;
    paint-order: stroke fill;
}
</style>
