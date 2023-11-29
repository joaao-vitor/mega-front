<!-- HomeView.vue -->
<template>
  <div>
    <HomeLoggedView v-if="user" />
    <HomeNotLoggedView v-else />
  </div>
</template>
  
<script>
import { useUserStore } from '../stores/UserStore';
import HomeLoggedView from './HomeLoggedView.vue';
import HomeNotLoggedView from './HomeNotLoggedView.vue';
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia'


export default {
  components: {
    HomeLoggedView,
    HomeNotLoggedView,
  },
  setup() {
    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);

    return {
      user
    };
  },
};
</script>
  