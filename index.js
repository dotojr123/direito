// Este arquivo é o ponto de entrada principal do pacote
// e exporta todos os nós e credenciais disponíveis
module.exports = {
  // Exporta os nós disponíveis neste pacote
  nodes: [
    'dist/nodes/Datajud/Datajud.node.js',
  ],

  // Exporta as credenciais disponíveis neste pacote
  credentials: [
    'dist/credentials/DatajudApi.credentials.js',
  ],
}; 