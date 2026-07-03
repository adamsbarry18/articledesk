<template>
  <div class="page-container">
    <div class="mb-8">
      <h1 class="text-2xl font-bold tracking-tight text-slate-900">Inscription</h1>
      <p class="mt-1 text-sm text-slate-500">
        Créez votre compte pour gérer les articles
      </p>
    </div>

    <div class="card p-6 sm:p-8">
      <form class="space-y-5" @submit.prevent="handleSubmit">
        <AppInput
          id="email"
          v-model="form.email"
          label="Email"
          type="email"
          autocomplete="email"
          required
        />

        <AppInput
          id="password"
          v-model="form.password"
          label="Mot de passe"
          type="password"
          autocomplete="new-password"
          required
        />

        <AppInput
          id="passwordConfirm"
          v-model="form.passwordConfirm"
          label="Confirmer le mot de passe"
          type="password"
          autocomplete="new-password"
          required
        />

        <AppInput
          id="pseudo"
          v-model="form.pseudo"
          label="Pseudo"
          type="text"
          required
        />

        <div class="grid gap-5 sm:grid-cols-2">
          <AppInput
            id="cityCode"
            v-model="form.cityCode"
            label="Code postal"
            type="text"
            required
          />
          <AppInput
            id="city"
            v-model="form.city"
            label="Ville"
            type="text"
            required
          />
        </div>

        <AppInput
          id="phone"
          v-model="form.phone"
          label="Téléphone"
          type="tel"
          required
        />

        <AppAlert v-if="error">{{ error }}</AppAlert>
        <AppAlert v-if="success" variant="success">{{ success }}</AppAlert>

        <button type="submit" class="btn-primary w-full" :disabled="loading">
          <LoadingSpinner v-if="loading" />
          {{ loading ? 'Inscription…' : "S'inscrire" }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-slate-500">
        Déjà un compte ?
        <router-link to="/login" class="link">Se connecter</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth.js';
import { IpcClientError } from '../renderer/api/electronApi.js';
import AppInput from '../components/ui/AppInput.vue';
import AppAlert from '../components/ui/AppAlert.vue';
import LoadingSpinner from '../components/ui/LoadingSpinner.vue';

const router = useRouter();
const { register, loading } = useAuth();

const form = reactive({
  email: '',
  password: '',
  passwordConfirm: '',
  pseudo: '',
  cityCode: '',
  city: '',
  phone: '',
});

const error = ref(null);
const success = ref(null);

async function handleSubmit() {
  error.value = null;
  success.value = null;

  if (form.password !== form.passwordConfirm) {
    error.value = 'Les mots de passe ne correspondent pas';
    return;
  }

  try {
    await register({
      email: form.email.trim(),
      password: form.password,
      passwordConfirm: form.passwordConfirm,
      pseudo: form.pseudo.trim(),
      cityCode: form.cityCode.trim(),
      city: form.city.trim(),
      phone: form.phone.trim(),
    });
    success.value = 'Inscription réussie ! Redirection vers la connexion…';
    setTimeout(() => router.push('/login'), 1500);
  } catch (err) {
    error.value =
      err instanceof IpcClientError
        ? err.message
        : "Une erreur est survenue lors de l'inscription";
  }
}
</script>
