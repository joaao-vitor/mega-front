
<script>
import { ref, defineProps, defineEmits, defineExpose } from 'vue';

export default {
    props: {
        type: {
            type: String,
            required: true,
        },
        modelValue: String,
        validate: Object,
        id: String,
        placeholder: String,
        icon: Function,
        classes: String,
    },
    emits: ['update:modelValue', 'input', 'change'],
    setup(props, { emit }) {
        const classes = props.classes
        const updateValue = (e) => {
            emit('update:modelValue', e.target.value);
            emit('input', e.target.value);
        };
        const emitChange = (e) => emit('change', e)

        return {
            updateValue,    
            classes, 
            emitChange
        };
    },
};
</script>
<template>
    <div class="group flex items-center relative">
        <label :for="id" class="flex items-center">
            <component :is="icon" class="h-4 w-4 ml-4 text-white text-opacity-80 absolute" />
        </label>
        <input :placeholder="placeholder" :type="type" class=" h-full w-full px-6 pl-11 py-4 bg-transparent 
         border border-zinc-700 border-opacity-80 rounded-lg
          text-white text-opacity-80 font-normal text-xs md:text-sm
          outline-none hover:bg-zinc-900 focus:bg-zinc-900 transition-colors" 
            :class="{ 'border-red-600': !validate.isValid }" :value="modelValue" @input="updateValue" :id="id" @change="emitChange">
        <Transition name="fade">
            <div v-if="!validate.isValid"
                class="group-focus-within:visible invisible bg-red-600 z-30 text-white text-xs rounded py-2 px-2  absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full pointer-events-none transition-opacity duration-300">
                <div class="absolute -top-4 rotate-45 transform -translate-y-0">
                    <div class="w-3 h-3 bg-red-600 transform rotate-90 origin-bottom"></div>
                </div>
                {{ validate.error }}
            </div>
        </Transition>
    </div>
</template>
<style scoped></style>