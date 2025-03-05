# Requisitos Técnicos para Implementação do Nó Datajud no n8n

## Visão Geral

Este documento define os requisitos técnicos para a implementação do nó Datajud no n8n, com base nos testes realizados e na análise da API pública do Datajud. O objetivo é garantir uma integração robusta e eficiente que permita aos usuários realizar consultas processuais através da plataforma n8n.

## Arquitetura

O nó Datajud será implementado como um nó regular do n8n, seguindo o padrão de desenvolvimento de nós da plataforma:

```
nodes/
└── Datajud/
    ├── Datajud.node.ts        # Definição principal do nó
    ├── DatajudTrigger.node.ts # (Opcional) Trigger para monitorar novos processos
    ├── Datajud.credentials.ts # Definição das credenciais
    ├── methods/               # Métodos auxiliares para operações específicas
    │   ├── consultarProcesso.ts
    │   ├── consultarPorNome.ts
    │   └── normalizarDados.ts
    └── types/                # Definições de tipos para TypeScript
        └── datajud.types.ts
```

## Requisitos Funcionais

### RF01 - Consulta por Número de Processo

1. **Múltiplas estratégias de consulta**:
   - Implementar consulta com formato padrão CNJ (XX.XXXX.X.XX.XXXX.X.XX.XXXX)
   - Implementar consulta com formato sem pontuação (XXXXXXXXXXXXXXXXXXX)
   - Implementar consulta com formato parcial (quando disponível)
   - Tentar estratégias sequencialmente até obter resultados

2. **Filtragem por tribunal**:
   - Permitir especificar o tribunal (aliasTribunal)
   - Fornecer lista pré-definida de tribunais disponíveis

3. **Processamento de resposta**:
   - Tratar possíveis múltiplos resultados (diferentes instâncias)
   - Normalizar campos importantes (partes, movimentos, órgão julgador)
   - Lidar com problemas de codificação de caracteres (UTF-8)

### RF02 - Consulta por Nome de Parte

1. **Parâmetros de consulta**:
   - Nome completo ou parcial da parte
   - Tipo de parte (autor, réu, terceiro interessado)
   - Tribunal a ser pesquisado
   - Período de referência
   - Paginação de resultados

2. **Estratégias de pesquisa**:
   - Implementar busca exata e busca por aproximação (fuzzy search)
   - Normalizar nomes (remover acentos, padronizar caixa)
   - Implementar ordenação por relevância ou data

3. **Tratamento de resultados**:
   - Agrupar processos por parte envolvida
   - Fornecer metadados sobre a qualidade do match

### RF03 - Formatação de Resultados

1. **Normalização de dados**:
   - Corrigir problemas de encoding (UTF-8)
   - Padronizar nomes de campos inconsistentes
   - Converter datas para formato ISO

2. **Enriquecimento de dados**:
   - Adicionar informações de contexto (descrições de códigos)
   - Classificar movimentos por categorias
   - Calcular métricas sobre o processo (tempo de tramitação, etc.)

3. **Filtros e transformações**:
   - Permitir filtrar apenas informações essenciais
   - Estruturar dados em formato adequado para workflows

## Requisitos Não-Funcionais

### RNF01 - Performance

1. **Timeout e retry**:
   - Implementar timeout configurável (padrão: 30s)
   - Implementar política de retry com backoff exponencial
   - Limitar número máximo de tentativas

2. **Caching**:
   - Implementar cache local para consultas recentes
   - Definir TTL (Time-to-Live) configurável para o cache
   - Permitir limpar cache manualmente

3. **Paginação eficiente**:
   - Implementar paginação para resultados grandes
   - Utilizar scroll API do Elasticsearch quando disponível

### RNF02 - Segurança

1. **Gestão de credenciais**:
   - Armazenar API key de forma segura
   - Não logar informações sensíveis
   - Validar entrada de dados para prevenir injeção

2. **Conformidade**:
   - Respeitar limites de rate limiting da API
   - Implementar user-agent identificável
   - Seguir termos de uso da API pública do Datajud

### RNF03 - Usabilidade

1. **Documentação**:
   - Fornecer exemplos de uso para cada operação
   - Documentar parâmetros e valores possíveis
   - Incluir guia de troubleshooting

