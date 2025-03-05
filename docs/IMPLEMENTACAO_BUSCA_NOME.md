# Implementação Técnica: Busca por Nome das Partes

Este documento detalha a implementação técnica proposta para a funcionalidade de busca de processos por nome das partes no nó Datajud para n8n.

## 1. Visão Geral

Atualmente, o nó Datajud permite apenas consultas por número de processo. A implementação da busca por nome das partes ampliará significativamente a utilidade da ferramenta, permitindo aos advogados localizar todos os processos em que uma pessoa física ou jurídica esteja envolvida.

## 2. Requisitos Funcionais

- Pesquisar processos pelo nome completo ou parcial de qualquer parte envolvida
- Permitir filtros adicionais (tribunal, data, tipo de parte)
- Lidar com variações de nome e caracteres especiais
- Apresentar resultados paginados quando houver muitos processos
- Ordenar resultados por relevância ou cronologia

## 3. Análise da API Datajud

A API pública do Datajud suporta a busca por nome das partes através do endpoint `/_search` com parâmetros específicos. A estrutura do corpo da requisição seria:

```json
{
  "nomeParte": "Nome da Pessoa ou Empresa",
  "aliasTribunal": "api_publica_tjsp",
  "tipoRolParte": "AUTOR",  // Opcional: AUTOR, REU, TERCEIRO, etc.
  "filtros": {
    "dataInicio": "2020-01-01",
    "dataFim": "2023-12-31"
  },
  "pagina": 1,
  "tamanhoPagina": 20
}
```

## 4. Modificações no Código

### 4.1. Atualização do Arquivo `Datajud.node.ts`

#### Adição de Nova Operação

```typescript
// Adicionar nova opção na propriedade 'operation'
{
  displayName: 'Operação',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  options: [
    {
      name: 'Consultar Processo',
      value: 'consultarProcesso',
      description: 'Consulta informações de um processo pelo número',
      action: 'Consultar processo',
    },
    {
      name: 'Consultar por Nome da Parte',
      value: 'consultarPorNome',
      description: 'Consulta processos pelo nome de qualquer parte envolvida',
      action: 'Consultar por nome',
    },
  ],
  default: 'consultarProcesso',
}
```

#### Novos Parâmetros para a Operação

```typescript
// Adicionar novos parâmetros para a operação "consultarPorNome"
{
  displayName: 'Nome da Parte',
  name: 'nomeParte',
  type: 'string',
  default: '',
  required: true,
  displayOptions: {
    show: {
      operation: ['consultarPorNome'],
    },
  },
  placeholder: 'João da Silva',
  description: 'Nome completo ou parcial da parte envolvida no processo',
},
{
  displayName: 'Tribunal',
  name: 'aliasTribunal',
  type: 'options',
  options: [
    // Mesmas opções existentes no código atual
  ],
  default: 'api_publica_tjsp',
  required: true,
  displayOptions: {
    show: {
      operation: ['consultarPorNome'],
    },
  },
  description: 'Tribunal onde o processo está em tramitação',
},
{
  displayName: 'Tipo de Parte',
  name: 'tipoRolParte',
  type: 'options',
  options: [
    { name: 'Qualquer', value: '' },
    { name: 'Autor/Requerente', value: 'AUTOR' },
    { name: 'Réu/Requerido', value: 'REU' },
    { name: 'Terceiro Interessado', value: 'TERCEIRO' },
    { name: 'Advogado', value: 'ADVOGADO' },
    { name: 'Testemunha', value: 'TESTEMUNHA' },
  ],
  default: '',
  displayOptions: {
    show: {
      operation: ['consultarPorNome'],
    },
  },
  description: 'Filtrar pelo papel da parte no processo',
},
{
  displayName: 'Opções de Paginação',
  name: 'opcoesPaginacao',
  type: 'collection',
  placeholder: 'Adicionar opção',
  default: {},
  displayOptions: {
    show: {
      operation: ['consultarPorNome'],
    },
  },
  options: [
    {
      displayName: 'Página',
      name: 'pagina',
      type: 'number',
      default: 1,
      description: 'Número da página de resultados',
    },
    {
      displayName: 'Resultados por Página',
      name: 'tamanhoPagina',
      type: 'number',
      default: 20,
      description: 'Quantidade de resultados por página',
    },
  ],
}
```

#### Implementação da Lógica de Busca no Método Execute

