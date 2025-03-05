/**
 * Teste Real - Consulta à API do Datajud
 * Este script realiza uma consulta real à API pública do Datajud
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configurações da API
const API_KEY = 'cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw=='; // Chave pública de teste
const API_BASE_URL = 'https://api-publica.datajud.cnj.jus.br';
const NUMERO_PROCESSO = '5000904-47.2022.8.13.0479'; // Processo informado pelo usuário
const TRIBUNAL = 'api_publica_tjmg'; // Alias do TJMG na API pública

// Diretório para salvar os resultados
const RESULTADOS_DIR = path.join(__dirname, 'resultados');
if (!fs.existsSync(RESULTADOS_DIR)) {
  fs.mkdirSync(RESULTADOS_DIR);
}

/**
 * Consulta um processo pelo número na API do Datajud
 * Tenta diferentes estratégias de consulta
 */
async function consultarProcessoPorNumero() {
  console.log(`Iniciando consulta para o processo: ${NUMERO_PROCESSO}`);
  const startTime = new Date();
  
  // Variações do número de processo para tentar diferentes formatos
  const numeroFormatado = NUMERO_PROCESSO.replace(/[^\d]/g, ''); // Remover caracteres não numéricos
  
  // Possíveis formatos de consulta para tentar
  const estrategias = [
    // Estratégia 1: Consulta exata pelo número com formato padrão
    {
      nome: "Consulta exata pelo número com formato padrão",
      query: {
        query: {
          match: {
            "numeroProcesso.keyword": NUMERO_PROCESSO
          }
        }
      }
    },
    // Estratégia 2: Consulta pelo número sem formatação
    {
      nome: "Consulta pelo número sem formatação",
      query: {
        query: {
          match: {
            "numeroProcesso": numeroFormatado
          }
        }
      }
    },
    // Estratégia 3: Consulta mais genérica
    {
      nome: "Consulta em múltiplos campos",
      query: {
        query: {
          multi_match: {
            query: NUMERO_PROCESSO,
            fields: ["numeroProcesso", "numeroProcesso.keyword", "numeroProcessoFormatado"]
          }
        }
      }
    }
  ];
  
  // Loop pelas estratégias até encontrar resultados
  for (const estrategia of estrategias) {
    console.log(`\nTestando estratégia: ${estrategia.nome}`);
    console.log("Enviando requisição com corpo:", JSON.stringify(estrategia.query, null, 2));
    
    try {
      const response = await axios({
        method: 'POST',
        url: `${API_BASE_URL}/${TRIBUNAL}/_search`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `APIKey ${API_KEY}`
        },
        data: estrategia.query,
        timeout: 10000 // 10 segundos de timeout
      });

      const endTime = new Date();
      const executionTime = endTime - startTime;
      console.log(`Consulta concluída em ${executionTime}ms`);

      // Verificar se foi encontrado algum resultado
      const responseData = response.data;
      const encontrouResultados = responseData?.hits?.hits && responseData.hits.hits.length > 0;
      
      // Salvar resposta em arquivo
      fs.writeFileSync(
        path.join(RESULTADOS_DIR, `resultado-estrategia-${estrategias.indexOf(estrategia) + 1}.json`), 
        JSON.stringify(responseData, null, 2)
      );
      
      // Se encontrou resultados, processa e retorna
      if (encontrouResultados) {
        console.log(`✅ Encontrado(s) ${responseData.hits.hits.length} resultado(s) com a estratégia: ${estrategia.nome}`);
        processarResultados(responseData, executionTime);
        return responseData;
      } else {
        console.log(`❌ Nenhum resultado encontrado com a estratégia: ${estrategia.nome}`);
      }
    } catch (error) {
      console.error(`Erro na estratégia ${estrategia.nome}:`, error.message);
      
      // Se houver resposta de erro da API
      if (error.response) {
        console.error(`Status: ${error.response.status}`);
        console.error(`Resposta: ${JSON.stringify(error.response.data, null, 2)}`);
      }
    }
  }
  
  // Se chegou aqui, nenhuma estratégia funcionou
  const endTime = new Date();
  const executionTime = endTime - startTime;
  
  console.log('\n===== RESULTADO FINAL DA CONSULTA =====');
  console.log(`Processo consultado: ${NUMERO_PROCESSO}`);
  console.log(`Tempo total de execução: ${executionTime}ms`);
  console.log('\nNenhuma das estratégias de consulta encontrou o processo. Possíveis causas:');
  console.log('1. O processo não está disponível na base pública do Datajud');
  console.log('2. O número do processo pode estar em um formato diferente do esperado pela API');
  console.log('3. O processo pode estar em outro tribunal ou instância');
  console.log('4. A API pública do Datajud pode ter limitações de acesso a determinados processos');
  
  // Criar relatório de erro
  const errorInfo = {
    timestamp: new Date().toISOString(),
    numeroProcesso: NUMERO_PROCESSO,
    tribunal: TRIBUNAL,
    estrategiasTentadas: estrategias.map(e => e.nome),
    executionTime: executionTime,
    mensagem: "Nenhuma estratégia de consulta encontrou o processo"
  };
  
  // Salvar o relatório em arquivo
  fs.writeFileSync(
    path.join(RESULTADOS_DIR, 'relatorio-final-teste.json'), 
    JSON.stringify(errorInfo, null, 2)
  );
  
  return null;
}

