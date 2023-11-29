<script>
import { CheckCircleIcon } from '@heroicons/vue/24/solid'
export default {
    components: {
        CheckCircleIcon,
    },
}
</script>
<template>
    <NotificationGroup group="success">
        <div
            class="fixed inset-0 flex items-start justify-end p-4 px-3 py-6 pointer-events-none z-40"
        >
            <div class="w-full max-w-sm">
                <Notification
                    v-slot="{ notifications }"
                    enter="transform ease-out duration-300 transition"
                    enter-from="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
                    enter-to="translate-y-0 opacity-100 sm:translate-x-0"
                    leave="transition ease-in duration-500"
                    leave-from="opacity-100"
                    leave-to="opacity-0"
                    move="transition duration-1000"
                    move-delay="delay-300"
                >
                    <div
                        class="flex w-full max-w-sm mt-4 overflow-hidden bg-black-1000 rounded-lg shadow-md"
                        v-for="notification in notifications"
                        :key="notification.id"
                    >
                        <div class="py-4 flex px-6">
                            <CheckCircleIcon class="w-6 text-green-600" />
                            <div class="mx-3">
                                <span class="font-semibold text-green-500">{{
                                    notification.title
                                }}</span>
                                <p class="text-sm text-gray-200">
                                    {{ notification.text }}
                                </p>
                            </div>
                        </div>
                    </div>
                </Notification>
            </div>
        </div>
    </NotificationGroup>
    
    <NotificationGroup group="error">
        <div
            class="fixed inset-0 flex items-start justify-end p-4 px-3 py-6 pointer-events-none z-40"
        >
            <div class="w-full max-w-sm">
                <Notification
                    v-slot="{ notifications }"
                    enter="transform ease-out duration-300 transition"
                    enter-from="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
                    enter-to="translate-y-0 opacity-100 sm:translate-x-0"
                    leave="transition ease-in duration-500"
                    leave-from="opacity-100"
                    leave-to="opacity-0"
                    move="transition duration-1000"
                    move-delay="delay-300"
                >
                    <div
                        class="flex w-full max-w-sm mt-4 overflow-hidden bg-black-1000 rounded-lg shadow-md"
                        v-for="notification in notifications"
                        :key="notification.id"
                    >
                        <div class="py-4 flex px-6">
                            <CheckCircleIcon class="w-6 text-red-600" />
                            <div class="mx-3">
                                <span class="font-semibold text-red-500">{{
                                    notification.title
                                }}</span>
                                <p class="text-sm text-gray-200">
                                    {{ notification.text }}
                                </p>
                            </div>
                        </div>
                    </div>
                </Notification>
            </div>
        </div>
    </NotificationGroup>
</template>
