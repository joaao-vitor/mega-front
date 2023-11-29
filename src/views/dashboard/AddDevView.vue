<script>
import { watch, ref } from 'vue'
import { useUserStore } from '../../stores/UserStore'
import Input from '../../components/Input.vue'
import { storeToRefs } from 'pinia'
import TextArea from '../../components/TextArea.vue'
import {
    Bars3Icon,
    PhoneIcon,
    UserIcon,
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
        const devName = ref('')
        const isDevNameValid = ref({
            isValid: devName.value.length > 0,
            error: 'Insira o nome da empresa',
        })

        watch(
            devName,
            () => (isDevNameValid.value.isValid = devName.value.length > 0),
            {}
        )

        const devContact = ref('')
        const isDevContactValid = ref({
            isValid: !!devContact.value,
            error: 'Insira o contato da empresa',
        })
        watch(
            devContact,
            () => (isDevContactValid.value.isValid = !!devContact.value),
            {}
        )

        const description = ref('')
        const isDescriptionValid = ref({
            isValid: description.value.length > 0,
            error: 'Insira a descrição da empresa',
        })
        watch(
            description,
            () =>
            (isDescriptionValid.value.isValid =
                description.value.length > 0 &&
                description.value.length < 250),
            {}
        )

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
            devName.value = ''
            description.value = ''
            devContact.value = ''
        }
        const submitDev = async (empresa) => {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/jogos/addc`,
                empresa
            )
            return data
        }
        const handleSubmit = async () => {
            if (
                !isDevNameValid.value.isValid ||
                !isDescriptionValid.value.isValid
            ) {
                showError('Preencha todos os campos corretamente')
                return
            }

            try {
                const empresa = {
                    nome: devName.value,
                    descricao: description.value,
                    contato: devContact.value,
                }
                submitDev(empresa)
                showSuccess('Empresa inserida com sucesso!')
                resetValues()
            } catch (error) {
                showSuccess('Ocorreu um erro a inserir a empresa')
                console.log(error)
            }
        }
        return {
            UserStore,
            isAdmin,
            devName,
            isDevNameValid,
            description,
            isDescriptionValid,
            resetValues,
            handleSubmit,
            UserIcon,
            PhoneIcon,
            devContact,
            isDevContactValid,
            Bars3Icon,
        }
    },
}
</script>

<template>
    <div v-if="isAdmin" class="w-full min-h-screen flex flex-col items-start p-6 md:p-12">
        <nav class="mb-3">
            <ul>
                <li class="text-cyan-700 font-semibold text-sm">
                    <router-link to="/dashboard">Voltar ao painel</router-link>
                </li>
            </ul>
        </nav>
        <section class="w-full flex flex-col gap-5">
            <h2 class="text-white opacity-80 font-semibold mb-2">
                Dados da empresa
            </h2>
            <Input type="text" :icon="UserIcon" placeholder="Insira o nome da empresa" v-model="devName"
                :validate="isDevNameValid" />
            <Input type="number" :icon="PhoneIcon" placeholder="Insira o contato da empresa" v-model="devContact"
                :validate="isDevContactValid" />
            <TextArea class="h-32" :icon="Bars3Icon" :validate="isDescriptionValid"
                placeholder="Insira a descrição da empresa" v-model="description" />
            <div class="flex justify-end gap-5">
                <Button class="bg-zinc-600 self-end" @click="resetValues">Cancelar</Button>
                <Button class="bg-green-600 self-end" @click="handleSubmit">Enviar</Button>
            </div>
        </section>
    </div>
</template>
