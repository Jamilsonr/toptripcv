<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import SecondaryButton from '@/Components/SecondaryButton.vue';
import { Head, Link } from '@inertiajs/vue3';

defineProps({
    vacationDaysAvailable: {
        type: Number,
        required: true,
    },
    requests: {
        type: Array,
        required: true,
    },
});
</script>

<template>
    <Head title="Férias" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold leading-tight text-gray-800">
                    Férias
                </h2>
                <Link :href="route('vacations.create')">
                    <PrimaryButton>
                        Novo pedido
                    </PrimaryButton>
                </Link>
            </div>
        </template>

        <div class="py-12">
            <div class="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div class="p-6 text-gray-900">
                        Saldo disponível: <span class="font-semibold">{{ vacationDaysAvailable }}</span> dias
                    </div>
                </div>

                <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div class="p-6">
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Período
                                        </th>
                                        <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Dias úteis
                                        </th>
                                        <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Estado
                                        </th>
                                        <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-200 bg-white">
                                    <tr v-for="r in requests" :key="r.id">
                                        <td class="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                                            {{ r.start_date }} → {{ r.end_date }}
                                        </td>
                                        <td class="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                                            {{ r.business_days }}
                                        </td>
                                        <td class="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                                            <div class="space-y-1">
                                                <div>{{ r.status }}</div>
                                                <div v-if="r.rejection_reason" class="text-xs text-red-600">
                                                    {{ r.rejection_reason }}
                                                </div>
                                            </div>
                                        </td>
                                        <td class="whitespace-nowrap px-4 py-3 text-right text-sm">
                                            <Link
                                                v-if="r.status === 'pending_manager' || r.status === 'pending_rh'"
                                                :href="route('vacations.cancel', { vacationRequest: r.id })"
                                                method="post"
                                                as="button"
                                            >
                                                <SecondaryButton>
                                                    Cancelar
                                                </SecondaryButton>
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr v-if="requests.length === 0">
                                        <td colspan="4" class="px-4 py-6 text-center text-sm text-gray-500">
                                            Sem pedidos de férias.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

