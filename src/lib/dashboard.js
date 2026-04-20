const numberFormatter = new Intl.NumberFormat('pt-BR');

export const surveyOptions = [
  {
    value: 'contratante',
    label: 'Contratante',
    description: 'Quem busca e contrata profissionais',
  },
  {
    value: 'prestador',
    label: 'Prestador',
    description: 'Quem oferece servicos e busca clientes',
  },
];

export const surveyConfigs = {
  contratante: {
    value: 'contratante',
    title: 'Visao do contratante',
    subtitle: 'Como clientes encontram e contratam profissionais',
    heroEmptyText:
      'Quando a API trouxer uma leitura consolidada, este resumo aparecera aqui.',
    insightDescription:
      'Leituras da pergunta aberta sobre o que facilitaria a contratacao.',
    exportConfig: {
      title: 'Campos para exportacao',
      description:
        'Estrutura prevista para consolidar respostas no Sheets e no Apps Script.',
      fields: [
        'nome',
        'idade',
        'genero',
        'como_encontra_profissionais',
        'ultima_contratacao',
        'tipos_de_servico',
        'encontra_dificuldades',
        'dificuldades_enfrentadas',
        'criterio_de_escolha',
        'sinais_de_confianca',
        'facilidade_para_encontrar',
        'tempo_para_contratar',
        'resposta_aberta_facilitadores',
      ],
    },
    kpiItems: [
      {
        key: 'difficulty_percentage',
        label: '% com dificuldade',
        description: 'Respondentes que relataram dificuldade para encontrar profissionais.',
        icon: 'sentiment_dissatisfied',
        format: 'percentage',
      },
      {
        key: 'primary_channel',
        label: 'Canal mais utilizado',
        description: 'Origem mais recorrente na busca por profissionais.',
        icon: 'travel_explore',
        format: 'text',
      },
      {
        key: 'ease_average',
        label: 'Nota media de facilidade',
        description: 'Media da escala de 1 a 5 sobre encontrar um profissional.',
        icon: 'star_half',
        format: 'score',
      },
      {
        key: 'outcome_metric',
        label: 'Tempo medio para contratar',
        description: 'Faixa media entre busca inicial e contratacao.',
        icon: 'schedule',
        format: 'text',
      },
    ],
    chartSections: [
      {
        key: 'channels',
        title: 'Canais de descoberta',
        description: 'Onde os contratantes encontram profissionais.',
        defaults: [
          'Indicacao de amigos/familia',
          'Redes sociais',
          'Google',
          'Aplicativos',
          'WhatsApp',
          'Marketplace',
          'Outro',
        ],
      },
      {
        key: 'gender',
        title: 'Genero dos respondentes',
        description: 'Distribuicao de genero.',
        visualization: 'distribution',
        order: ['Masculino', 'Feminino', 'Prefiro nao informar'],
        defaults: ['Masculino', 'Feminino', 'Prefiro nao informar'],
      },
      {
        key: 'age_groups',
        title: 'Faixa etaria',
        description: 'Distribuicao etaria.',
        visualization: 'distribution',
        defaults: ['18-24', '25-34', '35-44', '45-54', '55+'],
      },
      {
        key: 'recency',
        title: 'Recencia de contratacao',
        description: 'Ultima contratacao informada.',
        visualization: 'distribution',
        order: [
          'Ultimos 7 dias',
          'Ultimos 30 dias',
          'Ultimos 3 meses',
          'Mais de 3 meses',
          'Nunca',
        ],
        defaults: [
          'Ultimos 7 dias',
          'Ultimos 30 dias',
          'Ultimos 3 meses',
          'Mais de 3 meses',
          'Nunca',
        ],
      },
      {
        key: 'services',
        title: 'Tipos de servico contratados',
        description: 'Servicos mais buscados.',
        defaults: [
          'Eletrica',
          'Hidraulica',
          'Construcao/Reforma',
          'Limpeza',
          'Pintura',
          'Jardinagem',
          'Pequenos reparos',
          'Outro',
        ],
      },
      {
        key: 'difficulties',
        title: 'Dificuldades enfrentadas',
        description: 'Atritos na busca e contratacao.',
        defaults: [
          'Falta de confianca',
          'Dificuldade de encontrar disponivel',
          'Preco alto',
          'Falta de avaliacoes',
          'Demora na resposta',
          'Profissionais nao comparecem',
          'Falta de transparencia',
          'Outro',
        ],
      },
      {
        key: 'criteria',
        title: 'Criterios de escolha',
        description: 'O que mais pesa na decisao.',
        defaults: [
          'Preco',
          'Avaliacoes',
          'Indicacao',
          'Experiencia',
          'Rapidez',
          'Localizacao',
          'Garantia',
          'Outro',
        ],
      },
      {
        key: 'trust',
        title: 'Sinais de confianca',
        description: 'Como a confianca e avaliada.',
        defaults: [
          'Avaliacoes de outros clientes',
          'Indicacao',
          'Redes sociais',
          'Experiencia',
          'Certificacao',
          'Conversa inicial',
          'Outro',
        ],
      },
      {
        key: 'scale',
        title: 'Escala de facilidade',
        description: 'Notas de facilidade para encontrar profissionais.',
        visualization: 'distribution',
        order: ['1', '2', '3', '4', '5'],
        defaults: ['1', '2', '3', '4', '5'],
      },
      {
        key: 'hiring_time',
        title: 'Tempo para contratar',
        description: 'Tempo ate a contratacao final.',
        visualization: 'distribution',
        order: ['Menos de 1 dia', 'De 2 a 4 dias', 'De 5 a 7 dias', 'Mais de 8 dias'],
        defaults: ['Menos de 1 dia', 'De 2 a 4 dias', 'De 5 a 7 dias', 'Mais de 8 dias'],
      },
    ],
    chartGroups: [
      {
        title: 'Perfil do publico',
        description: 'Quem respondeu ao survey.',
        sections: ['gender', 'age_groups'],
      },
      {
        title: 'Descoberta e atritos',
        description: 'Onde a busca comeca e onde ela trava.',
        sections: ['channels', 'services', 'difficulties'],
      },
      {
        title: 'Ritmo da contratacao',
        description: 'Recencia e tempo ate fechar a contratacao.',
        sections: ['recency', 'hiring_time'],
      },
      {
        title: 'Escolha e confianca',
        description: 'Como a decisao final e sustentada.',
        sections: ['criteria', 'trust'],
      },
      {
        title: 'Percepcao de facilidade',
        description: 'Como o processo e percebido hoje.',
        sections: ['scale'],
      },
    ],
  },
  prestador: {
    value: 'prestador',
    title: 'Visao do prestador',
    subtitle: 'Como profissionais captam clientes e enfrentam barreiras',
    heroEmptyText:
      'Quando a API trouxer uma leitura consolidada, este resumo aparecera aqui.',
    insightDescription:
      'Leituras da pergunta aberta sobre o que ajudaria a conseguir mais clientes.',
    exportConfig: {
      title: 'Campos para exportacao',
      description:
        'Estrutura prevista para consolidar respostas no Sheets e no Apps Script.',
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
    kpiItems: [
      {
        key: 'difficulty_percentage',
        label: '% em alta dificuldade',
        description: 'Prestadores com percepcao baixa de facilidade para conseguir clientes.',
        icon: 'trending_down',
        format: 'percentage',
      },
      {
        key: 'primary_channel',
        label: 'Canal principal de captacao',
        description: 'Canal mais usado atualmente para conquistar novos clientes.',
        icon: 'campaign',
        format: 'text',
      },
      {
        key: 'ease_average',
        label: 'Nota media de captacao',
        description: 'Media da escala de 1 a 5 sobre facilidade para conseguir clientes.',
        icon: 'speed',
        format: 'score',
      },
      {
        key: 'outcome_metric',
        label: 'Faixa de clientes por mes',
        description: 'Volume mais frequente de clientes atendidos mensalmente.',
        icon: 'groups',
        format: 'text',
      },
    ],
    chartSections: [
      {
        key: 'channels',
        title: 'Canais de captacao',
        description: 'Onde os prestadores encontram clientes.',
        defaults: [
          'Indicacao',
          'Redes sociais',
          'WhatsApp',
          'Aplicativos',
          'Anuncios',
          'Parcerias',
          'Outro',
        ],
      },
      {
        key: 'gender',
        title: 'Genero dos respondentes',
        description: 'Distribuicao de genero.',
        visualization: 'distribution',
        order: ['Masculino', 'Feminino', 'Prefiro nao informar'],
        defaults: ['Masculino', 'Feminino', 'Prefiro nao informar'],
      },
      {
        key: 'age_groups',
        title: 'Faixa etaria',
        description: 'Distribuicao etaria.',
        visualization: 'distribution',
        defaults: ['18-24', '25-34', '35-44', '45-54', '55+'],
      },
      {
        key: 'experience',
        title: 'Tempo de atuacao',
        description: 'Tempo de experiencia no servico.',
        visualization: 'distribution',
        order: ['Menos de 6 meses', '6 meses a 1 ano', '1 a 3 anos', 'Mais de 3 anos'],
        defaults: ['Menos de 6 meses', '6 meses a 1 ano', '1 a 3 anos', 'Mais de 3 anos'],
      },
      {
        key: 'services',
        title: 'Servicos oferecidos',
        description: 'Servicos mais oferecidos.',
        defaults: [
          'Eletrica',
          'Hidraulica',
          'Construcao/Reforma',
          'Pintura',
          'Limpeza',
          'Jardinagem',
          'Pequenos reparos',
          'Outro',
        ],
      },
      {
        key: 'difficulties',
        title: 'Barreiras para captar clientes',
        description: 'Principais barreiras de captacao.',
        defaults: [
          'Falta de visibilidade',
          'Concorrencia alta',
          'Dificuldade de divulgacao',
          'Negociacao de preco',
          'Clientes desistem',
          'Falta de demanda',
          'Outro',
        ],
      },
      {
        key: 'problems',
        title: 'Problemas com clientes',
        description: 'Friccoes mais citadas com clientes.',
        defaults: [
          'Atraso no pagamento',
          'Cancelamento',
          'Falta de clareza no servico',
          'Cliente insatisfeito',
          'Problemas de comunicacao',
          'Outro',
        ],
      },
      {
        key: 'pricing',
        title: 'Formacao de preco',
        description: 'Como o preco e definido.',
        defaults: [
          'Baseado no mercado',
          'Experiencia propria',
          'Custo + margem',
          'Negociacao com cliente',
          'Outro',
        ],
      },
      {
        key: 'client_volume',
        title: 'Clientes por mes',
        description: 'Volume mensal de atendimento.',
        visualization: 'distribution',
        order: ['1-5', '6-10', '11-20', 'Mais de 20'],
        defaults: ['1-5', '6-10', '11-20', 'Mais de 20'],
      },
      {
        key: 'scale',
        title: 'Escala de facilidade',
        description: 'Notas de facilidade para captar clientes.',
        visualization: 'distribution',
        order: ['1', '2', '3', '4', '5'],
        defaults: ['1', '2', '3', '4', '5'],
      },
    ],
    chartGroups: [
      {
        title: 'Perfil do publico',
        description: 'Quem respondeu ao survey.',
        sections: ['gender', 'age_groups'],
      },
      {
        title: 'Captacao e oferta',
        description: 'Onde os clientes chegam e o que e oferecido.',
        sections: ['channels', 'services'],
      },
      {
        title: 'Ritmo da atuacao',
        description: 'Experiencia acumulada e volume mensal de clientes.',
        sections: ['experience', 'client_volume'],
      },
      {
        title: 'Operacao e friccao',
        description: 'Preco, barreiras e problemas com clientes.',
        sections: ['pricing', 'difficulties', 'problems'],
      },
      {
        title: 'Percepcao de facilidade',
        description: 'Como a captacao e percebida hoje.',
        sections: ['scale'],
      },
    ],
  },
};

export function getSurveyConfig(kind) {
  return surveyConfigs[kind] || surveyConfigs.contratante;
}

export function formatKpiValue(item, value) {
  if (value === null || value === undefined || value === '') {
    return '--';
  }

  if (item.format === 'percentage') {
    return `${value}%`;
  }

  if (item.format === 'score') {
    return typeof value === 'number' ? value.toFixed(1).replace('.', ',') : value;
  }

  return String(value);
}

export function formatChartValue(item) {
  if (item.value === null || item.value === undefined || item.value === '') {
    return '--';
  }

  if (item.type === 'percentage') {
    return `${item.value}%`;
  }

  return numberFormatter.format(item.value);
}

export function formatChartCountLabel(item) {
  if (item.value === null || item.value === undefined || item.value === '') {
    return '--';
  }

  const count = numberFormatter.format(item.value);
  const suffix = item.value === 1 ? 'resposta' : 'respostas';
  return `${count} ${suffix}`;
}

export function formatChartPercentageLabel(item, responseCount) {
  if (item.percentage !== null && item.percentage !== undefined) {
    return `${String(item.percentage).replace('.', ',')}% dos respondentes`;
  }

  if (!responseCount || item.value === null || item.value === undefined) {
    return '';
  }

  const percentage = Number(((item.value / responseCount) * 100).toFixed(1));
  return `${String(percentage).replace('.', ',')}% dos respondentes`;
}

export function getBarWidth(item, items) {
  const values = items
    .map((entry) => (typeof entry.value === 'number' ? entry.value : 0))
    .filter((value) => value > 0);

  const max = values.length ? Math.max(...values) : 0;

  if (!max || typeof item.value !== 'number') {
    return 0;
  }

  return Math.max((item.value / max) * 100, 4);
}

export function orderChartItems(items, section) {
  if (!section?.order?.length) {
    return items;
  }

  const orderMap = new Map(section.order.map((label, index) => [label, index]));

  return [...items].sort((left, right) => {
    const leftIndex = orderMap.has(left.label) ? orderMap.get(left.label) : Number.MAX_SAFE_INTEGER;
    const rightIndex = orderMap.has(right.label) ? orderMap.get(right.label) : Number.MAX_SAFE_INTEGER;

    if (leftIndex !== rightIndex) {
      return leftIndex - rightIndex;
    }

    return String(left.label).localeCompare(String(right.label), 'pt-BR');
  });
}

export function normalizeCategoryKey(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

export function buildHeroInsight(dataset, config) {
  if (dataset.heroInsight) {
    return dataset.heroInsight;
  }

  const topInsight = dataset.insights[0];

  if (topInsight) {
    return {
      label: 'Leitura inicial',
      title: topInsight.title,
      description: topInsight.description,
    };
  }

  if (
    dataset.kpis.primary_channel ||
    dataset.kpis.difficulty_percentage ||
    dataset.kpis.ease_average
  ) {
    const snippets = [
      dataset.kpis.primary_channel
        ? `O principal canal observado foi ${dataset.kpis.primary_channel}.`
        : null,
      dataset.kpis.difficulty_percentage
        ? `${dataset.kpis.difficulty_percentage}% do publico relatou dificuldade relevante.`
        : null,
      dataset.kpis.ease_average
        ? `A nota media de facilidade ficou em ${formatKpiValue(
            { format: 'score' },
            dataset.kpis.ease_average,
          )}.`
        : null,
    ].filter(Boolean);

    return snippets.length
      ? {
          label: config.title,
          title: config.subtitle,
          description: snippets.join(' '),
        }
      : null;
  }

  return null;
}

export function buildQuickFacts(dataset, config) {
  const facts = [];

  if (dataset.kpis.primary_channel) {
    facts.push({
      label: 'Canal dominante',
      value: dataset.kpis.primary_channel,
      note:
        config.value === 'prestador'
          ? 'Origem principal da captacao'
          : 'Origem mais comum da busca',
    });
  }

  if (dataset.kpis.difficulty_percentage !== null && dataset.kpis.difficulty_percentage !== undefined) {
    facts.push({
      label: 'Atrito percebido',
      value: `${dataset.kpis.difficulty_percentage}%`,
      note:
        config.value === 'prestador'
          ? 'Relatam dificuldade alta'
          : 'Relatam dificuldade na busca',
    });
  }

  if (dataset.kpis.outcome_metric) {
    facts.push({
      label: config.value === 'prestador' ? 'Faixa mais comum' : 'Tempo mais comum',
      value: dataset.kpis.outcome_metric,
      note:
        config.value === 'prestador'
          ? 'Volume mensal predominante'
          : 'Janela mais recorrente',
    });
  }

  const strongestSection = getStrongestSection(dataset, config);
  if (strongestSection) {
    facts.push({
      label: 'Leitura-chave',
      value: strongestSection.title,
      note: strongestSection.description,
    });
  }

  return facts.slice(0, 4);
}

function getStrongestSection(dataset, config) {
  const enriched = config.chartSections
    .map((section) => ({
      ...section,
      items: dataset[section.key] || [],
      topValue: dataset[section.key]?.[0]?.value || 0,
    }))
    .filter((section) => section.items.length > 0)
    .sort((a, b) => b.topValue - a.topValue);

  return enriched[0] || null;
}