```typescript
async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  // Código existente...

  if (operation === 'consultarPorNome') {
    const nomeParte = this.getNodeParameter('nomeParte', i) as string;
    const aliasTribunal = this.getNodeParameter('aliasTribunal', i) as string;
    const tipoRolParte = this.getNodeParameter('tipoRolParte', i) as string;
    const options = this.getNodeParameter('opcoes', i, {}) as IDataObject;
    const opcoesPaginacao = this.getNodeParameter('opcoesPaginacao', i, {}) as IDataObject;
    
    const url = `https://api-publica.datajud.cnj.jus.br/${aliasTribunal}/_search`;
    
    // Preparar o corpo da requisição
    const requestBody: IDataObject = {
      nomeParte,
      aliasTribunal,
    };
    
    // Adicionar tipo de rol se especificado
    if (tipoRolParte) {
      requestBody.tipoRolParte = tipoRolParte;
    }
    
    // Adicionar filtros se especificados
    if (options.dataInicio || options.dataFim) {
      const filtros: IDataObject = {};
      
      if (options.dataInicio) {
        const dataInicio = new Date(options.dataInicio as string);
        filtros.dataInicio = dataInicio.toISOString().split('T')[0];
      }
      
      if (options.dataFim) {
        const dataFim = new Date(options.dataFim as string);
        filtros.dataFim = dataFim.toISOString().split('T')[0];
      }
      
      requestBody.filtros = filtros;
    }
    
    // Adicionar paginação
    if (opcoesPaginacao.pagina) {
      requestBody.pagina = opcoesPaginacao.pagina;
    }
    
    if (opcoesPaginacao.tamanhoPagina) {
      requestBody.tamanhoPagina = opcoesPaginacao.tamanhoPagina;
    }
    
    try {
      // Realizar a requisição
      const response = await axios.post(url, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `APIKey ${credentials.apiKey}`,
        },
      });
      
      responseData = response.data;
      
      // Adicionar metadados úteis aos resultados
      if (responseData && responseData.resultados) {
        responseData.metadados = {
          totalProcessos: responseData.total || 0,
          paginaAtual: opcoesPaginacao.pagina || 1,
          tamanhoPagina: opcoesPaginacao.tamanhoPagina || 20,
          nomePesquisado: nomeParte,
          tribunal: aliasTribunal,
        };
      }
      
      returnData.push(responseData);
    } catch (error: any) {
      // Tratamento de erro (como no código existente)
    }
  }
  
  // Código existente para outras operações...
}
```

## 5. Exemplos de Uso

### 5.1 Exemplo de Fluxo no n8n

1. **Trigger HTTP**: Recebe parâmetros de consulta (nome, tribunal, etc.)
2. **Datajud**: Consulta processos usando a operação "Consultar por Nome da Parte"
3. **Set**: Formata os resultados para exibição
4. **If**: Verifica se encontrou processos
   - Se sim: Processa e exibe os resultados
   - Se não: Exibe mensagem de "Nenhum processo encontrado"
5. **Respond to Webhook**: Retorna os dados formatados

### 5.2 Exemplo de Consulta na Interface

```
Nome da Parte: Empresa ABC Ltda
Tribunal: TJSP - Tribunal de Justiça de São Paulo
Tipo de Parte: Réu/Requerido
Filtrar por data: Sim
  - Data inicial: 01/01/2022
  - Data final: 01/03/2023
```

## 6. Considerações de Performance

Para lidar com potenciais problemas de performance ao consultar partes com muitos processos:

1. **Implementar cache**: Armazenar resultados frequentes para reduzir chamadas à API
2. **Paginação eficiente**: Carregar apenas os resultados necessários
3. **Filtros inteligentes**: Sugerir filtros adicionais para refinar resultados volumosos
4. **Timeouts configuráveis**: Permitir ajuste de tempos de espera para consultas grandes

## 7. Testes Necessários

1. **Testes de unidade**:
   - Verificar construção correta das consultas
   - Testar tratamento de erros

2. **Testes de integração**:
   - Consultas com nomes comuns (muitos resultados)
   - Consultas com caracteres especiais
   - Consultas com nomes parciais

3. **Testes de performance**:
   - Medir tempos de resposta com diferentes volumes de resultados
   - Verificar uso de memória com grandes conjuntos de dados

## 8. Próximos Passos

Após implementação inicial da busca por nome:

1. Adicionar recursos de ordenação de resultados
2. Implementar busca exata vs. busca parcial
3. Desenvolver filtros avançados (comarca, classe processual)
4. Criar visualizações dedicadas para resultados por nome 