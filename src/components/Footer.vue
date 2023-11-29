<script>
export default {
    computed: {
        year(){
            return new Date().getFullYear()
        }
    }
}
</script>
<template>
    <footer class="w-full h-fit font-inter bg-neutral-800 flex flex-col p-6 md:p-12 gap-3">
        <h3 
            class="font-outline opacity-30 font-poppins font-extrabold outline-3 tracking-wide text-transparent text-2xl md:text-4xl lg:text-5xl">
            MEGA
        </h3>
        <p class="text-white text-opacity-60 text-xs md:text-sm">© {{year}} Mega Corporation. Todos os direitos reservados.</p>
        <section class="text-gray-400 text-xs md:text-sm text-opacity-80">
            <a href="">Sobre nós</a> | 
            <a href="">Suporte</a> | 
            <a href="">Instagram</a> | 
            <a href="">Twitter</a>
        </section>
    </footer>
</template>
<style scoped>
.font-outline {

    -webkit-text-stroke-width: 0.5px;
    -webkit-text-stroke-color: white;
    paint-order: stroke fill;
}
</style>
