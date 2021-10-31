import { ActiveCampaignIntegrationEvent } from '../../activecampaignintegration.dto/src/events/activecampaignintegration-event';
import { ActiveCampaignIntegrationResponse } from '../../activecampaignintegration.dto/src/responses/activecampaignintegration-response';
import { ActiveCampaignIntegrationAggregate } from './domain/aggregates/activecampaignintegration-aggregate';
import { ActiveCampaignIntegrationDataModel } from './domain/models/activecampaignintegration-datamodel';
import Configuration from './configuration.json';
import { ActiveCampaignIntegrationValidation } from './domain/validation/activecampaignintegration-validation';
import { ActiveCampaignIntegrationMapping } from './domain/mapping/activecampaignintegration-mapping';
import { ActiveCampaignIntegrationMessageBus } from './domain/messageBus/activecampaignintegration-message-bus';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src';

export class ActiveCampaignIntegrationProducer{
    private aggregate: ActiveCampaignIntegrationAggregate;

    constructor() {
        const validation = new ActiveCampaignIntegrationValidation();
        const mapping = new ActiveCampaignIntegrationMapping();
        const messageBus = new ActiveCampaignIntegrationMessageBus(Configuration.messageBus.connectionString, Configuration.messageBus.topic);
        this.aggregate = new ActiveCampaignIntegrationAggregate(mapping, messageBus, validation);
    }

    async produceAsync(event: ActiveCampaignIntegrationEvent<ActiveCampaignIntegrationDataModel>): Promise<ActiveCampaignIntegrationResponse> {
        try {
            const response = await this.aggregate.doAsync(event);
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while trying to produce a message for ActiveCampaignIntegration';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
