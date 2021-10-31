import { ActiveCampaignIntegrationResponse, ActiveCampaignIntegrationEvent, ResponseStatus } from '../../../../activecampaignintegration.dto/src';
import { ActiveCampaignIntegrationDataModel } from '../models/activecampaignintegration-datamodel';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { ActiveCampaignIntegrationMapping } from '../mapping/activecampaignintegration-mapping';
import { ActiveCampaignIntegrationValidation } from '../validation/activecampaignintegration-validation';
import { ActiveCampaignIntegrationMessageBus } from '../messageBus/activecampaignintegration-message-bus';

export class ActiveCampaignIntegrationAggregate {
    constructor(
        private mapping: ActiveCampaignIntegrationMapping,
        private messageBus: ActiveCampaignIntegrationMessageBus,
        private validator: ActiveCampaignIntegrationValidation
    ) { }

    async doAsync(event: ActiveCampaignIntegrationEvent<ActiveCampaignIntegrationDataModel>): Promise<ActiveCampaignIntegrationResponse> {
        try {
            const validationResponse = await this.validator.validate(event);

            if (validationResponse.status === ResponseStatus.failure) {
                return validationResponse;
            }

            if (event.produceMessage) {
                const message = await this.mapping.map(event);
                const produced = await this.messageBus.produceMessage(message);
            }

            const response = new ActiveCampaignIntegrationResponse(
                event?.id?.toHexString(),
                'Event produced successfully',
                ResponseStatus.success,
                200,
                {}
            );

            return response;

        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing aggregation logic in ActiveCampaignIntegrationProducer producer';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            return;
        }
    }
}