2. **Feedback ao usuário**:
   - Retornar mensagens de erro detalhadas e acionáveis
   - Fornecer informações sobre o status da consulta
   - Incluir métricas de performance (tempo de resposta, etc.)

## Interfaces

### Credenciais

```typescript
export interface DatajudCredentials {
  apiKey: string;
  environment: 'production' | 'sandbox';
  timeout?: number;
  maxRetries?: number;
}
```

### Parâmetros de Consulta por Número

```typescript
export interface ConsultaPorNumeroParams {
  numeroProcesso: string;
  aliasTribunal?: string;
  formatarNumero?: boolean;
  incluirDetalhes?: boolean;
  normalizarCaracteres?: boolean;
}
```

### Parâmetros de Consulta por Nome

```typescript
export interface ConsultaPorNomeParams {
  nomeParte: string;
  tipoRolParte?: string;
  aliasTribunal?: string;
  dataInicial?: string;
  dataFinal?: string;
  pagina?: number;
  tamanhoPagina?: number;
  ordenacao?: 'relevancia' | 'data';
  buscaExata?: boolean;
}
```

## Tecnologias e Dependências

- **TypeScript**: Linguagem de desenvolvimento
- **Axios**: Cliente HTTP para consultas à API
- **n8n SDK**: Framework para desenvolvimento de nós
- **Jest**: Framework de testes
- **Elasticsearch**: Conhecimentos para interpretar e formatar consultas

## Estratégias de Implementação

1. **Implementação Iterativa**:
   - Versão 1.0: Consulta básica por número de processo
   - Versão 1.1: Melhorias na formatação e normalização
   - Versão 1.2: Consulta por nome de parte
   - Versão 1.3: Funcionalidades avançadas de filtragem e transformação

2. **Estrutura de Código**:
   - Separar lógica de API da lógica de negócio
   - Implementar padrão factory para diferentes estratégias de consulta
   - Utilizar injeção de dependências para facilitar testes

3. **Tratamento de Erros**:
   - Implementar hierarquia de erros customizados
   - Mapear códigos de erro da API para mensagens amigáveis
   - Fornecer sugestões de correção para erros comuns

## Modelo de Dados

### Modelo de Processo (Simplicado)

```typescript
export interface Processo {
  numeroProcesso: string;
  tribunal: string;
  instancia: string;
  classeProcessual?: {
    codigo: number;
    nome: string;
  };
  orgaoJulgador?: {
    codigo: number;
    nome: string;
    municipio?: string;
  };
  dataAjuizamento: string;
  partes: Parte[];
  movimentos: Movimento[];
  assuntos: Assunto[];
  valorCausa?: number;
  nivelSigilo: number;
}
```

## Considerações Especiais

1. **API Pública vs. API Privada**:
   - Implementar suporte para ambos os tipos de API
   - Documentar diferenças e limitações

2. **Problemas Conhecidos**:
   - Formatos diferentes de número processual
   - Encoding de caracteres especiais
   - Inconsistência na estrutura de dados entre tribunais

3. **Compatibilidade**:
   - Garantir compatibilidade com n8n v0.214.0 ou superior
   - Testar em diferentes sistemas operacionais

## Testes

1. **Testes Unitários**:
   - Testar formatadores e normalizadores
   - Testar estratégias de consulta
   - Testar parsers de resposta

2. **Testes de Integração**:
   - Testar integração com API real (usando mocks para testes automatizados)
   - Verificar tratamento de erros e casos limite

3. **Testes de Performance**:
   - Medir tempo de resposta para diferentes tipos de consulta
   - Testar comportamento com caching ativado e desativado

## Documentação

1. **README**:
   - Visão geral do nó
   - Instruções de instalação
   - Exemplos básicos de uso

2. **Documentação Técnica**:
   - Arquitetura detalhada
   - Fluxo de dados
   - Descrição de algoritmos importantes

3. **Documentação do Usuário**:
   - Guia passo-a-passo
   - Exemplos de workflows
   - Troubleshooting

---

## Anexos

1. Resultado do teste real com a API Datajud: `docs/RESULTADO_TESTE_REAL_API.md`
2. Exemplos de resposta da API: `exemplos/resultados/`

---

**Versão**: 1.0  
**Data**: 04/03/2025  
**Autor**: Equipe de Desenvolvimento 