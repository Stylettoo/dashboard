import { getSurveyConfig, normalizeCategoryKey } from '../lib/dashboard';

/**
 * @typedef {Object} SurveyBarItem
 * @property {string} label
 * @property {number} value
 * @property {number | null} [percentage]
 * @property {'count' | 'percentage'} [type]
 *
 * @typedef {Object} SurveyInsight
 * @property {string} title
 * @property {string} description
 *
 * @typedef {Object} SurveyHeroInsight
 * @property {string} label
 * @property {string} title
 * @property {string} description
 *
 * @typedef {Object} SurveyExportConfig
 * @property {string | null} sheetName
 * @property {string[]} fields
 *
 * @typedef {Object} SurveyKpis
 * @property {number | null} difficulty_percentage
 * @property {string | null} primary_channel
 * @property {number | null} ease_average
 * @property {string | null} outcome_metric
 *
 * @typedef {Object} SurveyDataset
 * @property {SurveyKpis} kpis
 * @property {SurveyBarItem[]} channels
 * @property {SurveyBarItem[]} gender
 * @property {SurveyBarItem[]} age_groups
 * @property {SurveyBarItem[]} demographics
 * @property {SurveyBarItem[]} recency
 * @property {SurveyBarItem[]} experience
 * @property {SurveyBarItem[]} services
 * @property {SurveyBarItem[]} difficulties
 * @property {SurveyBarItem[]} problems
 * @property {SurveyBarItem[]} pricing
 * @property {SurveyBarItem[]} criteria
 * @property {SurveyBarItem[]} trust
 * @property {SurveyBarItem[]} scale
 * @property {SurveyBarItem[]} hiring_time
 * @property {SurveyBarItem[]} client_volume
 * @property {SurveyInsight[]} insights
 * @property {SurveyHeroInsight | null} heroInsight
 * @property {SurveyExportConfig} exportConfig
 * @property {{ isEmpty: boolean, responseCount: number }} meta
 *
 * @typedef {Object} SurveyResponse
 * @property {{ contratante: SurveyDataset, prestador: SurveyDataset }} surveys
 * @property {{ isEmpty: boolean }} meta
 */

const DATASET_KEYS = [
  'channels',
  'gender',
  'age_groups',
  'demographics',
  'recency',
  'experience',
  'services',
  'difficulties',
  'problems',
  'pricing',
  'criteria',
  'trust',
  'scale',
  'hiring_time',
  'client_volume',
];

export function createEmptySurveyDataset(kind = 'contratante') {
  const defaults = createDefaultSections(kind);

  return {
    kpis: {
      difficulty_percentage: null,
      primary_channel: null,
      ease_average: null,
      outcome_metric: null,
    },
    channels: defaults.channels,
    gender: defaults.gender,
    age_groups: defaults.age_groups,
    demographics: defaults.demographics,
    recency: defaults.recency,
    experience: defaults.experience,
    services: defaults.services,
    difficulties: defaults.difficulties,
    problems: defaults.problems,
    pricing: defaults.pricing,
    criteria: defaults.criteria,
    trust: defaults.trust,
    scale: defaults.scale,
    hiring_time: defaults.hiring_time,
    client_volume: defaults.client_volume,
    insights: [],
    heroInsight: null,
    exportConfig: {
      sheetName: null,
      fields: [],
    },
    meta: {
      isEmpty: true,
      responseCount: 0,
    },
  };
}

export function createEmptySurveyResponse() {
  return {
    surveys: {
      contratante: createEmptySurveyDataset('contratante'),
      prestador: createEmptySurveyDataset('prestador'),
    },
    meta: {
      isEmpty: true,
    },
  };
}

function toNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const normalized = Number(value.replace(',', '.'));
    return Number.isFinite(normalized) ? normalized : null;
  }

  return null;
}

