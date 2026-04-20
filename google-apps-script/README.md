# Apps Script para Prestador

O arquivo [prestador-dashboard.gs](C:/Users/edils/Downloads/lovable/dashboard/google-apps-script/prestador-dashboard.gs) ja vem preparado para:

- ler a planilha do prestador pelo `SPREADSHEET_ID`
- consumir as colunas `A:N` na ordem que voce descreveu
- quebrar respostas de checkbox separadas por virgula em categorias individuais
- devolver JSON no formato esperado pelo dashboard

## Antes de publicar

1. Abra o Google Apps Script
2. Cole o conteudo do arquivo `prestador-dashboard.gs`
3. Ajuste `SHEET_NAME` para o nome real da aba de respostas
4. Publique como `Web App`
5. Copie a URL `.../exec`

## Observacoes

- colunas com checkbox sao tratadas com `split(',')`, entao `Eletrica, Hidraulica` vira duas contagens separadas
- a coluna `Quao facil e conseguir clientes hoje?` vira a escala numerica usada no KPI e no grafico
- o dashboard recebe o dataset em `surveys.prestador`
- `surveys.contratante` continua vazio por enquanto, ate voce me mandar a estrutura ou a planilha correspondente
