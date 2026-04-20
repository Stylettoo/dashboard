import {
  createEmptySurveyResponse,
  normalizeSurveyResponse,
} from '../types/survey';

const PUBLIC_SURVEY_API_URL = import.meta.env.VITE_SURVEY_API_URL || '';

function getSurveyApiUrl() {
  if (!PUBLIC_SURVEY_API_URL) {
    throw new Error(
      'API de survey nao configurada. Defina VITE_SURVEY_API_URL para apontar ao Apps Script.',
    );
  }

  return PUBLIC_SURVEY_API_URL;
}

/**
 * Busca dados reais do survey a partir de uma API externa.
 *
 * Para integrar com Google Sheets + Google Apps Script:
 * 1. Crie um Apps Script publicado como Web App.
 * 2. Faca o script responder JSON no formato esperado pelo dashboard.
 * 3. Defina VITE_SURVEY_API_URL apontando ao Apps Script publicado.
 *
 * @param {{ period?: string, signal?: AbortSignal }} [options]
 */
export async function fetchSurveyData(options = {}) {
  const { period = 'all', signal } = options;
  const url = new URL(getSurveyApiUrl());

  if (period && period !== 'all') {
    url.searchParams.set('period', period);
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    if (response.status === 404 || response.status === 502 || response.status === 504) {
      throw new Error('A API publica de survey nao respondeu corretamente.');
    }

    throw new Error('A API respondeu com erro ao carregar o survey.');
  }

  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    return createEmptySurveyResponse();
  }

  const payload = await response.json();

  return normalizeSurveyResponse(payload || createEmptySurveyResponse());
}

/**
 * Dispara uma sincronizacao protegida por senha no backend.
 *
 * A senha e validada apenas no Apps Script. O frontend apenas encaminha
 * o valor informado pelo usuario no momento da sincronizacao.
 *
 * @param {{ password: string, period?: string, signal?: AbortSignal }} options
 */
export async function syncSurveyData(options) {
  const { password, period = 'all', signal } = options || {};

  const body = new URLSearchParams();
  body.set('action', 'sync');
  body.set('password', password || '');

  if (period && period !== 'all') {
    body.set('period', period);
  }

  const response = await fetch(getSurveyApiUrl(), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: body.toString(),
    signal,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok || payload?.error) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Senha de sincronizacao invalida.');
    }

    throw new Error(payload?.message || 'Nao foi possivel sincronizar agora.');
  }

  return payload;
}
