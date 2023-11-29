<script>
import { ref } from 'vue'
import Modal from '../Modal.vue'
import Button from '../Button.vue'
import Google from '../Icons/Google.vue'
import Input from '../Input.vue'
import axios from 'axios'
import Loading from '../Loading.vue'

import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/vue/24/solid'

import { useUserStore } from '../../stores/UserStore'
export default {
    //mixins: [notify],
    props: {
        modalLogin: {
            type: Boolean,
            required: true,
        },
    },
    setup(props, { emit }) {
        const UserStore = useUserStore()


        const registerForm = ref(false)
        const name = ref('')
        const email = ref('')
        const password = ref('')
        const confirmPassword = ref('')
        const submitted = ref(false)
        const loading = ref(false)

        const validName = ref({
            isValid: true,
            error: 'O nome não pode estar vazio',
        })
        const validEmail = ref({
            isValid: true,
            error: 'Insira um email válido!',
        })
        const validPassword = ref({
            isValid: true,
            error: 'Insira uma senha de no mínimo 8 caracteres, 1 letra maiúscula e 1 caractere especial',
        })
        const validConfirmPassword = ref({
            isValid: true,
            error: 'A senha deve ser a mesma da anterior',
        })

        const toggleRegister = () => {
            registerForm.value = !registerForm.value
            resetValues()
        }

        const validateName = () => {
            validName.value.isValid = name.value.length > 0
        }

        const validateEmail = () => {
            const regex =
                /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
            validEmail.value.isValid = regex.test(email.value)
        }

        const validatePassword = () => {
            const regex =
                /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
            validPassword.value.isValid = regex.test(password.value)
        }

        const validateConfirmPass = () => {
            validConfirmPassword.value.isValid =
                password.value === confirmPassword.value && validPassword.value
        }

        const resetValues = () => {
            name.value = ''
            email.value = ''
            password.value = ''
            confirmPassword.value = ''

            loading.value = false
            submitted.value = false

            validName.value.isValid = true
            validEmail.value.isValid = true
            validPassword.value.isValid = true
            validConfirmPassword.value.isValid = true
        }

        const closeModal = () => {
            registerForm.value = false
            emit('close')
        }

        const handleSubmit = () => {
            if (registerForm.value) register()
            else login()
        }

        const register = async () => {
            if (
                !validName.value.isValid ||
                !validEmail.value.isValid ||
                !validPassword.value.isValid ||
                !validConfirmPassword.value.isValid
            ) {
                //showError('Preencha todos os campos corretamente')
                return
            }
            const user = {
                name: name.value,
                email: email.value,
                password: password.value,
                confirmPassword: confirmPassword.value,
            }

            try {
                const apiUrl = import.meta.env.VITE_API_URL + '/auth/register'
                loading.value = true
                const res = await axios.post(apiUrl, user)
                submitted.value = true
                loading.value = false
            } catch (error) {
                const msg = error.response.data.msg
                loading.value = false
                //showError(msg)
            }
        }

        const login = async () => {
            loading.value = true
            const loginUser = { email: email.value, password: password.value }
            try {
                const { data } = await axios.post(
                    `/api/auth/login`,
                    loginUser
                )
                UserStore.saveUser(data.user)
                resetValues()
                closeModal()
            } catch (error) {
                const msg = error.response.data.msg
                loading.value = false
                //showError(msg)
            }
        }

        return {
            registerForm,
            name,
            email,
            password,
            confirmPassword,
            submitted,
            loading,
            validName,
            validEmail,
            validPassword,
            validConfirmPassword,
            toggleRegister,
            validateName,
            validateEmail,
            validatePassword,
            validateConfirmPass,
            resetValues,
            closeModal,
            handleSubmit,
            register,
            login,
            EnvelopeIcon,
            LockClosedIcon,
            UserIcon,
        }
    },
    components: {
        Button,
        Google,
        Input,
        EnvelopeIcon,
        LockClosedIcon,
        Modal,
        Loading,
    },
}
</script>

<template>
    <Modal :modalShown="modalLogin" @close="closeModal" class="z-50">
        <template #content v-if="loading">
            <div class="flex items-center justify-center">
                <Loading />
            </div>
        </template>
        <template #content v-if="submitted && !loading">
            <div class="flex text-white flex-col items-center justify-center">
                <h1 class="text-xl text-green-600 font-bold">
                    Cadastro com sucesso!
                </h1>
                <p class="text-white">Verifique seu email para continuar.</p>
            </div>
        </template>
        <template #header v-if="!submitted && !loading">
            <h2 class="text-white text-opacity-90 font-semibold text-xl mb-5">
                Entre e aproveite!
            </h2>
            <Button
                class="w-full flex gap-4 justify-center items-center px-7 py-3 border border-zinc-700 border-opacity-80 font-semibold rounded-lg"
            >
                <Google />Continuar com o Google
            </Button>
            <hr
                class="border border-zinc-700 border-opacity-80 w-full mt-5 mb-5"
            />
        </template>
        <template #content v-if="!submitted && !loading">
            <Input
                v-model="name"
                v-if="registerForm"
                type="text"
                id="name"
                placeholder="Insira o seu nome"
                :icon="UserIcon"
                :validate="validName"
                @input="validateName"
            />
            <Input
                v-model="email"
                type="text"
                id="email"
                placeholder="Insira o seu email"
                :icon="EnvelopeIcon"
                :validate="validEmail"
                @input="validateEmail"
            />
            <Input
                v-model="password"
                type="password"
                id="password"
                placeholder="Insira o sua senha"
                :icon="LockClosedIcon"
                :validate="validPassword"
                @input="validatePassword"
            />
            <Input
                v-model="confirmPassword"
                v-if="registerForm"
                type="password"
                id="confirm-password"
                placeholder="Confirme sua senha"
                :icon="LockClosedIcon"
                :validate="validConfirmPassword"
                @input="validateConfirmPass"
            />
        </template>
        <template #footer class="flex-col" v-if="!submitted && !loading">
            <Button
                class="font-normal col-span-2"
                :class="{
                    'bg-violet-600': !registerForm,
                    'bg-sky-800': registerForm,
                }"
                @click="handleSubmit"
                >{{ !registerForm ? 'Entrar' : 'Registrar-se' }}</Button
            >
            <Button
                class="bg-zinc-700 bg-opacity-80 font-normal col-span-2"
                @click="toggleRegister"
            >
                {{
                    !registerForm
                        ? 'Não possui uma conta? Clique aqui!'
                        : 'Já possui uma conta? Clique aqui!'
                }}
            </Button>
        </template>
    </Modal>
</template>
