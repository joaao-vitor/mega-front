<script>
import { ref, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import {
    Bars3Icon,
    MagnifyingGlassIcon,
    XMarkIcon,
} from '@heroicons/vue/24/solid'
import { storeToRefs } from 'pinia'
import { UserCircleIcon } from '@heroicons/vue/24/outline'
import SearchBar from './SearchBar.vue'
import UserPopUp from './UserPopUp.vue'
import { useUserStore } from '../../stores/UserStore'
import { useModalLoginStore } from '../../stores/ModalLoginStore'
import ModalLogin from '../HomePage/ModalLogin.vue'
export default {
    components: {
        SearchBar,
        MagnifyingGlassIcon,
        UserCircleIcon,
        Bars3Icon,
        XMarkIcon,
        UserPopUp,
        ModalLogin
    },
    setup() {
        const menuShown = ref(false)
        const isMobile = ref(false)
        const userPopUpShown = ref(false)
        const userStore = useUserStore()
        const ModalLoginStore = useModalLoginStore()


        const handleClickUser = () => {
            if (userStore.user) {
                userPopUpShown.value = !userPopUpShown.value
            } else {

                ModalLoginStore.showModal()
            }
        }

        const resizeEvent = () => {
            isMobile.value = window.innerWidth < 768
        }


        const modalStore = useModalLoginStore()
        const { isVisible: modalLogin } = storeToRefs(modalStore)
        const closeModalLogin = () => {
            modalStore.hideModal()
        }

        const showModalLogin = () => {
            if (!userStore.user)
                modalStore.showModal()
        }

        const hideMenu = () => {
            menuShown.value = false
        }


        onMounted(() => {
            resizeEvent()
            window.addEventListener('resize', resizeEvent)
        })

        onUnmounted(() => {
            window.removeEventListener('resize', resizeEvent)
        })

        return {
            menuShown,
            isMobile,
            userPopUpShown,
            handleClickUser,

            modalStore,
            modalLogin,
            closeModalLogin,
            showModalLogin,
            hideMenu
        }
    },
}
</script>
<template>
    <ModalLogin :modalLogin="modalLogin" @close="closeModalLogin" />

    <UserPopUp v-if="userPopUpShown" @close="() => (userPopUpShown = false)" :isOpen="userPopUpShown" />
    <div class="fixed w-full z-30">
        <Transition mode="in-out" name="fade">
            <header
                class="w-full h-screen md:h-full flex flex-col justify-between p-8 text-white text-opacity-75 bg-black-light md:bg-transparent md:bg-gradient-to-b from-menu-start to-transparent z-10 transition-opacity4 md:grid md:grid-cols-header gap-3 font-inter"
                v-if="menuShown || !isMobile">
                <div class="md:flex md:justify-start md:items-center">
                    <SearchBar placeholder="Nome do jogo" />
                </div>
                <nav class="md:flex md:justify-center md:items-center">
                    <ul class="menu">
                        <li><router-link to="/" @click="hideMenu">Inicio</router-link></li>
                        <li><router-link to="#" @click="hideMenu">Categorias</router-link></li>
                        <li><router-link to="#" @click="hideMenu">Explore</router-link></li>
                        <li>
                            <router-link to="/calendar">Calendário</router-link>
                        </li>
                    </ul>
                </nav>
                <div class="md:flex md:justify-end md:items-center">
                    <button class="menu-transition-preset hover:menu-hover" @click="handleClickUser">
                        <UserCircleIcon class="w-8 text-inherit" />
                    </button>
                </div>
            </header>
        </Transition>
        <div class="flex justify-end p-8 md:hidden absolute top-0 right-0">
            <button class="w-8 text-white text-opacity-75" @click="() => (menuShown = !menuShown)">
                <Bars3Icon v-if="!menuShown" />
                <XMarkIcon v-else />
            </button>
        </div>
    </div>
</template>

<style scoped>
@tailwind utilities;

@layer utilities {
    .menu-hover {
        @apply text-white text-opacity-90;
    }

    .menu-transition-preset {
        @apply transition-colors ease-in-out duration-500;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.menu {
    @apply h-full justify-between;
    @apply gap-5 text-lg font-semibold;
    @apply flex flex-col md:flex-row md:text-base md:gap-6 md:font-light;
}

.menu>li {
    @apply md:inline;
    @apply block;
}

.menu>li>a {
    @apply text-inherit;
    @apply menu-transition-preset;
}

.menu>li>a:hover {
    @apply menu-hover;
}
</style>
