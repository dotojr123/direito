# Guia Prático: Instalação e Uso do Nó Datajud no n8n

Este guia passo a passo mostrará como instalar, configurar e utilizar o nó personalizado do Datajud no n8n para criar fluxos de trabalho que consultem processos judiciais.

## Requisitos

- Uma instalação do n8n (local ou na nuvem)
- Acesso a console/terminal para instalar pacotes npm
- Conhecimentos básicos sobre n8n e fluxos de trabalho

## 1. Instalação do Nó Datajud

### Para instâncias n8n hospedadas localmente:

1. Navegue até o diretório de instalação do n8n:

```bash
cd /caminho/para/seu/n8n
```

2. Instale o pacote:

```bash
npm install n8n-nodes-datajud
```

3. Reinicie o n8n:

```bash
n8n restart
```

### Para n8n.cloud:

Se você usa n8n.cloud, precisará solicitar a instalação deste nó personalizado pela equipe de suporte do n8n, pois nós personalizados não podem ser instalados diretamente pelos usuários.

## 2. Configuração das Credenciais

1. Acesse a interface web do n8n (geralmente em `http://localhost:5678` para instalações locais)
2. No menu lateral, clique em **Configurações** > **Credenciais**
3. Clique no botão **+ Adicionar Credencial**
4. Escolha **API do Datajud** na lista de tipos de credenciais
5. Insira as seguintes informações:
   - **Nome**: Um nome descritivo como "Datajud API"
   - **Chave de API**: Use a chave pública de teste `cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw==` ou sua própria chave fornecida pelo CNJ
6. Clique em **Salvar**

## 3. Criando um Fluxo Simples de Consulta Processual

Vamos criar um fluxo de trabalho que:
1. Recebe um número de processo via webhook
2. Consulta os dados na API do Datajud
3. Retorna os resultados formatados

### Passo 1: Criar o Trigger Webhook

1. Crie um novo fluxo de trabalho clicando em **Fluxos de Trabalho** > **+ Adicionar Fluxo de Trabalho**
2. Dê um nome ao fluxo (ex: "Consulta Processual")
3. Clique em **+ Adicionar Nó de Trigger**
4. Escolha o nó **Webhook**
5. Configure-o:
   - **Método HTTP**: GET
   - **Caminho**: `consulta-processo`
   - **Responder**: Desmarque (pois responderemos mais tarde)
6. Clique em **Salvar**

### Passo 2: Adicionar o Nó Datajud

1. Clique no botão **+** após o nó Webhook
2. Na barra de pesquisa, digite "Datajud" e selecione o nó
3. Configure-o:
   - **Operação**: Consultar Processo
   - **Número do Processo**: Clique no botão de dados dinâmicos e selecione `{{$node["Webhook"].json["query"]["numeroProcesso"]}}`
   - **Tribunal**: Clique no botão de dados dinâmicos e adicione `{{$node["Webhook"].json["query"]["tribunal"] || "api_publica_tjsp"}}`
   - **Credenciais**: Selecione a credencial que você criou anteriormente
4. Clique em **Salvar**

### Passo 3: Formatar os Dados

1. Clique no botão **+** após o nó Datajud
2. Pesquise e selecione o nó **Set**
3. Configure-o:
   - Marque **Manter apenas os valores definidos aqui**
   - Adicione os seguintes valores:
     - **statusConsulta** (Texto): `{{$node["Datajud"].json["resultados"] ? "Processo encontrado" : "Processo não encontrado"}}`
     - **numeroProcesso** (Texto): `{{$node["Datajud"].json["resultados"] ? $node["Datajud"].json["resultados"][0]["numeroProcesso"] : $node["Webhook"].json["query"]["numeroProcesso"]}}`
     - **tribunal** (Texto): `{{$node["Webhook"].json["query"]["tribunal"] || "api_publica_tjsp"}}`
     - **dadosProcesso** (Objeto): `{{$node["Datajud"].json["resultados"] ? $node["Datajud"].json["resultados"][0]["dadosProcesso"] : {}}}`
4. Clique em **Salvar**

### Passo 4: Adicionar Resposta HTTP

1. Clique no botão **+** após o nó Set
2. Pesquise e selecione o nó **Respond to Webhook**
3. Configure-o:
   - **Responder com**: JSON
   - **Corpo da Resposta**: Clique no botão de dados dinâmicos e selecione `{{$node["Set"].json}}`
4. Clique em **Salvar**

### Passo 5: Testar o Fluxo

1. Clique em **Executar** na parte superior do editor
2. Ative o fluxo de trabalho clicando no interruptor à direita
3. Copie a URL do Webhook (algo como `https://seu-n8n.exemplo.com/webhook/consulta-processo`)
4. Abra um navegador e acesse: `https://seu-n8n.exemplo.com/webhook/consulta-processo?numeroProcesso=5000904-47.2022.8.13.0479&tribunal=api_publica_tjsp`
5. Você deverá ver os dados do processo formatados como JSON

## 4. Integrando com a Interface de Usuário

Para usar a interface de usuário HTML incluída nos exemplos, siga estes passos:

1. Edite o arquivo `interface-consulta.html` e atualize a linha:
   ```javascript
   const n8nWebhookUrl = 'https://seu-n8n.exemplo.com/webhook/consulta-processo';
   ```
   Substitua por sua URL real do webhook

2. Hospede este arquivo HTML em qualquer servidor web ou execute-o localmente

3. Abra o arquivo no navegador e você verá uma interface amigável para consultar processos

## Dicas e Solução de Problemas

- **Erro de Conexão**: Se o nó Datajud não estiver se conectando à API, verifique se a chave de API está correta e se você tem acesso à internet.

- **Processo Não Encontrado**: Verifique se o número do processo está no formato correto e se você selecionou o tribunal correto.

- **Personalização**: Você pode personalizar o fluxo adicionando nós adicionais, como:
  - **HTML**: Para formatar a saída como uma página HTML bonita
  - **Slack/Email**: Para enviar os resultados para outros sistemas
  - **Function**: Para processar ou filtrar os dados do processo

- **Automação**: Considere agendar consultas periódicas para processos importantes usando o nó **Cron**.

## Recursos Adicionais

- [Documentação do n8n](https://docs.n8n.io/)
- [Documentação da API Pública do Datajud](https://datajud-wiki.cnj.jus.br/api-publica/acesso)
- [Guia de Desenvolvimento de Nós para n8n](https://docs.n8n.io/integrations/creating-nodes/) 