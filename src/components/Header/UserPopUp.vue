<script>
import {
    Cog6ToothIcon,
    UserIcon,
    ArrowLeftOnRectangleIcon,
    LifebuoyIcon,
} from '@heroicons/vue/24/outline'

import axios from 'axios'
import { useUserStore } from '../../stores/UserStore'
import { useNotification } from '../../utils/notify'
import { onMounted, onUnmounted, ref } from 'vue'
import { useModalLoginStore } from '../../stores/ModalLoginStore'
import { storeToRefs } from 'pinia'
export default {
    components: {
        Cog6ToothIcon,
        UserIcon,
        ArrowLeftOnRectangleIcon,
        LifebuoyIcon
    },
    props: ['isOpen'],
    setup(props, { emit }) {
        const { user, removeUser } = storeToRefs(useUserStore())
        const { showSuccess } = useNotification()
        const userPopUp = ref(null)
        const isOpen = props.isOpen
        const countClose = ref(0)
        const modalStore = useModalLoginStore()

        const logout = async (event) => {
            try {
                await axios.delete(
                    `${import.meta.env.VITE_API_URL}/auth/logout`
                )
                userStore.removeUser()
                showSuccess('Deslogado com sucesso!')
                emit('close')
            } catch (error) { }
        }
        const closePopup = (event) => {
            if (isOpen && !userPopUp.value.contains(event.target) && countClose.value === 1) {
                countClose.value = 0
                emit('close')
                modalStore.hideModal()
            }
            countClose.value++
        }

        const closePopUp = () => {
            emit('close')
            modalStore.hideModal()
            countClose.value = 0
        }
        const userImg = ref('')
        onMounted(async () => {
            const { data: userData } = await axios.get(`${import.meta.env.VITE_API_URL}/user/${user.value.usuarioid}`)
            userImg.value = userData.imgurl
            document.addEventListener('click', closePopup)
        })

        onUnmounted(() => {
            document.removeEventListener('click', closePopup)
        })
        return {
            logout,
            userPopUp,
            user, userImg,
            closePopUp
        }
    },
}
</script>

<template>
    <div class="p-5 flex flex-col gap-3 justify-start items-start text-white bg-black-800 w-48 fixed md:top-20 md:right-2 md:left-auto md:bottom-auto left-2 bottom-20 z-40 rounded-md"
        ref="userPopUp" @click.stop="">
        <header class="flex gap-3 items-center">
            <div class="w-8 h-8 bg-cover bg-center rounded-full" :style="{
                'background-image': `url(${userImg})`,
            }"></div>
            <div>
                <h3 class="text-sm font-semibold opacity-80">{{ user.nome }}</h3>
            </div>
        </header>
        <hr class="border-white border-1 w-full border-opacity-20" />
        <section>
            <nav>
                <ul class="text-sm">
                    <router-link @click="closePopUp" :to="`/user/${user.usuarioid}`">
                        <li>
                            <UserIcon class="h-5" />Perfil
                        </li>
                    </router-link>

                    <router-link @click="closePopUp" :to="`/config`">
                        <li>
                            <Cog6ToothIcon class="h-5" /> Configurações da conta
                        </li>
                    </router-link>
                    <router-link @click="closePopUp" to="/dashboard" class="">
                        <li v-if="user.isAdmin">
                            <LifebuoyIcon class="h-5" /> Painel
                        </li>
                    </router-link>
                    <li @click="logout">
                        <ArrowLeftOnRectangleIcon class="h-5" />Sair
                    </li>
                </ul>
            </nav>
        </section>
    </div>
</template>

<style scoped>
ul>li,
ul>a>li {
    @apply cursor-pointer flex gap-2 mb-5 items-center opacity-80 hover:opacity-100 transition-all;
}
</style>