/**
 * Processa e exibe os resultados da consulta
 */
function processarResultados(data, executionTime) {
  console.log('\n======= RESULTADO DA CONSULTA =======');
  console.log(`Processo consultado: ${NUMERO_PROCESSO}`);
  console.log(`Tempo de execução: ${executionTime}ms`);
  
  // Verificar se há hits nos resultados (formato Elasticsearch)
  if (!data || !data.hits || !data.hits.hits || data.hits.hits.length === 0) {
    console.log('\n--- RESULTADO ---');
    console.log('Nenhum processo encontrado com o número informado');
    console.log('Resposta da API:', JSON.stringify(data, null, 2));
    return;
  }

  // Na API do Elasticsearch, os resultados vêm no campo hits.hits
  const hit = data.hits.hits[0];
  const processo = hit._source;
  
  console.log('\n--- DADOS DO PROCESSO ---');
  console.log(`Número CNJ: ${processo.numeroProcesso || 'Não disponível'}`);
  console.log(`Classe: ${processo.classeProcessual || 'Não disponível'}`);
  console.log(`Tribunal: ${processo.tribunal || processo.siglaTribunal || 'Não disponível'}`);
  console.log(`Vara/Juízo: ${processo.orgaoJulgador || 'Não disponível'}`);
  console.log(`Data de distribuição: ${processo.dataAjuizamento || processo.dataDistribuicao || 'Não disponível'}`);
  
  // Validação dos dados esperados
  console.log('\n--- VALIDAÇÃO ---');
  console.log(`Número correto: ${processo.numeroProcesso === NUMERO_PROCESSO ? 'SIM' : 'NÃO'}`);
  console.log(`Classe corresponde ao esperado: ${(processo.classeProcessual?.includes('Procedimento Comum') || processo.classeProcessual?.includes('7')) ? 'SIM' : 'NÃO'}`);
  console.log(`Tribunal corresponde ao esperado: ${processo.tribunal?.includes('TJMG') || processo.siglaTribunal?.includes('TJMG') ? 'SIM' : 'NÃO'}`);
  console.log(`Data de distribuição em 2022: ${(processo.dataAjuizamento?.includes('2022') || processo.dataDistribuicao?.includes('2022')) ? 'SIM' : 'NÃO'}`);
  
  // Exibir partes
  if (processo.partes && processo.partes.length > 0) {
    console.log('\n--- PARTES DO PROCESSO ---');
    processo.partes.forEach((parte, index) => {
      console.log(`Parte ${index + 1}: ${parte.nome || parte.nomeParte || 'Nome não disponível'} (${parte.tipo || parte.tipoParte || 'Tipo não disponível'})`);
    });
  } else {
    console.log('\n--- PARTES DO PROCESSO ---');
    console.log('Nenhuma informação sobre partes disponível');
  }
  
  // Exibir últimos movimentos
  if (processo.movimentos && processo.movimentos.length > 0) {
    console.log('\n--- ÚLTIMOS MOVIMENTOS ---');
    const ultimosMovimentos = processo.movimentos.slice(0, 3);
    ultimosMovimentos.forEach((movimento, index) => {
      console.log(`${index + 1}. ${movimento.data || 'Data não disponível'}: ${movimento.nome || movimento.descricao || 'Descrição não disponível'}`);
    });
  } else if (processo.movimentacoes && processo.movimentacoes.length > 0) {
    console.log('\n--- ÚLTIMOS MOVIMENTOS ---');
    const ultimosMovimentos = processo.movimentacoes.slice(0, 3);
    ultimosMovimentos.forEach((movimento, index) => {
      console.log(`${index + 1}. ${movimento.data || 'Data não disponível'}: ${movimento.descricao || 'Descrição não disponível'}`);
    });
  } else {
    console.log('\n--- ÚLTIMOS MOVIMENTOS ---');
    console.log('Nenhuma informação sobre movimentos disponível');
  }
  
  // Exibir o JSON completo para análise
  console.log('\n--- DADOS COMPLETOS ---');
  console.log('Objeto salvo em exemplos/resultados/resultado-teste-real.json');
  
  console.log('\n======= FIM DO RESULTADO =======');
}

// Executar o teste
console.log('Iniciando teste real com a API do Datajud...');
consultarProcessoPorNumero()
  .then(() => console.log('Teste concluído.'))
  .catch(err => console.error('Erro ao executar teste:', err)); 