# Instruções de Entrega - Projeto n8n-datajud

Este documento contém as instruções finais para a utilização do nó Datajud para n8n, incluindo como instalar, configurar e começar a utilizar todas as funcionalidades desenvolvidas.

## Conteúdo da Entrega

A entrega do projeto inclui:

1. **Código-fonte completo** do nó Datajud para n8n
2. **Documentação técnica e de usuário** na pasta `docs/`
3. **Exemplos de uso e testes** na pasta `exemplos/`
4. **Scripts de teste** para validação da API

## Instalação

### Pré-requisitos

- Node.js v16 ou superior
- n8n v0.214.0 ou superior
- npm v8 ou superior

### Instalação para Desenvolvimento

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/n8n-datajud.git
   cd n8n-datajud
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Compile o código:
   ```bash
   npm run build
   ```

4. Crie um link simbólico para desenvolvimento:
   ```bash
   npm link
   ```

5. Na pasta de instalação do n8n, execute:
   ```bash
   npm link n8n-datajud
   ```

### Instalação para Produção

1. Instale diretamente via npm:
   ```bash
   npm install n8n-datajud
   ```

2. Reinicie o n8n para carregar o novo nó.

## Configuração

### Configuração das Credenciais

1. No n8n, acesse a seção "Credentials" no menu lateral
2. Clique em "Add Credential"
3. Selecione "Datajud API"
4. Preencha os seguintes campos:
   - **Nome**: Um nome para identificar esta credencial
   - **API Key**: Sua chave de API do Datajud
   - **URL Base**: URL base da API (padrão: `https://datajud-api.cnj.jus.br/api`)

### Utilização do Nó

1. Crie um novo workflow no n8n
2. Adicione o nó "Datajud" do menu de nós
3. Selecione a credencial configurada anteriormente
4. Escolha a operação desejada:
   - **Consultar por Número de Processo**
   - **Consultar por Nome da Parte**
5. Configure os parâmetros específicos da operação escolhida
6. Conecte o nó a outros nós para processar os resultados

## Exemplos Incluídos

### Fluxos de Exemplo

Na pasta `exemplos/` você encontrará fluxos prontos para importar no n8n:

1. `fluxo-consulta-processo.json`: Exemplo de consulta por número de processo
2. `fluxo-busca-nome.json`: Exemplo de consulta por nome de parte

Para importar:
1. No n8n, acesse "Workflows"
2. Clique em "Import from File"
3. Selecione o arquivo JSON desejado

### Scripts de Teste

Para testar a API diretamente, sem o n8n:

1. Navegue até a pasta `exemplos/`:
   ```bash
   cd exemplos
   ```

2. Execute o script de teste real:
   ```bash
   node teste-real-api-datajud.js
   ```

3. Os resultados serão salvos em `resultados/resultado-teste-real.json`

## Documentação

### Documentação Técnica

- `REQUISITOS_TECNICOS_DATAJUD.md`: Especificações técnicas detalhadas
- `PLANO_IMPLEMENTACAO.md`: Plano de implementação e fases do projeto
- `RESUMO_PROJETO.md`: Visão geral do projeto e suas funcionalidades

### Documentação de Usuário

- `TESTE_ACESSO_PROCESSO_NUMERO.md`: Guia para consulta por número de processo
- `IMPLEMENTACAO_BUSCA_NOME.md`: Guia para consulta por nome de parte
- `RESULTADO_SIMULACAO_TESTE.md`: Resultados dos testes simulados
- `RESULTADO_TESTE_REAL_API.md`: Resultados dos testes reais

### Planejamento Futuro

- `ROADMAP.md`: Plano de evolução futura do nó

## Suporte e Manutenção

### Canais de Suporte

- **GitHub Issues**: Para reportar bugs ou solicitar novas funcionalidades
- **E-mail**: suporte@exemplo.com para questões técnicas

### Atualizações

Recomendamos verificar regularmente por atualizações:

```bash
npm update n8n-datajud
```

## Considerações Finais

O nó Datajud para n8n está pronto para uso em ambiente de produção. Recomendamos iniciar com os exemplos fornecidos para familiarização com as funcionalidades antes de criar fluxos personalizados.

Para qualquer dúvida ou problema durante a utilização, consulte a documentação incluída ou entre em contato pelos canais de suporte.

---

**Data de Entrega**: 05/03/2025  
**Versão**: 1.0.0