<script>
import Button from './Button.vue';
import Input from './Input.vue';
import Google from './Icons/Google.vue';
import {
    XMarkIcon
} from '@heroicons/vue/24/solid'

export default {
    props: {
        modalShown: {
            type: Boolean,
            required: true,
        },
        type: {
            type: String,
            default: 'large',
            validator(value) {
                return ['small', 'medium', 'large'].includes(value)
            },
        }
    },
    data() {
        return {
        };
    },
    components: { Button, Google, Input, XMarkIcon },
    mounted() {
        window.addEventListener('keydown', this.handleKeyDown)
    },
    methods: {
        handleKeyDown(e) {
            if (e.key === 'Escape') {
                this.$emit('close')
                window.removeEventListener('keydown', this.handleKeyDown)
            }
        },
        hideModal() {
            this.$emit('close')
        },
    },
}
</script>
<template>
    <Transition name="fade">

        <div v-if="modalShown" class="font-inter fixed inset-0 z-30 flex justify-center items-center">
            <div>
            </div>
            <div class="bg-zinc-950 w-full h-full flex flex-col justify-center items-center 
        md:max-w-sm md:h-5/6 md:rounded-lg md:shadow-md z-50 relative" @click="(e) => e.stopPropagation()">
                <button class="w-6 h-6 text-white absolute right-6 top-6 hover:scale-105 transition-transform"
                    @click="hideModal">
                    <XMarkIcon />
                </button>
                <header class="flex justify-center items-center flex-col w-9/12">
                    <slot name="header">
                    </slot>
                </header>
                <section class="w-9/12 flex flex-col gap-3">
                    <slot name="content">
                    </slot>
                </section>
                <footer class="w-9/12 flex flex-col gap-3 mt-5">
                    <slot name="footer">
                        
                    </slot>
                </footer>
            </div>
            <div v-if="modalShown" @click="hideModal" class="fixed inset-0 z-40 bg-black-1000 opacity-40"></div>
        </div>
    </Transition>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>