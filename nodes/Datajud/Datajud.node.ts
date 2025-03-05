import {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import axios, { AxiosError } from 'axios';

export class Datajud implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Datajud',
		name: 'datajud',
		icon: 'file:datajud.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Consulta processos judiciais através da API do Datajud',
		defaults: {
			name: 'Datajud',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'datajudApi',
				required: true,
			},
		],
		properties: [
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
				],
				default: 'consultarProcesso',
			},
			{
				displayName: 'Número do Processo',
				name: 'numeroProcesso',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['consultarProcesso'],
					},
				},
				placeholder: '5000904-47.2022.8.13.0479',
				description: 'Número do processo judicial no formato oficial',
			},
			{
				displayName: 'Tribunal',
				name: 'aliasTribunal',
				type: 'options',
				options: [
					{ name: 'TST - Tribunal Superior do Trabalho', value: 'api_publica_tst' },
					{ name: 'TSE - Tribunal Superior Eleitoral', value: 'api_publica_tse' },
					{ name: 'STJ - Superior Tribunal de Justiça', value: 'api_publica_stj' },
					{ name: 'STM - Superior Tribunal Militar', value: 'api_publica_stm' },
					{ name: 'TRF1 - Tribunal Regional Federal da 1ª Região', value: 'api_publica_trf1' },
					{ name: 'TRF2 - Tribunal Regional Federal da 2ª Região', value: 'api_publica_trf2' },
					{ name: 'TRF3 - Tribunal Regional Federal da 3ª Região', value: 'api_publica_trf3' },
					{ name: 'TRF4 - Tribunal Regional Federal da 4ª Região', value: 'api_publica_trf4' },
					{ name: 'TRF5 - Tribunal Regional Federal da 5ª Região', value: 'api_publica_trf5' },
					{ name: 'TRF6 - Tribunal Regional Federal da 6ª Região', value: 'api_publica_trf6' },
					{ name: 'TJSP - Tribunal de Justiça de São Paulo', value: 'api_publica_tjsp' },
					{ name: 'TJRS - Tribunal de Justiça do Rio Grande do Sul', value: 'api_publica_tjrs' },
					{ name: 'TJMG - Tribunal de Justiça de Minas Gerais', value: 'api_publica_tjmg' },
					{ name: 'TJBA - Tribunal de Justiça da Bahia', value: 'api_publica_tjba' },
				],
				default: 'api_publica_tjsp',
				required: true,
				displayOptions: {
					show: {
						operation: ['consultarProcesso'],
					},
				},
				description: 'Tribunal onde o processo está em tramitação',
			},
			{
				displayName: 'Opções Avançadas',
				name: 'opcoes',
				type: 'collection',
				placeholder: 'Adicionar opção',
				default: {},
				displayOptions: {
					show: {
						operation: ['consultarProcesso'],
					},
				},
				options: [
					{
						displayName: 'Data de Início',
						name: 'dataInicio',
						type: 'dateTime',
						default: '',
						description: 'Data inicial para filtrar resultados',
					},
					{
						displayName: 'Data Final',
						name: 'dataFim',
						type: 'dateTime',
						default: '',
						description: 'Data final para filtrar resultados',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		let responseData;

		const operation = this.getNodeParameter('operation', 0) as string;
		const credentials = await this.getCredentials('datajudApi');

		// Para cada item de entrada (normalmente apenas um na maioria dos casos de uso)
		for (let i = 0; i < items.length; i++) {
			if (operation === 'consultarProcesso') {
				const numeroProcesso = this.getNodeParameter('numeroProcesso', i) as string;
				const aliasTribunal = this.getNodeParameter('aliasTribunal', i) as string;
				const options = this.getNodeParameter('opcoes', i, {}) as IDataObject;

				const url = `https://api-publica.datajud.cnj.jus.br/${aliasTribunal}/_search`;
				
				// Preparar o corpo da requisição
				const requestBody: IDataObject = {
					numeroProcesso,
					aliasTribunal,
				};

				// Adicionar filtros se especificados
				if (options.dataInicio || options.dataFim) {
					const filtros: IDataObject = {};
					
					if (options.dataInicio) {
						// Converter para formato YYYY-MM-DD
						const dataInicio = new Date(options.dataInicio as string);
						filtros.dataInicio = dataInicio.toISOString().split('T')[0];
					}
					
					if (options.dataFim) {
						// Converter para formato YYYY-MM-DD
						const dataFim = new Date(options.dataFim as string);
						filtros.dataFim = dataFim.toISOString().split('T')[0];
					}
					
					requestBody.filtros = filtros;
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
					returnData.push(responseData);
				} catch (error: any) {
					if (error.response) {
						// O servidor respondeu com um status diferente de 2xx
						throw new NodeOperationError(this.getNode(), `Erro na consulta: ${error.response.data?.message || error.message}`, {
							itemIndex: i,
							description: `Status: ${error.response.status}`,
						});
					} else if (error.request) {
						// A requisição foi feita mas não houve resposta
						throw new NodeOperationError(this.getNode(), 'Não foi possível conectar ao servidor do Datajud', {
							itemIndex: i,
						});
					} else {
						// Algo aconteceu ao configurar a requisição
						throw new NodeOperationError(this.getNode(), `Erro: ${error.message}`, {
							itemIndex: i,
						});
					}
				}
			}
		}

		// Mapear os dados de retorno para o formato esperado pelo n8n
		const executionData = this.helpers.returnJsonArray(returnData);
		return [executionData];
	}
} 