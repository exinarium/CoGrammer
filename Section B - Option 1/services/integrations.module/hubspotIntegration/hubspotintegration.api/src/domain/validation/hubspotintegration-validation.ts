import { HubspotIntegrationRequest, HubspotIntegrationResponse, ResponseStatus } from '../../../../hubspotintegration.dto/src';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';

export class HubspotIntegrationValidation {
    async validate(request: HubspotIntegrationRequest): Promise<HubspotIntegrationResponse> {
        try {
            let valid = true;
            let returnMessage = '';

            if (!request) {
                return new HubspotIntegrationResponse('', 'Request cannot be empty', ResponseStatus.failure, 400, {});
            } else {
                if(!request.apiKey || request.apiKey === '') {
                    returnMessage = '\nThe API Key provided is not valid';
                    valid = false;
                }
            }

            if (!valid) {
                return new HubspotIntegrationResponse(request.id, returnMessage, ResponseStatus.failure, 400, {});
            }

            const response = new HubspotIntegrationResponse(request.id, returnMessage, ResponseStatus.success, 200, {});
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = 'Error during request validation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
