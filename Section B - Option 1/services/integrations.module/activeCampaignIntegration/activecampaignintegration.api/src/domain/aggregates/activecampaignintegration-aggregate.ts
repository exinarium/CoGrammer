import { ActiveCampaignIntegrationResponse, ResponseStatus, ActiveCampaignIntegrationRequest } from '../../../../activecampaignintegration.dto/src';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { ActiveCampaignIntegrationProducer } from '../../../../activecampaignintegration.producer/dist/activecampaignintegration.producer/src';
import { ActiveCampaignIntegrationValidation } from '../validation/activecampaignintegration-validation';
import { ActiveCampaignIntegrationMapping } from '../mapping/activecampaignintegration-mapping';
import { ActiveCampaignIntegrationRepository } from '../repositories/acitvecampaignintegration-repository';

export class ActiveCampaignIntegrationAggregate {
    constructor(
        private validation: ActiveCampaignIntegrationValidation,
        private mapper: ActiveCampaignIntegrationMapping,
        private repository: ActiveCampaignIntegrationRepository
    ) {}

    async storeTokenAsync(request: ActiveCampaignIntegrationRequest, user: any): Promise<ActiveCampaignIntegrationResponse> {
        try {
            const validationResponse = await this.validation.validate(request);

            if (validationResponse.status === ResponseStatus.failure) {
                validationResponse.id = request.id;
                return validationResponse;
            }

            const result = await this.repository.storeApiKey(request.apiKey, request.listId, request.apiUrl, user);

            if (result) {
                const response = new ActiveCampaignIntegrationResponse(
                    request.id,
                    'ActiveCampaignIntegration request success',
                    ResponseStatus.success,
                    200,
                    { }
                );

                return response;
            } else {
                const response = new ActiveCampaignIntegrationResponse(
                    request.id,
                    'ActiveCampaignIntegration request failure',
                    ResponseStatus.failure,
                    500,
                    { }
                );

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing aggregation logic in ActiveCampaignIntegration API';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }

    async retrieveAvailableLists(request: ActiveCampaignIntegrationRequest, user: any): Promise<ActiveCampaignIntegrationResponse> {
        try {

            const validationResponse = await this.validation.validate(request);

            if (validationResponse.status === ResponseStatus.failure) {
                validationResponse.id = request.id;
                return validationResponse;
            }

            const result = await this.repository.getAvailableLists(request.apiKey, request.apiUrl, user);

            const lists = await this.mapper.mapToModel(result?.data?.lists);

            if (lists && lists.length > 0) {
                const response = new ActiveCampaignIntegrationResponse(
                    request.id,
                    'ActiveCampaignIntegration request success',
                    ResponseStatus.success,
                    200,
                    { lists }
                );

                return response;
            } else if(lists && lists.length === 0) {
                const response = new ActiveCampaignIntegrationResponse(
                    request.id,
                    'ActiveCampaignIntegration request success',
                    ResponseStatus.success,
                    204,
                    { }
                );

                return response;
            } else {
                const response = new ActiveCampaignIntegrationResponse(
                    request.id,
                    'ActiveCampaignIntegration request failure',
                    ResponseStatus.failure,
                    500,
                    { result }
                );

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing aggregation logic in ActiveCampaignIntegration API';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