function toText(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function normalizeBarItem(item) {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const label = toText(item.label);
  const value = toNumber(item.value);

  if (!label || value === null) {
    return null;
  }

  return {
    label,
    value,
    percentage: toNumber(item.percentage),
    type: item.type === 'percentage' ? 'percentage' : 'count',
  };
}

function normalizeInsight(item) {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const title = toText(item.title);
  const description = toText(item.description);

  if (!title || !description) {
    return null;
  }

  return { title, description };
}

function normalizeHeroInsight(value) {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const label = toText(value.label) || 'Insight vindo da API';
  const title = toText(value.title);
  const description = toText(value.description);

  if (!title || !description) {
    return null;
  }

  return { label, title, description };
}

function normalizeBarCollection(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(normalizeBarItem).filter(Boolean);
}

function normalizeExportConfig(value, fallbackSheetName) {
  if (!value || typeof value !== 'object') {
    return {
      sheetName: fallbackSheetName,
      fields: [],
    };
  }

  return {
    sheetName: toText(value.sheetName || value.sheet_name) || fallbackSheetName,
    fields: Array.isArray(value.fields)
      ? value.fields.filter((field) => typeof field === 'string' && field.trim())
      : [],
  };
}

function hasMeaningfulData(dataset) {
  const kpiValues = Object.values(dataset.kpis).filter(
    (value) => value !== null && value !== '',
  );

  return (
    kpiValues.length > 0 ||
    DATASET_KEYS.some((key) =>
      dataset[key].some((item) => (item?.value || 0) > 0),
    ) ||
    dataset.insights.length > 0 ||
    Boolean(dataset.heroInsight)
  );
}

function readCollection(source, aliases) {
  for (const alias of aliases) {
    if (alias in source) {
      return normalizeBarCollection(source[alias]);
    }
  }

  return [];
}

function normalizeDataset(value, fallbackSheetName, kind) {
  const safeBase = createEmptySurveyDataset(kind);

  if (!value || typeof value !== 'object') {
    return {
      ...safeBase,
      exportConfig: {
        ...safeBase.exportConfig,
        sheetName: fallbackSheetName,
      },
    };
  }

  const rawKpis = value.kpis && typeof value.kpis === 'object' ? value.kpis : {};

  const normalized = {
    kpis: {
      difficulty_percentage: toNumber(
        rawKpis.difficulty_percentage ?? rawKpis.dificuldade,
      ),
      primary_channel: toText(
        rawKpis.primary_channel ?? rawKpis.canal_principal,
      ),
      ease_average: toNumber(rawKpis.ease_average ?? rawKpis.facilidade_media),
      outcome_metric: toText(rawKpis.outcome_metric ?? rawKpis.tempo_medio),
    },
    channels: mergeCollectionWithDefaults(
      readCollection(value, ['channels', 'canais']),
      safeBase.channels,
    ),
    gender: mergeCollectionWithDefaults(
      readCollection(value, ['gender', 'genero']),
      extractGenderItems(
        readCollection(value, ['demographics', 'perfil']),
        safeBase.gender,
      ),
    ),
    age_groups: mergeCollectionWithDefaults(
      readCollection(value, ['age_groups', 'idade_faixa']),
      extractAgeItems(
        readCollection(value, ['demographics', 'perfil']),
      ),
    ),
    demographics: mergeCollectionWithDefaults(
      readCollection(value, ['demographics', 'perfil']),
      safeBase.demographics,
    ),
    recency: mergeCollectionWithDefaults(
      readCollection(value, ['recency', 'recencia']),
      safeBase.recency,
    ),
    experience: mergeCollectionWithDefaults(
      readCollection(value, ['experience', 'experiencia']),
      safeBase.experience,
    ),
    services: mergeCollectionWithDefaults(
      readCollection(value, ['services', 'servicos']),
      safeBase.services,
    ),
    difficulties: mergeCollectionWithDefaults(
      readCollection(value, ['difficulties', 'dificuldades']),
      safeBase.difficulties,
    ),
    problems: mergeCollectionWithDefaults(
      readCollection(value, ['problems', 'problemas']),
      safeBase.problems,
    ),
    pricing: mergeCollectionWithDefaults(
      readCollection(value, ['pricing', 'precificacao']),
      safeBase.pricing,
    ),
    criteria: mergeCollectionWithDefaults(
      readCollection(value, ['criteria', 'criterios']),
      safeBase.criteria,
    ),
    trust: mergeCollectionWithDefaults(
      readCollection(value, ['trust', 'confianca']),
      safeBase.trust,
    ),
    scale: mergeCollectionWithDefaults(
      readCollection(value, ['scale', 'escala']),
      safeBase.scale,
    ),
    hiring_time: mergeCollectionWithDefaults(
      readCollection(value, ['hiring_time', 'tempo_contratacao']),
      safeBase.hiring_time,
    ),
    client_volume: mergeCollectionWithDefaults(
      readCollection(value, ['client_volume', 'volume_clientes']),
      safeBase.client_volume,
    ),
    insights: Array.isArray(value.insights)
      ? value.insights.map(normalizeInsight).filter(Boolean)
      : [],
    heroInsight: normalizeHeroInsight(value.heroInsight || value.hero_insight),
    exportConfig: normalizeExportConfig(
      value.exportConfig || value.export || value.export_config,
      fallbackSheetName,
    ),
    meta: {
      isEmpty: true,
      responseCount: 0,
    },
  };

  normalized.meta.isEmpty = !hasMeaningfulData(normalized);
  normalized.meta.responseCount = toNumber(
    value?.meta?.response_count ?? value?.meta?.responseCount,
  ) || 0;

  return normalized;
}

/**
 * Normaliza a resposta externa para um objeto com duas visoes: contratante e
 * prestador. Aceita payload aninhado em `surveys`, payload com chaves no topo
 * ou o formato antigo de dataset unico.
 *
 * @param {unknown} response
 * @returns {SurveyResponse}
 */
export function normalizeSurveyResponse(response) {
  const safeBase = createEmptySurveyResponse();

  if (!response || typeof response !== 'object') {
    return safeBase;
  }

  const root =
    response.surveys && typeof response.surveys === 'object'
      ? response.surveys
      : response;

  const hasSeparatedDatasets =
    'contratante' in root || 'prestador' in root;

  const surveys = hasSeparatedDatasets
    ? {
        contratante: normalizeDataset(root.contratante, 'Contratantes', 'contratante'),
        prestador: normalizeDataset(root.prestador, 'Prestadores', 'prestador'),
      }
    : {
        contratante: normalizeDataset(response, 'Contratantes', 'contratante'),
        prestador: createEmptySurveyDataset('prestador'),
      };

  return {
    surveys,
    meta: {
      isEmpty:
        surveys.contratante.meta.isEmpty && surveys.prestador.meta.isEmpty,
    },
  };
}

function createDefaultSections(kind) {
  const config = getSurveyConfig(kind);

  return config.chartSections.reduce(
    (accumulator, section) => {
      accumulator[section.key] = (section.defaults || []).map((label) => ({
        label,
        value: 0,
        percentage: 0,
        type: 'count',
      }));
      return accumulator;
    },
    {
      channels: [],
      gender: [],
      age_groups: [],
      demographics: [],
      recency: [],
      experience: [],
      services: [],
      difficulties: [],
      problems: [],
      pricing: [],
      criteria: [],
      trust: [],
      scale: [],
      hiring_time: [],
      client_volume: [],
    },
  );
}

function mergeCollectionWithDefaults(items, defaults) {
  if (!defaults.length) {
    return items;
  }

  const byKey = new Map();

  defaults.forEach((item) => {
    byKey.set(normalizeCategoryKey(item.label), item);
  });

  items.forEach((item) => {
    byKey.set(normalizeCategoryKey(item.label), item);
  });

  const mergedDefaults = defaults.map((item) => {
    const key = normalizeCategoryKey(item.label);
    return byKey.get(key) || item;
  });

  const extras = items.filter((item) => {
    const key = normalizeCategoryKey(item.label);
    return !defaults.some((defaultItem) => normalizeCategoryKey(defaultItem.label) === key);
  });

  return [...mergedDefaults, ...extras];
}

function extractGenderItems(items, defaults) {
  const genderDefaults = defaults.length ? defaults : [];
  const allowedKeys = new Set(genderDefaults.map((item) => normalizeCategoryKey(item.label)));

  const matched = items.filter((item) => allowedKeys.has(normalizeCategoryKey(item.label)));
  return matched.length ? matched : genderDefaults;
}

function extractAgeItems(items) {
  return items
    .filter((item) => normalizeCategoryKey(item.label).startsWith('idade'))
    .map((item) => ({
      ...item,
      label: toAgeGroupLabel(item.label.replace(/^Idade:\s*/i, '')),
    }));
}

function toAgeGroupLabel(value) {
  const age = Number(String(value || '').trim());

  if (!Number.isFinite(age)) {
    return String(value || '').trim();
  }

  if (age <= 24) {
    return '18-24';
  }

  if (age <= 34) {
    return '25-34';
  }

  if (age <= 44) {
    return '35-44';
  }

  if (age <= 54) {
    return '45-54';
  }

  return '55+';
}
