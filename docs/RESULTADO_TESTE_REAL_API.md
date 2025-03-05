# Resultados do Teste Real - API Datajud

## Resumo Executivo

Este documento apresenta os resultados do teste real realizado em 04/03/2025 para consulta de processos na API pública do Datajud, com foco no processo nº 5000904-47.2022.8.13.0479, da comarca de Passos/MG.

## Objetivos do Teste

- Verificar a disponibilidade e acessibilidade da API pública do Datajud
- Testar diferentes estratégias de consulta para localizar processos
- Validar a qualidade dos dados retornados pela API
- Identificar possíveis desafios e limitações técnicas

## Metodologia

Foi desenvolvido um script em Node.js (`exemplos/teste-real-api-datajud.js`) que implementa três estratégias diferentes de consulta:

1. **Estratégia 1**: Consulta exata pelo número com formato padrão
2. **Estratégia 2**: Consulta pelo número sem formatação 
3. **Estratégia 3**: Consulta em múltiplos campos (multi_match)

O script foi executado em ambiente local com Node.js v23.5.0, usando a biblioteca Axios para as requisições HTTP.

## Resultados

### Status da Consulta

✅ **Resultado**: Processo encontrado com sucesso
📊 **Estratégia bem-sucedida**: Estratégia 2 (consulta pelo número sem formatação)
⏱️ **Tempo de resposta**: 355ms

### Informações do Processo

| Campo | Valor | Observações |
|-------|-------|-------------|
| Número CNJ | 50009044720228130479 | Formato sem pontuação |
| Tribunal | TJMG | Conforme esperado |
| Órgão Julgador | 2ª Vara Cível da comarca de Passos | Conforme esperado |
| Data de Distribuição | 2022-01-28 | Ano conforme esperado (2022) |
| Classe | Não disponível diretamente na raiz do objeto | Disponível nos documentos aninhados |
| Assunto | "Contratos Bancários" | Código 9607 |

### Movimentações Processuais

O processo possui um histórico rico de movimentações, incluindo:
- Distribuição (28/01/2022)
- Petições diversas
- Expedição de documentos
- Conclusões
- Audiências de conciliação
- Julgamentos
- Apelação (05/08/2022)
- Trânsito em julgado (07/06/2023)

### Observações Importantes

1. A API retornou dois documentos relacionados ao mesmo processo:
   - Um do primeiro grau (G1) com histórico detalhado
   - Um do segundo grau (G2) com informações da fase recursal

2. Alguns caracteres especiais aparecem com codificação incorreta (ex: "ConclusÃ£o" em vez de "Conclusão")

3. O formato do número processual foi crucial para o sucesso da consulta:
   - A estratégia 1 (formato com pontuação) falhou
   - A estratégia 2 (formato sem pontuação) teve sucesso

## Desafios e Lições Aprendidas

1. **Formato do número processual**: É necessário implementar diferentes formatos de consulta para garantir resultados positivos.

2. **Estrutura de dados**: A estrutura da resposta segue o padrão Elasticsearch, com documentos em `hits.hits` e dados principais em `_source`.

3. **Dados inconsistentes**: Alguns campos podem estar presentes em um documento mas ausentes em outro, exigindo tratamento defensivo no código.

4. **Codificação de caracteres**: É necessário tratar a codificação dos caracteres especiais nas respostas.

5. **Múltiplos resultados**: Um mesmo número de processo pode retornar múltiplos documentos (diferentes instâncias/fases), que devem ser devidamente processados.

## Recomendações para a Implementação do Node no n8n

1. **Múltiplas estratégias de consulta**: Implementar as diferentes estratégias de consulta em sequência, parando quando encontrar resultados.

2. **Normalização de dados**: Criar funções para normalizar caracteres especiais e padronizar campos com nomes diferentes mas significados semelhantes.

3. **Campos opcionais**: Tratar todos os campos como opcionais, usando operadores de coalescência nula (`?.`) e valores padrão.

4. **Cache de resultados**: Implementar sistema de cache para consultas frequentes, reduzindo o número de chamadas à API.

5. **Tratamento de erros**: Implementar tratamento abrangente de erros, especialmente para códigos 400, que podem indicar problemas no formato da consulta.

## Próximos Passos

1. Atualizar a implementação do nó Datajud no n8n com base nos aprendizados deste teste.

2. Desenvolver testes automatizados para validar o comportamento do nó em diferentes cenários.

3. Criar exemplos de fluxos no n8n que demonstrem a consulta de processos em diferentes formatos.

4. Documentar as melhores práticas para consulta de processos na API pública do Datajud.

## Anexos

Os resultados detalhados do teste estão disponíveis nos seguintes arquivos:

- `exemplos/resultados/resultado-estrategia-2.json`: Resposta completa da API
- `exemplos/teste-real-api-datajud.js`: Código-fonte do script de teste

---

**Data do teste**: 04/03/2025  
**Executor**: Equipe de Desenvolvimento  
**Versão da API**: API Pública CNJ Datajud 