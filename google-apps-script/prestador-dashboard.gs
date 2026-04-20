const SPREADSHEET_ID = '1oGNBsVQzE9gcq9Qr4_HyCMoR7TdBiNIBAODunZRLWTg';
const SHEET_NAME = 'Respostas ao formulario 1';

const CACHE_TTL_HOURS = 4;
const CACHE_TTL_MS = CACHE_TTL_HOURS * 60 * 60 * 1000;
const SNAPSHOT_KEY_PREFIX = 'SURVEY_SNAPSHOT__';
const SNAPSHOT_SYNC_KEY_PREFIX = 'SURVEY_SNAPSHOT_SYNC__';
const SYNC_PASSWORD = 'jogajunto2026@!';

const PRESTADOR_COLUMNS = {
  timestamp: 0,
  nome: 1,
  idade: 2,
  genero: 3,
  canais: 4,
  experiencia: 5,
  servicos: 6,
  dificuldades: 7,
  teveProblemas: 8,
  problemas: 9,
  precificacao: 10,
  facilidade: 11,
  clientesMes: 12,
  respostaAberta: 13,
};

function doGet(e) {
  try {
    const period = getRequestedPeriod_(e);
    const response = getSurveyPayload_(period, false);
    return jsonOutput_(response);
  } catch (error) {
    return jsonOutput_({
      error: true,
      message: error.message,
    });
  }
}

function doPost(e) {
  try {
    const params = getRequestParams_(e);
    const action = String(params.action || '').trim().toLowerCase();

    if (action !== 'sync') {
      return jsonOutput_({
        error: true,
        message: 'Acao invalida.',
      });
    }

    validateSyncPassword_(params.password);

    const period = normalizePeriod_(params.period || 'all');
    const response = getSurveyPayload_(period, true);

    return jsonOutput_(
      Object.assign({}, response, {
        sync: {
          forced: true,
          ok: true,
          message: 'Sincronizacao concluida.',
        },
      }),
    );
  } catch (error) {
    return jsonOutput_({
      error: true,
      message: error.message,
    });
  }
}

function getSurveyPayload_(period, forceRefresh) {
  const snapshot = readSnapshot_(period);
  const now = Date.now();
  const isExpired = !snapshot || now - snapshot.syncedAtMs >= CACHE_TTL_MS;

  if (!forceRefresh && snapshot && !isExpired) {
    return withCacheMeta_(snapshot.payload, snapshot.syncedAtMs, false);
  }

  const freshPayload = buildFreshPayload_(period);
  persistSnapshot_(period, freshPayload, now);
  return withCacheMeta_(freshPayload, now, true);
}

function buildFreshPayload_(period) {
  const rows = getPrestadorRows_(period);

  return {
    meta: {
      period: period,
      cache_ttl_hours: CACHE_TTL_HOURS,
    },
    surveys: {
      contratante: createEmptyDataset_('Contratantes'),
      prestador: buildPrestadorDataset_(rows),
    },
  };
}

function getPrestadorRows_(period) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);

  if (!sheet) {
    throw new Error('Aba nao encontrada. Ajuste SHEET_NAME no Apps Script.');
  }

  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) {
    return [];
  }

  const rows = values.slice(1).map(mapPrestadorRow_);
  return applyPeriodFilter_(rows, period);
}

function mapPrestadorRow_(row) {
  return {
    timestamp: parseDate_(row[PRESTADOR_COLUMNS.timestamp]),
    nome: toText_(row[PRESTADOR_COLUMNS.nome]),
    idade: toText_(row[PRESTADOR_COLUMNS.idade]),
    genero: toText_(row[PRESTADOR_COLUMNS.genero]),
    canais: splitMultiValue_(row[PRESTADOR_COLUMNS.canais]),
    experiencia: toText_(row[PRESTADOR_COLUMNS.experiencia]),
    servicos: splitMultiValue_(row[PRESTADOR_COLUMNS.servicos]),
    dificuldades: splitMultiValue_(row[PRESTADOR_COLUMNS.dificuldades]),
    teveProblemas: toText_(row[PRESTADOR_COLUMNS.teveProblemas]),
    problemas: splitMultiValue_(row[PRESTADOR_COLUMNS.problemas]),
    precificacao: splitMultiValue_(row[PRESTADOR_COLUMNS.precificacao]),
    facilidade: parseEaseValue_(row[PRESTADOR_COLUMNS.facilidade]),
    clientesMes: toText_(row[PRESTADOR_COLUMNS.clientesMes]),
    respostaAberta: toText_(row[PRESTADOR_COLUMNS.respostaAberta]),
  };
}

