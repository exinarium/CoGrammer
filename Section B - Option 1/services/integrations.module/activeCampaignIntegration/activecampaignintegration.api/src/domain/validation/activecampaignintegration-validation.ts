import { ActiveCampaignIntegrationRequest, ActiveCampaignIntegrationResponse, ResponseStatus } from '../../../../activecampaignintegration.dto/src';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';

export class ActiveCampaignIntegrationValidation {
    async validate(request: ActiveCampaignIntegrationRequest): Promise<ActiveCampaignIntegrationResponse> {
        try {
            let valid = true;
            let returnMessage = '';

            if (!request) {
                return new ActiveCampaignIntegrationResponse('', 'Request cannot be empty', ResponseStatus.failure, 400, {});
            } else {
                if(!request.apiKey || request.apiKey === '') {
                    returnMessage = '\nThe API Key provided is not valid';
                    valid = false;
                }

                if(request.listId <= 0) {
                    returnMessage = '\nThe list ID provided is not valid and should be greater than 0';
                    valid = false;
                }
            }

            if (!valid) {
                return new ActiveCampaignIntegrationResponse(request.id, returnMessage, ResponseStatus.failure, 400, {});
            }

            const response = new ActiveCampaignIntegrationResponse(request.id, returnMessage, ResponseStatus.success, 200, {});
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = 'Error during request validation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
