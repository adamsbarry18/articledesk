#!/usr/bin/env node
/**
 * Script de validation Phase 0 — teste la connectivité et les endpoints ApiArticle.
 * Usage : npm run check:api
 *
 * Prérequis : ApiArticle démarrée (https://github.com/Chocolaterie/ApiArticle)
 */
import 'dotenv/config';

const API_BASE_URL = (process.env.API_BASE_URL || 'http://localhost:3000').replace(
  /\/$/,
  '',
);
const SUCCESS = '200';

/** Comptes mock documentés dans ApiArticle */
const MOCK_ACCOUNTS = [
  { email: 'isaac@gmail.com', password: 'password' },
  { email: 'tata@gmail.com', password: '123456' },
  { email: 'toto@gmail.com', password: '12345' },
];

const results = [];

/**
 * @param {string} label
 * @param {() => Promise<void>} fn
 */
async function test(label, fn) {
  try {
    await fn();
    results.push({ label, ok: true });
    console.log(`  ✓ ${label}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    results.push({ label, ok: false, message });
    console.error(`  ✗ ${label} — ${message}`);
  }
}

/**
 * @param {string} path
 * @param {RequestInit} [init]
 */
async function apiFetch(path, init = {}) {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...init,
  });

  let body;
  try {
    body = await response.json();
  } catch {
    throw new Error(`Réponse non-JSON depuis ${path} (HTTP ${response.status})`);
  }

  return body;
}

console.log(`\n🔍 Vérification ApiArticle — ${API_BASE_URL}\n`);

await test('GET /articles — liste des articles', async () => {
  const res = await apiFetch('/articles');
  if (res.code !== SUCCESS) throw new Error(`${res.code}: ${res.message}`);
  if (!Array.isArray(res.data) || res.data.length === 0) {
    throw new Error('data doit être un tableau non vide');
  }
});

let firstArticleId = null;

await test('GET /articles/:id — détail du premier article', async () => {
  const list = await apiFetch('/articles');
  firstArticleId = list.data[0].id;
  const res = await apiFetch(`/articles/${firstArticleId}`);
  if (res.code !== SUCCESS) throw new Error(`${res.code}: ${res.message}`);
  if (!res.data?.title) throw new Error('Article sans titre');
});

let token = null;

await test('POST /login — connexion (isaac@gmail.com)', async () => {
  const res = await apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify(MOCK_ACCOUNTS[0]),
  });
  if (res.code !== SUCCESS) throw new Error(`${res.code}: ${res.message}`);
  if (!res.data || typeof res.data !== 'string') {
    throw new Error('data doit contenir un token JWT (string)');
  }
  token = res.data;
});

await test('GET /check — validation du token JWT', async () => {
  const url = `${API_BASE_URL}/check`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const res = await response.json();
  if (!res.message?.includes('connecté')) {
    throw new Error(`Token invalide : ${res.message}`);
  }
});

await test('POST /login — échec avec mauvais mot de passe (code 768)', async () => {
  const res = await apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'isaac@gmail.com', password: 'wrong' }),
  });
  if (res.code !== '768') {
    throw new Error(`Attendu code 768, reçu ${res.code}`);
  }
});

const passed = results.filter((r) => r.ok).length;
const total = results.length;

console.log(`\n${'─'.repeat(50)}`);
console.log(`Résultat : ${passed}/${total} tests réussis`);

if (passed < total) {
  console.error(
    '\n⚠️  ApiArticle n\'est pas accessible ou mal configurée.',
    '\n   Clonez et démarrez : https://github.com/Chocolaterie/ApiArticle',
    `\n   Vérifiez API_BASE_URL dans .env (actuel : ${API_BASE_URL})\n`,
  );
  process.exit(1);
}

console.log('\n✅ ApiArticle prête — vous pouvez passer à la Phase 1 (IPC).\n');