function buildPrestadorDataset_(rows) {
  const responseCount = rows.length;
  const easeValues = rows
    .map(function (row) {
      return row.facilidade;
    })
    .filter(function (value) {
      return typeof value === 'number';
    });

  const difficultyCount = easeValues.filter(function (value) {
    return value <= 2;
  }).length;

  const difficultyPercentage = easeValues.length
    ? Math.round((difficultyCount / easeValues.length) * 100)
    : null;

  const channelCounts = countFlatValues_(
    rows.map(function (row) {
      return row.canais;
    }),
  );

  const clientVolumeCounts = countSingleValues_(
    rows.map(function (row) {
      return row.clientesMes;
    }),
  );

  const demographicsCounts = mergeCounts_(
    countSingleValues_(
      rows.map(function (row) {
        return row.genero;
      }),
    ),
    prefixCounts_(
      countSingleValues_(
        rows.map(function (row) {
          return row.idade;
        }),
      ),
      'Idade: ',
    ),
  );

  return {
    meta: {
      response_count: responseCount,
    },
    kpis: {
      difficulty_percentage: difficultyPercentage,
      primary_channel: getTopLabel_(channelCounts),
      ease_average: getAverage_(easeValues),
      outcome_metric: getTopLabel_(clientVolumeCounts),
    },
    channels: toChartItems_(channelCounts, responseCount),
    demographics: toChartItems_(demographicsCounts, responseCount),
    experience: toChartItems_(
      countSingleValues_(
        rows.map(function (row) {
          return row.experiencia;
        }),
      ),
      responseCount,
    ),
    services: toChartItems_(
      countFlatValues_(
        rows.map(function (row) {
          return row.servicos;
        }),
      ),
      responseCount,
    ),
    difficulties: toChartItems_(
      countFlatValues_(
        rows.map(function (row) {
          return row.dificuldades;
        }),
      ),
      responseCount,
    ),
    problems: toChartItems_(
      countFlatValues_(
        rows.map(function (row) {
          return row.problemas;
        }),
      ),
      responseCount,
    ),
    pricing: toChartItems_(
      countFlatValues_(
        rows.map(function (row) {
          return row.precificacao;
        }),
      ),
      responseCount,
    ),
    client_volume: toChartItems_(clientVolumeCounts, responseCount),
    scale: toChartItems_(countSingleValues_(easeValues), responseCount, 'count'),
    insights: buildOpenInsights_(rows),
    export: {
      sheet_name: SHEET_NAME,
      fields: [
        'nome',
        'idade',
        'genero',
        'como_encontra_clientes',
        'tempo_de_atuacao',
        'servicos_oferecidos',
        'maior_dificuldade_para_conseguir_clientes',
        'ja_teve_problemas_com_clientes',
        'problemas_enfrentados',
        'como_define_preco',
        'facilidade_para_conseguir_clientes',
        'clientes_por_mes',
        'resposta_aberta_ajuda_para_crescer',
      ],
    },
  };
}

function buildOpenInsights_(rows) {
  const answers = rows
    .map(function (row) {
      return row.respostaAberta;
    })
    .filter(Boolean);

  if (!answers.length) {
    return [];
  }

  return [
    {
      title: 'Sugestoes abertas dos prestadores',
      description:
        'Foram recebidas ' +
        answers.length +
        ' respostas abertas. Use essas respostas para categorizar temas como divulgacao, visibilidade, demanda e confianca.',
    },
  ];
}

function applyPeriodFilter_(rows, period) {
  if (!period || period === 'all') {
    return rows;
  }

  const limits = {
    '30d': 30,
    '90d': 90,
    '12m': 365,
  };

  const days = limits[period];

  if (!days) {
    return rows;
  }

  const threshold = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  return rows.filter(function (row) {
    return row.timestamp && row.timestamp >= threshold;
  });
}

function splitMultiValue_(value) {
  if (!value) {
    return [];
  }

  return String(value)
    .split(',')
    .map(function (item) {
      return item.trim();
    })
    .filter(Boolean);
}

function parseEaseValue_(value) {
  if (typeof value === 'number' && isFinite(value)) {
    return value;
  }

  const normalized = String(value || '').trim();
  const match = normalized.match(/\d+/);

  return match ? Number(match[0]) : null;
}

function parseDate_(value) {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return value;
  }

  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function toText_(value) {
  const text = String(value || '').trim();
  return text || null;
}

function countSingleValues_(values) {
  return values.reduce(function (accumulator, value) {
    if (value === null || value === undefined || value === '') {
      return accumulator;
    }

    const key = String(value).trim();

    if (!key) {
      return accumulator;
    }

    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});
}

