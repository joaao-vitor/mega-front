<script>
import { ref, defineProps, defineComponent } from 'vue';
import Button from '../components/Button.vue';
import Hero from '../components/Hero.vue';
import { InformationCircleIcon } from '@heroicons/vue/24/outline';
import { StarIcon as StarFull } from '@heroicons/vue/24/solid';
import { StarIcon as StarEmpty } from '@heroicons/vue/24/outline';

export default defineComponent({
  components: { Hero, Button, InformationCircleIcon, StarFull, StarEmpty },

  props: {
    game: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    const ratingStars = ref(Array.from({ length: props.game.rating > 0 ? props.game.rating : 0 }));
    const emptyStars = ref(Array.from({ length: Math.max(0, 5 - (props.game.rating > 0 ? props.game.rating : 0)) }));

    return {
      ratingStars,
      emptyStars,
    };
  },
});
</script>

<template>
  <section class="relative">
    <div class="absolute z-10 w-full h-full flex flex-col justify-end p-6 md:p-12">
      <div class="flex mb-2">
        <StarFull v-for="(_, index) in ratingStars" :key="index" class="w-6 h-6 text-yellow-500" />
        <StarEmpty v-for="(_, index) in emptyStars" :key="index" class="w-6 h-6 text-yellow-500" />
      </div>
      <h3 class="text-white text-opacity-80 text-md font-semibold">Destaque</h3>
      <h2 class="text-white text-4xl font-bold">{{ game.nome }}</h2>
      <router-link :to="`/game/${game.jogoid}`" class=" max-w-fit">
        <Button class="flex gap-2 bg-zinc-600 font-semibold mt-3 items-center">
          <InformationCircleIcon class="w-5 h-5" /> Mais Informações
        </Button>
      </router-link>
    </div>
    <Hero :imgUrl="game.imgurl" fade />
  </section>
</template>
