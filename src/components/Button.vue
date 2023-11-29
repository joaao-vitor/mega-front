<script>
export default {
    props: {
        class: String,
    }
}
</script>
<template>
    <button :class="class" class="hover:shadow-md hover:scale-105 transition-all px-4 py-2 text-xs sm:text-sm sm:px-5 sm:py-2.5 text-white font-bold font-inter rounded-md">
        <slot></slot>
    </button>
</template>
<style scoped>
</style>