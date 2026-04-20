# Dashboard de Survey

Dashboard web moderno, minimalista e responsivo para analise de dados de survey, preparado para consumir dados reais a partir de uma API externa ou Google Sheets via Google Apps Script.

## Stack

- React + Vite
- CSS puro organizado
- Componentes reutilizaveis
- Barras customizadas em CSS/JS, sem biblioteca pesada de graficos

## Como rodar

```bash
npm install
npm run dev
```

## Variaveis de ambiente

Crie um arquivo `.env` com:

```bash
SURVEY_PROXY_TARGET=https://script.google.com/macros/s/SEU_SCRIPT_ID/exec
```

Essa variavel e lida apenas pelo servidor do Vite e nao vai para o bundle do frontend.

O frontend passa a chamar apenas:

```txt
/api/survey
```

Se o proxy nao estiver configurado, o dashboard continua em estado vazio ou mostra erro orientando a configuracao.

## Formato esperado da API

O endpoint agora aceita um payload unico com duas visoes: `contratante` e `prestador`.

```json
{
  "surveys": {
    "contratante": {
      "kpis": {
        "difficulty_percentage": 72,
        "primary_channel": "Indicacao de amigos/familia",
        "ease_average": 2.6,
        "outcome_metric": "De 2 a 4 dias"
      },
      "hero_insight": {
        "label": "Leitura da API",
        "title": "Confianca e velocidade seguem como gargalo",
        "description": "A maioria dos contratantes ainda depende de indicacao e sente falta de transparencia."
      },
      "channels": [],
      "demographics": [],
      "recency": [],
      "services": [],
      "difficulties": [],
      "criteria": [],
      "trust": [],
      "scale": [],
      "hiring_time": [],
      "insights": [],
      "export": {
        "sheet_name": "Contratantes",
        "fields": [
          "nome",
          "idade",
          "genero"
        ]
      }
    },
    "prestador": {
      "kpis": {
        "difficulty_percentage": 64,
        "primary_channel": "Indicacao",
        "ease_average": 2.2,
        "outcome_metric": "6-10"
      },
      "channels": [],
      "demographics": [],
      "experience": [],
      "services": [],
      "difficulties": [],
      "problems": [],
      "pricing": [],
      "client_volume": [],
      "scale": [],
      "insights": [],
      "export": {
        "sheet_name": "Prestadores",
        "fields": [
          "nome",
          "idade",
          "genero"
        ]
      }
    }
  }
}
```

Cada colecao de barras deve seguir este formato:

```json
[
  { "label": "Indicacao", "value": 42, "type": "count" },
  { "label": "Instagram", "value": 27, "type": "percentage" }
]
```

`type` e opcional. Quando omitido, o dashboard trata o valor como `count`.

## Estrutura recomendada de exportacao

O frontend ja espera e exibe os campos-base abaixo.

### Contratante

- `nome`
- `idade`
- `genero`
- `como_encontra_profissionais`
- `ultima_contratacao`
- `tipos_de_servico`
- `encontra_dificuldades`
- `dificuldades_enfrentadas`
- `criterio_de_escolha`
- `sinais_de_confianca`
- `facilidade_para_encontrar`
- `tempo_para_contratar`
- `resposta_aberta_facilitadores`

### Prestador

- `nome`
- `idade`
- `genero`
- `como_encontra_clientes`
- `tempo_de_atuacao`
- `servicos_oferecidos`
- `maior_dificuldade_para_conseguir_clientes`
- `ja_teve_problemas_com_clientes`
- `problemas_enfrentados`
- `como_define_preco`
- `facilidade_para_conseguir_clientes`
- `clientes_por_mes`
- `resposta_aberta_ajuda_para_crescer`

## Integracao com Google Apps Script

Em [src/services/api.js](C:/Users/edils/Downloads/lovable/dashboard/src/services/api.js), a funcao `fetchSurveyData()` ja esta preparada para:

1. Chamar apenas o caminho relativo `/api/survey`
2. Enviar `GET` com o filtro de periodo selecionado
3. Normalizar a resposta para a UI nao quebrar com payloads incompletos
4. Aceitar tanto o formato novo com `surveys` quanto um formato legado com apenas um dataset

Em desenvolvimento local, o proxy fica em [vite.config.js](C:/Users/edils/Downloads/lovable/dashboard/vite.config.js) e usa `SURVEY_PROXY_TARGET` para encaminhar a requisicao ao Apps Script sem expor a URL no client bundle.

Fluxo sugerido:

1. Armazene respostas em abas separadas do Google Sheets
2. Use Apps Script para agregar os dados por categoria
3. Monte um JSON final com `surveys.contratante` e `surveys.prestador`
4. Publique o script como Web App
5. Em desenvolvimento local, aponte `SURVEY_PROXY_TARGET` para a URL publicada

## Sobre seguranca

Para desenvolvimento local, esta correcao ja evita expor a URL do Apps Script no frontend.

Para producao, existe uma limitacao importante:

- GitHub Pages e estatico, entao ele nao consegue esconder segredo nem URL privada sozinho
- se voce publicar apenas HTML/CSS/JS no GitHub Pages, qualquer chamada externa feita pelo navegador continuara observavel
- para esconder de verdade a origem da API em producao, use um backend/proxy proprio, como Vercel Functions, Netlify Functions, Cloudflare Workers ou um servidor seu

## Deploy no GitHub Pages

O `vite.config.js` ja usa `base: './'` para facilitar publicacao estatica.

Scripts disponiveis:

```bash
npm run build
npm run preview
npm run deploy
```