function countFlatValues_(groups) {
  return groups.reduce(function (accumulator, items) {
    items.forEach(function (item) {
      const key = String(item || '').trim();

      if (!key) {
        return;
      }

      accumulator[key] = (accumulator[key] || 0) + 1;
    });

    return accumulator;
  }, {});
}

function prefixCounts_(counts, prefix) {
  return Object.keys(counts).reduce(function (accumulator, key) {
    accumulator[prefix + key] = counts[key];
    return accumulator;
  }, {});
}

function mergeCounts_(first, second) {
  return Object.assign({}, first, second);
}

function toChartItems_(counts, responseCount, type) {
  return Object.keys(counts)
    .sort(function (a, b) {
      return counts[b] - counts[a];
    })
    .map(function (key) {
      const value = counts[key];

      return {
        label: key,
        value: value,
        percentage: responseCount
          ? Number(((value / responseCount) * 100).toFixed(1))
          : 0,
        type: type || 'count',
      };
    });
}

function getTopLabel_(counts) {
  const sorted = Object.keys(counts).sort(function (a, b) {
    return counts[b] - counts[a];
  });

  return sorted.length ? sorted[0] : null;
}

function getAverage_(values) {
  if (!values.length) {
    return null;
  }

  const total = values.reduce(function (sum, value) {
    return sum + value;
  }, 0);

  return Number((total / values.length).toFixed(1));
}

function createEmptyDataset_(sheetName) {
  return {
    meta: {
      response_count: 0,
    },
    kpis: {
      difficulty_percentage: null,
      primary_channel: null,
      ease_average: null,
      outcome_metric: null,
    },
    channels: [],
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
    insights: [],
    export: {
      sheet_name: sheetName,
      fields: [],
    },
  };
}

function getRequestedPeriod_(e) {
  return normalizePeriod_(
    e && e.parameter ? e.parameter.period || 'all' : 'all',
  );
}

function normalizePeriod_(value) {
  const period = String(value || 'all').trim().toLowerCase();
  const valid = {
    all: true,
    '30d': true,
    '90d': true,
    '12m': true,
  };

  return valid[period] ? period : 'all';
}

function getRequestParams_(e) {
  const params = e && e.parameter ? e.parameter : {};

  if (e && e.postData && e.postData.contents) {
    const parsed = parseRequestBody_(e.postData.contents);
    return Object.assign({}, params, parsed);
  }

  return params;
}

function parseRequestBody_(body) {
  if (!body) {
    return {};
  }

  try {
    return JSON.parse(body);
  } catch (error) {
    return body.split('&').reduce(function (accumulator, part) {
      const pieces = part.split('=');
      const rawKey = pieces.shift();
      const rawValue = pieces.join('=');

      if (!rawKey) {
        return accumulator;
      }

      const key = decodeURIComponent(rawKey.replace(/\+/g, ' '));
      const value = decodeURIComponent(String(rawValue || '').replace(/\+/g, ' '));
      accumulator[key] = value;
      return accumulator;
    }, {});
  }
}

function validateSyncPassword_(password) {
  if (String(password || '') !== SYNC_PASSWORD) {
    throw new Error('Senha invalida.');
  }
}

function readSnapshot_(period) {
  const properties = PropertiesService.getScriptProperties();
  const payload = properties.getProperty(SNAPSHOT_KEY_PREFIX + period);
  const syncedAt = properties.getProperty(SNAPSHOT_SYNC_KEY_PREFIX + period);

  if (!payload || !syncedAt) {
    return null;
  }

  return {
    payload: JSON.parse(payload),
    syncedAtMs: Number(syncedAt),
  };
}

function persistSnapshot_(period, payload, syncedAtMs) {
  const properties = PropertiesService.getScriptProperties();
  properties.setProperty(SNAPSHOT_KEY_PREFIX + period, JSON.stringify(payload));
  properties.setProperty(SNAPSHOT_SYNC_KEY_PREFIX + period, String(syncedAtMs));
}

function withCacheMeta_(payload, syncedAtMs, refreshedNow) {
  const expiresAtMs = syncedAtMs + CACHE_TTL_MS;
  const nextPayload = JSON.parse(JSON.stringify(payload));

  nextPayload.meta = Object.assign({}, nextPayload.meta, {
    cache_ttl_hours: CACHE_TTL_HOURS,
    cache_refreshed_now: refreshedNow,
    cached_at: new Date(syncedAtMs).toISOString(),
    cache_expires_at: new Date(expiresAtMs).toISOString(),
  });

  return nextPayload;
}

function jsonOutput_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
