import { HubspotIntegrationEvent } from '../../hubspotintegration.dto/src/events/hubspotintegration-event';
import { HubspotIntegrationResponse } from '../../hubspotintegration.dto/src/responses/hubspotintegration-response';
import { HubspotIntegrationAggregate } from './domain/aggregates/hubspotintegration-aggregate';
import { HubspotIntegrationDataModel } from './domain/models/hubspotintegration-datamodel';
import Configuration from './configuration.json';
import { HubspotIntegrationValidation } from './domain/validation/hubspotintegration-validation';
import { HubspotIntegrationMapping } from './domain/mapping/hubspotintegration-mapping';
import { HubspotIntegrationMessageBus } from './domain/messageBus/hubspotintegration-message-bus';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src';

export class HubspotIntegrationProducer{
    private aggregate: HubspotIntegrationAggregate;

    constructor() {
        const validation = new HubspotIntegrationValidation();
        const mapping = new HubspotIntegrationMapping();
        const messageBus = new HubspotIntegrationMessageBus(Configuration.messageBus.connectionString, Configuration.messageBus.topic);
        this.aggregate = new HubspotIntegrationAggregate(mapping, messageBus, validation);
    }

    async produceAsync(event: HubspotIntegrationEvent<HubspotIntegrationDataModel>): Promise<HubspotIntegrationResponse> {
        try {
            const response = await this.aggregate.doAsync(event);
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while trying to produce a message for HubspotIntegration';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
