import { HubspotIntegrationMessage, HubspotIntegrationResponse, ResponseStatus } from '../../../../hubspotintegration.dto/src';
import { HubspotIntegrationDataModel } from '../../domain/models/hubspotintegration-datamodel';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import MessageBus from 'covidscreener-messagebus/dist/'

export class HubspotIntegrationMessageBus {
    constructor(private connectionString: string, private topic: string) { }

    async produceMessage(message: HubspotIntegrationMessage<HubspotIntegrationDataModel>): Promise<void> {
        try {
            const messageBus = new MessageBus(this.connectionString);
            const result = await messageBus.send(this.topic, message);
        } catch (ex) {
            const ERROR_MESSAGE = `An error occurred while producing a message in the HubspotIntegration producer: ${ex}`;
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);
        }
    }
}
