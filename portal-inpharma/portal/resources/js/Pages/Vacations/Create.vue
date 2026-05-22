<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';

defineProps({
    vacationDaysAvailable: {
        type: Number,
        required: true,
    },
});

const form = useForm({
    start_date: '',
    end_date: '',
    reason: '',
});
</script>

<template>
    <Head title="Novo pedido de férias" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold leading-tight text-gray-800">
                    Novo pedido de férias
                </h2>
                <Link :href="route('vacations.index')" class="text-sm text-gray-600 hover:text-gray-900">
                    Voltar
                </Link>
            </div>
        </template>

        <div class="py-12">
            <div class="mx-auto max-w-3xl sm:px-6 lg:px-8">
                <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div class="p-6">
                        <div class="mb-6 text-sm text-gray-700">
                            Saldo disponível: <span class="font-semibold">{{ vacationDaysAvailable }}</span> dias (dias úteis).
                        </div>

                        <form @submit.prevent="form.post(route('vacations.store'))" class="space-y-6">
                            <div>
                                <InputLabel for="start_date" value="Data de início" />
                                <TextInput
                                    id="start_date"
                                    type="date"
                                    class="mt-1 block w-full"
                                    v-model="form.start_date"
                                    required
                                />
                                <InputError class="mt-2" :message="form.errors.start_date" />
                            </div>

                            <div>
                                <InputLabel for="end_date" value="Data de fim" />
                                <TextInput
                                    id="end_date"
                                    type="date"
                                    class="mt-1 block w-full"
                                    v-model="form.end_date"
                                    required
                                />
                                <InputError class="mt-2" :message="form.errors.end_date" />
                            </div>

                            <div>
                                <InputLabel for="reason" value="Motivo (opcional)" />
                                <textarea
                                    id="reason"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    rows="4"
                                    v-model="form.reason"
                                />
                                <InputError class="mt-2" :message="form.errors.reason" />
                            </div>

                            <div class="flex items-center gap-4">
                                <PrimaryButton :disabled="form.processing">
                                    Submeter pedido
                                </PrimaryButton>
                                <div v-if="form.recentlySuccessful" class="text-sm text-gray-600">
                                    Pedido submetido.
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

