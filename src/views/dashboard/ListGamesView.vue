<script>
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/solid'
import Input from '../../components/Input.vue'
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import axios from 'axios'
import { useNotification } from '../../utils/notify'

import { StarIcon } from '@heroicons/vue/24/solid'

export default {
    components: { PencilIcon, TrashIcon, Input, StarIcon },
    setup() {
        const { showSuccess, showError } = useNotification()
        const games = ref([])
        const search = ref('')
        const isSearchValid = ref({
            isValid: search.value.length > 0,
            error: 'Digite algo para buscar',
        })
        watch(
            search,
            () => (isSearchValid.value.isValid = search.value.length > 0),
            {}
        )

        const filteredGames = ref([...games.value])
        watch(
            search,
            () => {
                filteredGames.value = games.value.filter((game) =>
                    game.nome
                        .toLowerCase()
                        .startsWith(search.value.toLowerCase())
                )
            },
            {}
        )

        const fetchGames = async () => {
            try {
                const { data: gamesData } = await axios.get(
                    `${import.meta.env.VITE_API_URL}/jogos/games`
                )
                games.value = [...gamesData.sort((g1, g2) => g1.jogoid - g2.jogoid)]
                filteredGames.value = [...games.value]
            } catch (error) {
                showError('Erro ao buscar jogos')
            }
        }

        const handleDelete = async (game) => {
            try {
                const { data } = await axios.delete(
                    `${import.meta.env.VITE_API_URL}/jogo/remove/${game.jogoid}`
                )
                showSuccess('Jogo excluido com sucesso!')
                await fetchGames()
                filteredGames.value = [...gamesRes]
            } catch (error) {
                console.log(error)
                showError('Ocorreu um erro ao excluir o jogo!')
            }
        }

        const highlightGame = async (id) => {
            try {
                const { data: dataHighlight } = await axios.patch(`${import.meta.env.VITE_API_URL}/jogo/highlight/${id}`)
                showSuccess(dataHighlight.msg)
                await fetchGames()

            } catch (error) {
                showError('Ocorreu um erro ao destacar o jogo')
            }
        }
        onBeforeMount(async () => {
            await fetchGames()
            filteredGames.value = [...games.value]
        })

        return {
            filteredGames,
            search,
            isSearchValid,
            MagnifyingGlassIcon,
            fetchGames,
            handleDelete,
            highlightGame
        }
    },
}
</script>
<template>
    <section
        class="flex p-4 md:px-12 flex-col gap-2 items-center overflow-auto relative table-auto overflow-x-auto shadow-md">
        <div class="self-end">
            <Input type="text" v-model="search" :icon="MagnifyingGlassIcon" placeholder="Buscar por jogo"
                :validate="isSearchValid" />
        </div>
        <div class="overflow-auto relative rounded-md w-full">
            <table class="w-full table-auto lg:table-fixed text-xs text-lef text-white text-opacity-80">
                <thead class="uppercase text-xs bg-zinc-800">
                    <tr>
                        <th class="w-2">Id</th>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Gênero</th>
                        <th>Data</th>
                        <th>Empresas</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody class="max-h-32 overflow-hidden">
                    <tr v-for="game in filteredGames" :key="game.jogoid"
                        class="bg-zinc-900 hover:bg-zinc-800 transition-all">
                        <td>{{ game.jogoid }}</td>
                        <td>{{ game.nome }}</td>
                        <td>
                            <div class="max-h-20 overflow-clip text-clip">
                                {{ game.descricao }}
                            </div>
                        </td>
                        <td>{{ game.genero }}</td>
                        <td>{{ game.data_lancamento.toLocaleString() }}</td>
                        <td>
                            <div v-for="dev in game.empresas" :key="dev.empresaid"
                                class="flex gap-2 items-center justify-center w-fit text-white text-opacity-75 p-4 py-2 border rounded-full border-zinc-700 hover:bg-zinc-700">
                                <span class="">{{ dev.nome }} </span>
                            </div>
                        </td>
                        <td>
                            <div class="flex gap-2">

                                <button @click="highlightGame(game.jogoid)"
                                    class="p-2 bg-orange-500 rounded-sm hover:scale-105 hover:bg-orange-700 transition-all"
                                    :class="{ 'bg-red-700': game.destaque, 'bg-orange-500': !game.destaque, 'hover:bg-orange-700': !game.destaque, 'hover:bg-red-700': game.destaque }">
                                    <StarIcon class="w-3" />
                                </button>
                                <RouterLink :to="`/dashboard/edit-game/${game.jogoid}`">
                                    <button
                                        class="p-2 bg-yellow-600 rounded-sm hover:scale-105 hover:bg-yellow-700 transition-all">
                                        <PencilIcon class="w-3" />
                                    </button>
                                </RouterLink>

                                <button class="p-2 bg-red-600 rounded-sm hover:scale-105 hover:bg-red-700 transition-all"
                                    @click="handleDelete(game)">
                                    <TrashIcon class="w-3" />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<style scoped>
tr>th,
tr>td {
    @apply px-5 py-3;
}

thead>tr>th {
    @apply opacity-60;
}

tbody>tr>td {
    @apply font-normal;
}
</style>
