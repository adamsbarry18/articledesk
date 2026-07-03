<template>
  <div class="page-container">
    <router-link
      :to="backLink"
      class="mb-6 inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-brand-600"
    >
      ← Annuler
    </router-link>

    <div class="mb-6">
      <h1 class="text-2xl font-bold tracking-tight text-slate-900">
        Modifier l'article
      </h1>
      <p class="mt-1 text-sm text-slate-500">
        Mettez à jour les informations de l'article
      </p>
    </div>

    <div
      v-if="loading"
      class="flex items-center justify-center gap-3 py-16 text-sm text-slate-500"
    >
      <LoadingSpinner />
      Chargement…
    </div>

    <AppAlert v-else-if="loadError">{{ loadError }}</AppAlert>

    <div v-else class="card p-6 sm:p-8">
      <form class="space-y-5" @submit.prevent="handleSubmit">
        <AppInput
          id="title"
          v-model="form.title"
          label="Titre"
          type="text"
          required
        />

        <div>
          <label for="desc" class="label">Description</label>
          <textarea
            id="desc"
            v-model="form.desc"
            class="textarea"
            rows="5"
            required
          />
        </div>

        <AppInput
          id="author"
          v-model="form.author"
          label="Auteur"
          type="text"
          required
        />

        <AppInput
          id="imgPath"
          v-model="form.imgPath"
          label="URL de l'image (optionnel)"
          type="url"
          placeholder="https://…"
        />

        <AppAlert v-if="submitError">{{ submitError }}</AppAlert>

        <div class="flex flex-wrap gap-3 pt-2">
          <button type="submit" class="btn-primary" :disabled="saving">
            <LoadingSpinner v-if="saving" />
            {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
          </button>
          <router-link :to="backLink" class="btn-secondary">
            Annuler
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import log from 'electron-log/renderer';
import {
  electronApi,
  IpcClientError,
} from '../renderer/api/electronApi.js';
import { getRouteParam } from '@shared/utils/route.js';
import AppInput from '../components/ui/AppInput.vue';
import AppAlert from '../components/ui/AppAlert.vue';
import LoadingSpinner from '../components/ui/LoadingSpinner.vue';

const route = useRoute();
const router = useRouter();

const articleId = computed(() => getRouteParam(route, 'id'));
const backLink = computed(() => `/articles/${articleId.value}`);

const form = reactive({
  title: '',
  desc: '',
  author: '',
  imgPath: '',
});

const loading = ref(true);
const saving = ref(false);
const loadError = ref(null);
const submitError = ref(null);

onMounted(async () => {
  try {
    const article = await electronApi.articles.getById(articleId.value);
    form.title = article.title;
    form.desc = article.desc;
    form.author = article.author;
    form.imgPath = article.imgPath ?? '';
  } catch (err) {
    loadError.value =
      err instanceof IpcClientError
        ? err.message
        : "Impossible de charger l'article";
    log.error(`[ArticleEdit] Échec chargement ${articleId.value}`, err);
  } finally {
    loading.value = false;
  }
});

async function handleSubmit() {
  submitError.value = null;
  saving.value = true;

  try {
    await electronApi.articles.save({
      id: articleId.value,
      title: form.title.trim(),
      desc: form.desc.trim(),
      author: form.author.trim(),
      imgPath: form.imgPath.trim() || undefined,
    });
    log.info(`[ArticleEdit] Article ${articleId.value} modifié`);
    router.push(`/articles/${articleId.value}`);
  } catch (err) {
    submitError.value =
      err instanceof IpcClientError
        ? err.message
        : "Impossible d'enregistrer l'article";
    log.error(`[ArticleEdit] Échec sauvegarde ${articleId.value}`, err);
  } finally {
    saving.value = false;
  }
}
</script>
