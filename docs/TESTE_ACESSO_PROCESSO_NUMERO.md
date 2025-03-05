# Teste de Acesso: Consulta de Processo por Número

Este documento detalha o processo de teste de acesso à API do Datajud, especificamente para a consulta de processos por número. O teste foi realizado com um número de processo real.

## Detalhes do Processo

- **Número do Processo:** 5000904-47.2022.8.13.0479
- **Classe:** [CÍVEL] CUMPRIMENTO DE SENTENÇA
- **Órgão Julgador:** 2ª Vara Cível da Comarca de Passos
- **Data de Distribuição:** 28/01/2022
- **Tribunal:** TJMG - Tribunal de Justiça de Minas Gerais

## Objetivo do Teste

O objetivo deste teste é verificar se o nó Datajud para n8n consegue acessar corretamente as informações de um processo específico através da API pública do Datajud, utilizando o número do processo como parâmetro de busca.

## Procedimento de Teste

1. Foi criado um fluxo de teste no n8n com os seguintes componentes:
   - Um webhook para iniciar o teste
   - Um nó Datajud configurado para consultar o processo específico
   - Nós para formatação dos resultados e validação do teste
   - Um nó condicional para verificar se o processo foi encontrado
   - Respostas apropriadas para casos de sucesso e falha

2. O fluxo foi configurado com o número do processo e o tribunal corretos:
   ```json
   {
     "operation": "consultarProcesso",
     "numeroProcesso": "5000904-47.2022.8.13.0479",
     "aliasTribunal": "api_publica_tjmg"
   }
   ```

3. Foram adicionadas verificações para validar se os dados retornados correspondem às informações esperadas:
   - Número do processo corresponde ao valor esperado
   - Classe do processo contém "CUMPRIMENTO DE SENTENÇA"
   - Órgão julgador inclui "Vara Cível da Comarca de Passos"
   - Data de distribuição inclui o ano "2022"

## Execução do Teste

Para executar o teste:

1. Inicie o servidor n8n localmente ou no ambiente desejado
2. Ative o fluxo "Teste de Acesso - Consulta por Número do Processo"
3. Acesse o endpoint do webhook (ex.: `http://localhost:5678/webhook/teste-acesso`)
4. Observe os resultados retornados

## Resultados Esperados

O teste é considerado bem-sucedido se:

1. A API do Datajud retornar os dados do processo
2. As informações retornadas corresponderem aos dados esperados
3. O tempo de resposta for aceitável (menos de 3 segundos)

## Métricas e Monitoramento

Durante o teste, são coletadas as seguintes métricas:

- Tempo de resposta da API (campo `took` na resposta)
- Timestamp de início e término da consulta
- Validação dos campos-chave retornados

## Tratamento de Erros

Em caso de falha no teste, o fluxo:

1. Registra o status de erro
2. Fornece possíveis causas para a falha
3. Sugere ações para resolução do problema

## Resultados Obtidos

Ao executar o teste, observamos que:

1. A API do Datajud respondeu à consulta com sucesso
2. Os dados retornados corresponderam às informações esperadas:
   - O número do processo foi confirmado
   - A classe do processo foi identificada corretamente
   - O órgão julgador correspondeu ao esperado
   - A data de distribuição estava dentro do período esperado

## Sugestões para Testes Futuros

- Implementar testes automatizados para executar esta verificação periodicamente
- Expandir o teste para incluir consultas a outros tribunais
- Adicionar verificações de performance ao longo do tempo
- Criar testes para situações de erro (números inválidos, tribunais offline, etc.)

## Anexos

O arquivo de fluxo completo do teste está disponível em: `/exemplos/teste-acesso-processo-numero.json` 