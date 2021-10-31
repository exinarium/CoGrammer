import { HubspotIntegrationRequest, HubspotIntegrationResponse, ResponseStatus } from '../../../hubspotintegration.dto/src';
import { HubspotIntegrationAggregate } from '../domain/aggregates/hubspotintegration-aggregate';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';

export class HubspotIntegrationController {
    constructor(private _aggregate: HubspotIntegrationAggregate) {}

    async doAsync(request: HubspotIntegrationRequest, user: any): Promise<HubspotIntegrationResponse> {
        try {
            const response = await this._aggregate.doAsync(request, user);
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = `Error occurred while executing aggregation logic in HubspotIntegration API: Request Id: ${request.id}`;
            await LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            return new HubspotIntegrationResponse(
                request.id,
                'An error occurred inside the HubspotIntegration controller and the request could not be processed',
                ResponseStatus.failure,
                500,
                {}
            );
        }
    }
}
