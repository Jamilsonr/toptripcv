<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import SecondaryButton from '@/Components/SecondaryButton.vue';
import { Head, Link } from '@inertiajs/vue3';

defineProps({
    notifications: {
        type: Array,
        required: true,
    },
});

const formatNotification = (n) => {
    if (n.type === 'VacationRequestStatusNotification') {
        const id = n.data.vacation_request_id;
        const status = n.data.status;
        return `Pedido de férias #${id}: ${status}`;
    }

    return n.type;
};
</script>

<template>
    <Head title="Notificações" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="text-xl font-semibold leading-tight text-gray-800">
                Notificações
            </h2>
        </template>

        <div class="py-12">
            <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div class="p-6">
                        <div class="space-y-3">
                            <div
                                v-for="n in notifications"
                                :key="n.id"
                                class="flex items-center justify-between rounded-md border border-gray-200 p-4"
                            >
                                <div class="space-y-1">
                                    <div class="text-sm text-gray-900">
                                        {{ formatNotification(n) }}
                                    </div>
                                    <div class="text-xs text-gray-500">
                                        {{ n.created_at }}
                                        <span v-if="n.read_at" class="ms-2">
                                            (lida)
                                        </span>
                                    </div>
                                </div>

                                <Link
                                    v-if="!n.read_at"
                                    :href="route('notifications.read', { notificationId: n.id })"
                                    method="post"
                                    as="button"
                                >
                                    <SecondaryButton>
                                        Marcar como lida
                                    </SecondaryButton>
                                </Link>
                            </div>

                            <div v-if="notifications.length === 0" class="text-sm text-gray-500">
                                Sem notificações.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

