<script>
export default {
    props: {
        imgUrl: String,
        fade: Boolean,
    }
    
}
</script>
<template>
    <div class="h-screen w-full relative z-0">
        <div :style="`background-image: url(${imgUrl});`" class="absolute h-full w-full bg-no-repeat bg-center bg-cover"
            >
        </div>
        <div class="absolute bg-black-light bg-opacity-70 h-full w-full"
            :class="fade ? 'fade-bg' : ''">
        </div>
    </div>
</template>
<style scoped>
.fade-bg{
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.58) 0%, #111 88.33%);
}
</style>