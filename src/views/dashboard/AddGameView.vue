<script>
import { watch, ref, onBeforeMount } from 'vue'
import { useUserStore } from '../../stores/UserStore'
import Input from '../../components/Input.vue'
import { storeToRefs } from 'pinia'
import TextArea from '../../components/TextArea.vue'
import {
    Bars3BottomLeftIcon,
    Bars3Icon,
    CalendarDaysIcon,
    InboxArrowDownIcon,
    PuzzlePieceIcon,
    XMarkIcon,
} from '@heroicons/vue/24/solid'
import Button from '../../components/Button.vue'
import { useNotification } from '../../utils/notify'
import axios from 'axios'
export default {
    components: {
        Input,
        TextArea,
        XMarkIcon,
        Button,
    },
    setup() {
        const { showSuccess, showError } = useNotification()
        const gameName = ref('')
        const isGameNameValid = ref({
            isValid: gameName.value.length > 0,
            error: 'Insira o nome do jogo',
        })

        watch(
            gameName,
            () => (isGameNameValid.value.isValid = gameName.value.length > 0),
            {}
        )

        const gameGenre = ref('')
        const isGameGenreValid = ref({
            isValid: gameGenre.value.length > 0,
            error: 'Insira o gênero do jogo',
        })
        watch(
            gameGenre,
            () => (isGameGenreValid.value.isValid = gameGenre.value.length > 0),
            {}
        )

        const description = ref('')
        const isDescriptionValid = ref({
            isValid: description.value.length > 0,
            error: 'Insira a descrição do jogo',
        })
        watch(
            description,
            () =>
                (isDescriptionValid.value.isValid =
                    description.value.length > 0 &&
                    description.value.length < 250),
            {}
        )

        const dataLancamento = ref('')
        const isDataValid = ref({
            isValid: dataLancamento.value.length > 0,
            error: 'Insira a data do jogo',
        })
        watch(
            dataLancamento,
            () => (isDataValid.value.isValid = dataLancamento.value.length > 0),
            {}
        )

        const imgGame = ref(null)
        const isImgValid = ref({
            isValid: imgGame.value,
            error: 'Insira uma imagem do jogo',
        })
        const onImgChange = (e) => {
            const img = e.target.files[0]
            if (!img) return false

            const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif']
            const extension = img.name.split('.').pop().toLowerCase()

            isImgValid.value.isValid = allowedExtensions.includes(extension)
            isImgValid.value.isValid
                ? (imgGame.value = img)
                : (imgGame.value = null)
        }

        const gameDevs = ref([])
        const selectedDev = ref(0)
        const selectedDevs = ref([])
        const handleClickOption = () => {
            const dev = gameDevs.value.find(
                (e) => e.empresaid === selectedDev.value
            )
            gameDevs.value = gameDevs.value.filter(
                (e) => e.empresaid !== selectedDev.value
            )
            selectedDevs.value.push(dev)
        }
        const handleDeleteDev = (dev) => {
            gameDevs.value.push(dev)
            selectedDevs.value = selectedDevs.value.filter(
                (d) => d.empresaid !== dev.empresaid
            )
        }

        watch(selectedDev, handleClickOption, { deep: true })

        const UserStore = useUserStore()
        const { user } = storeToRefs(UserStore)
        const isAdmin = ref(user.value?.isAdmin)

        watch(
            user,
            () => {
                isAdmin.value = user.value?.isAdmin
            },
            { deep: true }
        )

        const resetValues = () => {
            gameName.value = ''
            gameGenre.value = ''
            dataLancamento.value = ''
            imgGame.value = null
            description.value = ''
            selectedDevs.value = []
        }

        const submitGame = async (game) => {
            const formData = new FormData()
            formData.append('image', imgGame.value)
            try {
                const {
                    data: {
                        image: { src },
                    },
                } = await axios.post(
                    `${import.meta.env.VITE_API_URL}/jogo/upload`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                )

                game.imgurl = src

                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_URL}/jogo/add`,
                    game
                )
            } catch (error) {
                imgGame.value = null
                console.log(error)
            }
        }

        const handleSubmit = async () => {
            if (
                !selectedDevs.value.length > 0 ||
                !isDataValid.value.isValid ||
                !isGameNameValid.value.isValid ||
                !isGameGenreValid.value.isValid ||
                !isDescriptionValid.value.isValid ||
                !isImgValid.value.isValid
            ) {
                showError('Preencha todos os campos corretamente')
                return
            }
            const empresasId = []
            for (const emp of selectedDevs.value) {
                empresasId.push(emp.empresaid)
            }
            const game = {
                nome: gameName.value,
                genero: gameGenre.value,
                descricao: description.value,
                data_lancamento: dataLancamento.value,
                empresas: empresasId,
            }
            try {
                await submitGame(game)
                showSuccess('Jogo inserido com sucesso!')
                resetValues()
            } catch (error) {
                showSuccess(error)
            }
        }
        const fetchEmp = async () => {
            const { data: empresas } = await axios.get(
                `${import.meta.env.VITE_API_URL}/jogos/empresa`
            )
            return empresas
        }
        onBeforeMount(async () => {
            gameDevs.value = [...(await fetchEmp())]
            console.log('a')
        })
        return {
            UserStore,
            isAdmin,
            gameName,
            isGameNameValid,
            gameGenre,
            isGameGenreValid,
            description,
            isDescriptionValid,
            dataLancamento,
            isDataValid,
            imgGame,
            isImgValid,
            onImgChange,
            gameDevs,
            selectedDev,
            selectedDevs,
            handleDeleteDev,
            resetValues,
            handleSubmit,
            PuzzlePieceIcon,
            Bars3BottomLeftIcon,
            CalendarDaysIcon,
            InboxArrowDownIcon,
            Bars3Icon,
        }
    },
}
</script>

<template>
    <div
        v-if="isAdmin"
        class="w-full min-h-screen flex flex-col justify-center items-start p-6 md:p-12"
    >
        <nav class="mb-3">
            <ul>
                <li class="text-cyan-700 font-semibold text-sm">
                    <router-link to="/dashboard">Voltar ao painel</router-link>
                </li>
            </ul>
        </nav>
        <section class="w-full flex flex-col gap-5">
            <h2 class="text-white opacity-80 font-semibold mb-2">
                Dados do jogo
            </h2>
            <Input
                type="text"
                :icon="PuzzlePieceIcon"
                placeholder="Insira o nome do jogo"
                v-model="gameName"
                :validate="isGameNameValid"
            />
            <Input
                type="text"
                :icon="Bars3BottomLeftIcon"
                placeholder="Insira o gênero do jogo"
                v-model="gameGenre"
                :validate="isGameGenreValid"
            />
            <Input
                type="date"
                :icon="CalendarDaysIcon"
                placeholder="Insira a data de lançamento"
                v-model="dataLancamento"
                :validate="isDataValid"
            />
            <Input
                type="file"
                :icon="InboxArrowDownIcon"
                placeholder="Insira a imagem do jogo"
                :validate="isImgValid"
                @change="onImgChange"
            />
            <TextArea
                class="h-32"
                :icon="Bars3Icon"
                :validate="isDescriptionValid"
                placeholder="Insira a descrição do jogo"
                v-model="description"
            />

            <section v-if="selectedDevs.length > 0">
                <div
                    v-for="dev in selectedDevs"
                    :key="dev.empresaid"
                    @click="handleDeleteDev(dev)"
                    class="flex gap-2 items-center justify-center w-fit text-white text-opacity-75 p-4 py-2 border rounded-full border-zinc-700 hover:bg-zinc-700"
                >
                    <span class="">{{ dev.nome }} </span>
                    <XMarkIcon class="w-3 mt-1" />
                </div>
            </section>
            <div>
                <h2 class="text-white opacity-80 font-semibold mb-2">
                    Empresas desenvolvedoras
                </h2>
                <select
                    v-model="selectedDev"
                    name=""
                    id=""
                    class="w-full p-4 bg-transparent border border-zinc-700 border-opacity-80 rounded-lg text-white text-opacity-80 font-normal text-xs md:text-sm outline-none hover:bg-zinc-900 focus:bg-zinc-900 transition-colors"
                    placeholder="Selecione as empresas desenvolvedoras"
                >
                    <option
                        v-for="gameDev in gameDevs"
                        :key="gameDev.empresaid"
                        :value="gameDev.empresaid"
                    >
                        {{ gameDev.nome }}
                    </option>
                </select>
            </div>
            <div class="flex justify-end gap-5">
                <Button class="bg-zinc-600 self-end" @click="resetValues"
                    >Cancelar</Button
                >
                <Button class="bg-green-600 self-end" @click="handleSubmit"
                    >Enviar</Button
                >
            </div>
        </section>
    </div>
</template>
