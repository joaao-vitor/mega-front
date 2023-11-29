<script>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../../stores/UserStore'

export default {
    setup() {

        const UserStore = useUserStore()
        const { user } = storeToRefs(UserStore)
        const isAdmin = ref(user.value?.isAdmin)

        watch(user, () => { isAdmin.value = user.value?.isAdmin }, { deep: true })
        return {
            isAdmin
        }
    }

}
</script>
<template>
    <div v-if="isAdmin" class="flex flex-col md:flex-row min-h-screen w-full p-4 md:px-12 py-24">
        <aside
            class="flex flex-col text-xs sm:text-sm md:text-sm md:block md:min-h-screen w-full md:w-1/4 h-full border-b border-b-zinc-800 md:border-b-0 md:border-r md:border-r-zinc-800">
            <h1 class="font-semibold opacity-50 mb-5 text-white ml-2 md:ml-6">Menu</h1>
            <nav class="text-white text-opacity-80">
                <ul class="flex md:block">
                    <RouterLink to="/dashboard/list-games">
                        <li>Listar jogos</li>
                    </RouterLink>
                    <RouterLink to="/dashboard/add-game">
                        <li>Adicionar jogo</li>
                    </RouterLink>
                    <RouterLink to="/dashboard/add-dev">
                    <li>Adicionar empresa</li>
                    </RouterLink>
                </ul>
            </nav>
        </aside>
        <section class="w-full h-full">
            <RouterView></RouterView>
        </section>
    </div>
    <div v-else class="min-h-screen p-24 flex justify-center items-center">
        <h1 class="text-white text-3xl font-bold">Você não possui permissão para acessar essa página!</h1>
    </div>
</template>
<style scoped>
ul li {
    @apply px-2 md:p-4 md:px-6 hover:bg-zinc-800 rounded-sm transition-all duration-300
}
</style>