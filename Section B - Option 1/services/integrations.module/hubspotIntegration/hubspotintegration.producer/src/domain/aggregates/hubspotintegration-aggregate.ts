import { HubspotIntegrationResponse, HubspotIntegrationEvent, ResponseStatus } from '../../../../hubspotintegration.dto/src';
import { HubspotIntegrationDataModel } from '../models/hubspotintegration-datamodel';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { HubspotIntegrationMapping } from '../mapping/hubspotintegration-mapping';
import { HubspotIntegrationValidation } from '../validation/hubspotintegration-validation';
import { HubspotIntegrationMessageBus } from '../messageBus/hubspotintegration-message-bus';

export class HubspotIntegrationAggregate {
    constructor(
        private mapping: HubspotIntegrationMapping,
        private messageBus: HubspotIntegrationMessageBus,
        private validator: HubspotIntegrationValidation
    ) { }

    async doAsync(event: HubspotIntegrationEvent<HubspotIntegrationDataModel>): Promise<HubspotIntegrationResponse> {
        try {
            const validationResponse = await this.validator.validate(event);

            if (validationResponse.status === ResponseStatus.failure) {
                return validationResponse;
            }

            if (event.produceMessage) {
                const message = await this.mapping.map(event);
                const produced = await this.messageBus.produceMessage(message);
            }

            const response = new HubspotIntegrationResponse(
                event?.id?.toHexString(),
                'Event produced successfully',
                ResponseStatus.success,
                200,
                {}
            );

            return response;

        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing aggregation logic in HubspotIntegrationProducer producer';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            return;
        }
    }
}
