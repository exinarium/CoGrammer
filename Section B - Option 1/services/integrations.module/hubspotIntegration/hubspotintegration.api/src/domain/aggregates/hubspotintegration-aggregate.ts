import { HubspotIntegrationResponse, ResponseStatus, HubspotIntegrationRequest } from '../../../../hubspotintegration.dto/src';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { HubspotIntegrationValidation } from '../validation/hubspotintegration-validation';
import { HubspotIntegrationRepository } from '../repositories/hubspotintegration-repository';

export class HubspotIntegrationAggregate {
    constructor(
        private validation: HubspotIntegrationValidation,
        private repository: HubspotIntegrationRepository
    ) {}

    async doAsync(request: HubspotIntegrationRequest, user: any): Promise<HubspotIntegrationResponse> {
        try {
            const validationResponse = await this.validation.validate(request);

            if (validationResponse.status === ResponseStatus.failure) {
                validationResponse.id = request.id;
                return validationResponse;
            }

            const result = await this.repository.storeApiKey(request.apiKey, user);

            if (result) {
                const response = new HubspotIntegrationResponse(
                    request.id,
                    'HubspotIntegration request success',
                    ResponseStatus.success,
                    200,
                    { }
                );

                return response;
            } else {
                const response = new HubspotIntegrationResponse(
                    request.id,
                    'HubspotIntegration request failure',
                    ResponseStatus.failure,
                    500,
                    { }
                );

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing aggregation logic in HubspotIntegration API';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
