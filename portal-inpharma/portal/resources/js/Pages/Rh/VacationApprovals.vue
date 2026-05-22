<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import InputError from '@/Components/InputError.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import SecondaryButton from '@/Components/SecondaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Head, router, useForm } from '@inertiajs/vue3';
import { reactive } from 'vue';

defineProps({
    requests: {
        type: Array,
        required: true,
    },
});

const rejection = reactive({});
const rejectForm = useForm({
    rejection_reason: '',
});

const approve = (id) => {
    router.post(route('rh.vacations.approve', { vacationRequest: id }));
};

const reject = (id) => {
    rejectForm.rejection_reason = rejection[id] || '';
    rejectForm.post(route('rh.vacations.reject', { vacationRequest: id }), {
        preserveScroll: true,
        onSuccess: () => {
            rejection[id] = '';
        },
    });
};
</script>

<template>
    <Head title="Aprovações (RH) - Férias" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="text-xl font-semibold leading-tight text-gray-800">
                Aprovações (RH) - Férias
            </h2>
        </template>

        <div class="py-12">
            <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div class="p-6">
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Colaborador
                                        </th>
                                        <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Período
                                        </th>
                                        <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Dias úteis
                                        </th>
                                        <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-200 bg-white">
                                    <tr v-for="r in requests" :key="r.id">
                                        <td class="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                                            {{ r.employee_name }}
                                        </td>
                                        <td class="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                                            {{ r.start_date }} → {{ r.end_date }}
                                        </td>
                                        <td class="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                                            {{ r.business_days }}
                                        </td>
                                        <td class="px-4 py-3 text-right text-sm">
                                            <div class="flex flex-col items-end gap-2">
                                                <div class="flex items-center gap-2">
                                                    <PrimaryButton type="button" @click="approve(r.id)">
                                                        Aprovar
                                                    </PrimaryButton>
                                                </div>

                                                <div class="w-full max-w-md">
                                                    <TextInput
                                                        type="text"
                                                        class="w-full"
                                                        v-model="rejection[r.id]"
                                                        placeholder="Motivo da rejeição"
                                                    />
                                                    <InputError class="mt-1" :message="rejectForm.errors.rejection_reason" />
                                                </div>

                                                <SecondaryButton type="button" @click="reject(r.id)">
                                                    Rejeitar
                                                </SecondaryButton>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="requests.length === 0">
                                        <td colspan="4" class="px-4 py-6 text-center text-sm text-gray-500">
                                            Sem pedidos pendentes.
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

