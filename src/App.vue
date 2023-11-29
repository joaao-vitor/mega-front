<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header/Header.vue';
import Footer from './components/Footer.vue';
import Toast from './components/Toast.vue';

</script>

<template>
  <main class="min-h-screen bg-black-light focus:outline-none focus:ring-0 select-none">
    <Toast/>
    <Header></Header>
    <RouterView/>
    <Footer />
  </main>
</template>

<style scoped>
.font-outline {

  -webkit-text-stroke-width: 1.15px;
  -webkit-text-stroke-color: #8C63FF;
  paint-order: stroke fill;
}
</style>
