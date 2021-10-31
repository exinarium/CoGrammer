import { ActiveCampaignIntegrationRequest, ActiveCampaignIntegrationResponse, ResponseStatus } from '../../../activecampaignintegration.dto/src';
import { ActiveCampaignIntegrationAggregate } from '../domain/aggregates/activecampaignintegration-aggregate';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';

export class ActiveCampaignIntegrationController {
    constructor(private _aggregate: ActiveCampaignIntegrationAggregate) {}

    async storeTokenAsync(request: ActiveCampaignIntegrationRequest, user: any): Promise<ActiveCampaignIntegrationResponse> {
        try {
            const response = await this._aggregate.storeTokenAsync(request, user);
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = `Error occurred while executing aggregation logic in ActiveCampaignIntegration API: Request Id: ${request.id}`;
            await LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            return new ActiveCampaignIntegrationResponse(
                request.id,
                'An error occurred inside the ActiveCampaignIntegration controller and the request could not be processed',
                ResponseStatus.failure,
                500,
                {}
            );
        }
    }

    async retrieveAvailableLists(request: ActiveCampaignIntegrationRequest, user: any): Promise<ActiveCampaignIntegrationResponse> {
        try {
            const response = await this._aggregate.retrieveAvailableLists(request, user);
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = `Error occurred while executing aggregation logic in ActiveCampaignIntegration API: Request Id: ${request.id}`;
            await LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            return new ActiveCampaignIntegrationResponse(
                request.id,
                'An error occurred inside the ActiveCampaignIntegration controller and the request could not be processed',
                ResponseStatus.failure,
                500,
                {}
            );
        }
    }
}
