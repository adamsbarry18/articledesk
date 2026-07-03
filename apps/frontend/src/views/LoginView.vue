<template>
  <div class="flex min-h-[calc(100vh-0px)] items-center justify-center px-4 py-10">
    <div class="w-full max-w-md">
      <div class="mb-8 text-center">
        <div
          class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-brand-600 text-2xl font-bold text-white shadow-lg shadow-brand-600/20"
        >
          A
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Connexion</h1>
        <p class="mt-2 text-sm text-slate-500">
          Accédez à votre espace de gestion des articles
        </p>
      </div>

      <div class="card p-6 sm:p-8">
        <form class="space-y-5" @submit.prevent="handleSubmit">
          <AppInput
            id="email"
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="isaac@gmail.com"
            autocomplete="email"
            required
          />

          <AppInput
            id="password"
            v-model="form.password"
            label="Mot de passe"
            type="password"
            autocomplete="current-password"
            required
          />

          <AppAlert v-if="error">{{ error }}</AppAlert>

          <button type="submit" class="btn-primary w-full" :disabled="loading">
            <LoadingSpinner v-if="loading" />
            {{ loading ? 'Connexion…' : 'Se connecter' }}
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-slate-500">
          Pas encore de compte ?
          <router-link to="/register" class="link">S'inscrire</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '../composables/useAuth.js';
import { IpcClientError } from '../renderer/api/electronApi.js';
import AppInput from '../components/ui/AppInput.vue';
import AppAlert from '../components/ui/AppAlert.vue';
import LoadingSpinner from '../components/ui/LoadingSpinner.vue';

const router = useRouter();
const route = useRoute();
const { login, loading } = useAuth();

const form = reactive({
  email: '',
  password: '',
});

const error = ref(null);

async function handleSubmit() {
  error.value = null;

  try {
    await login({
      email: form.email.trim(),
      password: form.password,
    });
    const redirect =
      typeof route.query.redirect === 'string' ? route.query.redirect : '/articles';
    router.push(redirect);
  } catch (err) {
    error.value =
      err instanceof IpcClientError
        ? err.message
        : 'Une erreur est survenue lors de la connexion';
  }
}
</script>
