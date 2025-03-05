/**
 * Simulação da execução do teste de acesso ao processo
 * Este script simula o fluxo de teste que seria executado no n8n
 */

const fs = require('fs');
const path = require('path');

// Função para carregar a resposta simulada da API Datajud
function carregarRespostaSimulada() {
  try {
    const dadosArquivo = fs.readFileSync(
      path.join(__dirname, 'simulacao-resposta-datajud.json'),
      'utf8'
    );
    return JSON.parse(dadosArquivo);
  } catch (error) {
    console.error('Erro ao carregar arquivo de simulação:', error);
    process.exit(1);
  }
}

// Simula o nó "Datajud - Consulta Específica"
function consultarProcesso() {
  console.log('🔍 Consultando processo 5000904-47.2022.8.13.0479 no TJMG...');
  
  // Em uma execução real, aqui seria feita uma chamada à API do Datajud
  // Nesta simulação, usamos a resposta pré-definida
  const resposta = carregarRespostaSimulada();
  
  console.log(`✅ Consulta finalizada em ${resposta.took}ms`);
  return resposta;
}

// Simula o nó "Formatar Resultados do Teste"
function formatarResultados(dadosResposta) {
  console.log('📋 Formatando resultados da consulta...');
  
  const resultados = dadosResposta.resultados && dadosResposta.resultados.length > 0 
    ? dadosResposta.resultados[0] 
    : null;
  
  return {
    statusConsulta: resultados ? "Processo encontrado" : "Processo não encontrado",
    numeroProcesso: "5000904-47.2022.8.13.0479",
    tribunal: "TJMG - Tribunal de Justiça de Minas Gerais",
    classe: resultados ? resultados.dadosProcesso.classeProcessual : "[CÍVEL] CUMPRIMENTO DE SENTENÇA",
    orgaoJulgador: resultados ? resultados.dadosProcesso.orgaoJulgador : "2ª Vara Cível da Comarca de Passos",
    dataDistribuicao: resultados ? resultados.dadosProcesso.dataDistribuicao : "28/01/2022",
    dadosProcesso: resultados ? resultados.dadosProcesso : {},
    tempoConsulta: {
      inicioConsulta: new Date().toISOString(),
      duracaoMs: dadosResposta.took || 0,
      timestamp: Date.now()
    },
    metaDadosTeste: {
      descricaoTeste: "Teste de acesso ao processo 5000904-47.2022.8.13.0479",
      dataTeste: new Date().toISOString(),
      ambiente: "Simulação",
      resultadoEsperado: "Consulta bem-sucedida do processo no TJMG"
    }
  };
}

// Simula o nó "Processo Encontrado?"
function verificarProcessoEncontrado(dadosFormatados) {
  console.log('🔎 Verificando se o processo foi encontrado...');
  return dadosFormatados.statusConsulta === "Processo encontrado";
}

// Simula o nó "Teste Bem-Sucedido"
function processarSucesso(dadosFormatados) {
  console.log('✅ TESTE BEM-SUCEDIDO: Processo localizado conforme esperado');
  
  const validacoes = {
    numeroCorreto: dadosFormatados.numeroProcesso === "5000904-47.2022.8.13.0479",
    classeCorreta: dadosFormatados.classe.includes("CUMPRIMENTO DE SENTENÇA"),
    orgaoCorreto: dadosFormatados.orgaoJulgador.includes("Vara Cível da Comarca de Passos"),
    dataCorreta: dadosFormatados.dataDistribuicao.includes("2022")
  };
  
  console.log('📊 Validações:');
  for (const [key, value] of Object.entries(validacoes)) {
    console.log(`  - ${key}: ${value ? '✓' : '✗'}`);
  }
  
  return {
    status: "success",
    mensagem: "Teste de acesso bem-sucedido! Processo localizado conforme esperado.",
    resultadosTeste: dadosFormatados,
    validacoes
  };
}

// Simula o nó "Teste Falhou"
function processarFalha(dadosFormatados) {
  console.log('❌ TESTE FALHOU: Processo não foi localizado');
  
  return {
    status: "error",
    mensagem: "Falha no teste de acesso! Processo não foi localizado conforme esperado.",
    resultadosTeste: dadosFormatados,
    detalhesErro: {
      timestamp: new Date().toISOString(),
      possivelCausa: "O número do processo pode estar incorreto ou o processo pode não estar disponível no Datajud",
      sugestoes: [
        "Verificar se o tribunal selecionado está correto",
        "Confirmar o formato do número do processo",
        "Verificar se a API do Datajud está funcionando corretamente"
      ]
    }
  };
}

// Simulação principal da execução do fluxo
function executarFluxo() {
  console.log('🚀 INICIANDO SIMULAÇÃO DO TESTE DE ACESSO AO PROCESSO');
  console.log('---------------------------------------------------');
  
  // Passo 1: Consultar processo (nó Datajud)
  const respostaAPI = consultarProcesso();
  
  // Passo 2: Formatar dados (nó Formatar Resultados do Teste)
  const dadosFormatados = formatarResultados(respostaAPI);
  
  // Passo 3: Verificar se processo foi encontrado (nó Processo Encontrado?)
  const processoEncontrado = verificarProcessoEncontrado(dadosFormatados);
  
  // Passo 4: Processar resultado com base na verificação
  let resultadoFinal;
  if (processoEncontrado) {
    resultadoFinal = processarSucesso(dadosFormatados);
  } else {
    resultadoFinal = processarFalha(dadosFormatados);
  }
  
  console.log('---------------------------------------------------');
  console.log('📊 RESULTADO FINAL DO TESTE:');
  console.log(JSON.stringify(resultadoFinal, null, 2));
  console.log('---------------------------------------------------');
  console.log('🏁 SIMULAÇÃO CONCLUÍDA');
}

// Executa a simulação
executarFluxo(); 