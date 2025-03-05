import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class DatajudApi implements ICredentialType {
  name = 'datajudApi';
  displayName = 'API do Datajud';
  documentationUrl = 'https://datajud-wiki.cnj.jus.br/api-publica/acesso';
  properties: INodeProperties[] = [
    {
      displayName: 'Chave de API',
      name: 'apiKey',
      type: 'string',
      default: 'cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw==',  // Chave padrão fornecida na documentação
      description: 'Chave de API para autenticação no Datajud',
      required: true,
    },
  ];
} 