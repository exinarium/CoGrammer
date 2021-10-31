import { ActiveCampaignIntegrationMessage, ActiveCampaignIntegrationResponse, ResponseStatus } from '../../../../activecampaignintegration.dto/src';
import { ActiveCampaignIntegrationDataModel } from '../../domain/models/activecampaignintegration-datamodel';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import MessageBus from 'covidscreener-messagebus/dist/'

export class ActiveCampaignIntegrationMessageBus {
    constructor(private connectionString: string, private topic: string) { }

    async produceMessage(message: ActiveCampaignIntegrationMessage<ActiveCampaignIntegrationDataModel>): Promise<void> {
        try {
            const messageBus = new MessageBus(this.connectionString);
            const result = await messageBus.send(this.topic, message);
        } catch (ex) {
            const ERROR_MESSAGE = `An error occurred while producing a message in the ActiveCampaignIntegration producer: ${ex}`;
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);
        }
    }
}
