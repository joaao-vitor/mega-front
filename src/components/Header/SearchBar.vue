<script>
import { ref, watch } from 'vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
import { useRouter } from 'vue-router'

export default {
    props: {
        placeholder: String,
    },
    components: { MagnifyingGlassIcon },
    setup(props) {
        const inputShown = ref(false);
        const search = ref('')
        const router = useRouter()
        const showInput = () => {
            console.log('aodjaiowio');
            inputShown.value = true;
        };

        const hideInput = () => {
            inputShown.value = false;
        };

        watch(search, () => {
            console.log(search)
            router.push(`/search?q=${search.value}`)
        })


        return {
            inputShown,
            showInput,
            hideInput,
            search
        };
    },
};
</script>

<template>
    <div class="flex w-full md:justify-start md:items-center">
        <transition name="fade">
            <button class="menu-transition-preset hover:menu-hover" @click="showInput" v-if="!inputShown">
                <MagnifyingGlassIcon class="w-6 text-inherit" />
            </button>
        </transition>
        <transition name="slide-fade">
            <input type="text"
            v-model="search"
                class="font-inter text-sm w-10/12 text-zinc-300 focus:text-black-light rounded-md p-2 px-3 outline-none bg-zinc-700 hover:bg-zinc-600 focus:bg-zinc-50 transition-all focus:ring-2"
                :placeholder="placeholder" v-if="inputShown" @focusout="hideInput" />
        </transition>
    </div>
</template>

<style>
.fade-enter-active {
    transition: opacity 0.3s ease;
}

.fade-leave-active {
    transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(30px);
    opacity: 0;
}
</style>
