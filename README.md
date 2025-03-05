# Nó Datajud para n8n

Este pacote contém um nó personalizado para [n8n](https://n8n.io/) que permite consultar processos judiciais através da API pública do [Datajud](https://datajud-wiki.cnj.jus.br/api-publica/acesso) do Conselho Nacional de Justiça (CNJ).

O nó permite que advogados e profissionais do direito consultem informações processuais de diversos tribunais brasileiros, utilizando o número do processo ou o nome das partes.

## 📋 Características

- **Consulta por número de processo**: Consulte processos em diversos tribunais brasileiros
- **Consulta por nome das partes**: Encontre processos associados a uma pessoa física ou jurídica
- **Normalização de dados**: Receba dados organizados e padronizados
- **Múltiplas estratégias de consulta**: Suporte a diferentes formatos de número processual
- **Filtros avançados**: Filtre por tribunal, data, tipo de parte e mais
- **Cache integrado**: Melhoria de performance em consultas frequentes

## 🔧 Pré-requisitos

- [n8n](https://n8n.io/) instalado (versão 0.214.0 ou superior)
- Node.js (versão 18.17.0 ou superior)
- npm (versão 8.15.0 ou superior)

## 🚀 Instalação

### Instalação Local (Desenvolvimento)

1. Clone este repositório:
```
git clone https://github.com/seu-usuario/n8n-nodes-datajud.git
```

2. Navegue até o diretório do projeto:
```
cd n8n-nodes-datajud
```

3. Instale as dependências:
```
npm install
```

4. Compile o código:
```
npm run build
```

5. Crie um link simbólico para que o n8n reconheça o nó:
```
npm link
```

6. Navegue até o diretório de instalação do n8n e link este pacote:
```
cd /caminho/para/n8n
npm link n8n-nodes-datajud
```

### Instalação via NPM (Produção)

```
npm install n8n-nodes-datajud
```

## 📝 Como usar

### Configuração das Credenciais

1. No n8n, vá para **Configurações** > **Credenciais** > **Adicionar nova credencial**
2. Selecione **API do Datajud** na lista
3. Insira a chave de API fornecida pelo CNJ
   - Por padrão, a chave pública de teste já está configurada: `cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw==`
4. Clique em **Salvar**

### Operações Disponíveis

#### 1. Consultar por Número de Processo

1. Adicione o nó **Datajud** ao fluxo
2. Selecione a operação **Consultar Processo**
3. Configure os parâmetros:
   - **Número do Processo**: Formato completo CNJ ou sem formatação
   - **Tribunal**: Tribunal onde o processo tramita
   - **Opções avançadas** (opcional): Filtros adicionais

#### 2. Consultar por Nome da Parte

1. Adicione o nó **Datajud** ao fluxo 
2. Selecione a operação **Consultar por Nome**
3. Configure os parâmetros:
   - **Nome da Parte**: Nome completo ou parcial
   - **Tipo de Parte** (opcional): Autor, Réu, etc.
   - **Tribunal** (opcional): Limitar a tribunais específicos
   - **Filtros de data** (opcional): Período de interesse
   - **Paginação** (opcional): Tamanho da página e número da página

## 📊 Exemplos de Fluxos

### Consulta por Número de Processo

Os exemplo de fluxos estão disponíveis no diretório `exemplos/`:

- `fluxo-consulta-processo.json`: Fluxo simples para consulta de processos por número
- `teste-acesso-processo-numero.json`: Fluxo completo com tratamento de erros e formatação

### Consulta por Nome de Parte

- `fluxo-busca-nome.json`: Fluxo para busca de processos por nome da parte

## 📄 Documentação

A documentação completa está disponível no diretório `docs/`. Consulte o [Índice da Documentação](docs/INDICE.md) para uma visão geral de todos os documentos disponíveis.

### Documentos Principais

- `RESUMO_PROJETO.md`: Visão geral do projeto e suas funcionalidades
- `REQUISITOS_TECNICOS_DATAJUD.md`: Especificações técnicas do nó
- `PLANO_IMPLEMENTACAO.md`: Plano detalhado de implementação
- `ROADMAP.md`: Plano de evolução futura

### Documentos de Implementação

- `IMPLEMENTACAO_BUSCA_NOME.md`: Documentação da implementação da busca por nome
- `TESTE_ACESSO_PROCESSO_NUMERO.md`: Guia para consulta por número de processo

### Documentos de Testes

- `RESULTADO_SIMULACAO_TESTE.md`: Resultados dos testes simulados
- `RESULTADO_TESTE_REAL_API.md`: Resultados dos testes reais com a API

### Documentos de Entrega

- `RESUMO_CONCLUSAO.md`: Estado final do projeto
- `INSTRUCOES_ENTREGA.md`: Instruções detalhadas para instalação e uso
- `CARTA_ENTREGA.md`: Carta formal de entrega do projeto

## 🛣️ Roadmap

Consulte o arquivo [ROADMAP.md](docs/ROADMAP.md) para conhecer os próximos passos do projeto, divididos nas seguintes categorias:

1. **Novas Funcionalidades**
   - Monitoramento de novos movimentos processuais
   - Consulta por OAB do advogado
   - Estatísticas processuais

2. **Melhorias Técnicas**
   - Otimização de performance
   - Caching avançado
   - Melhorias de usabilidade

3. **Integrações**
   - Conexão com outros sistemas jurídicos
   - Integração com sistemas de gerenciamento de escritórios
   - Exportação para formatos específicos

## 🧪 Testes

O projeto inclui testes simulados e reais para validar o funcionamento do nó:

- **Testes Simulados**: Disponíveis em `exemplos/simulacao-teste.js` e `exemplos/simulacao-teste-falha.js`
- **Testes Reais**: Implementados em `exemplos/teste-real-api-datajud.js`

Para executar os testes:

```
node exemplos/simulacao-teste.js
node exemplos/simulacao-teste-falha.js
node exemplos/teste-real-api-datajud.js
```

Os resultados dos testes estão documentados em:
- `docs/RESULTADO_SIMULACAO_TESTE.md`
- `docs/RESULTADO_TESTE_REAL_API.md`

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📞 Suporte

Se encontrar problemas ou tiver dúvidas:

1. Consulte o [Índice da Documentação](docs/INDICE.md)
2. Verifique os exemplos em `exemplos/`
3. Consulte as instruções detalhadas em [INSTRUCOES_ENTREGA.md](docs/INSTRUCOES_ENTREGA.md)
4. Abra uma issue no GitHub
5. Entre em contato pelo e-mail [suporte@exemplo.com](mailto:suporte@exemplo.com)

## 📄 Licença

[MIT](LICENSE.md) 