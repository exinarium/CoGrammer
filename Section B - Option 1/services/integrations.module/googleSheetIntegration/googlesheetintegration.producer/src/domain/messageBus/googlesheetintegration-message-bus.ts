import { GoogleSheetIntegrationMessage, GoogleSheetIntegrationResponse, ResponseStatus } from '../../../../googlesheetintegration.dto/src';
import { GoogleSheetIntegrationDataModel } from '../../domain/models/googlesheetintegration-datamodel';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import MessageBus from 'covidscreener-messagebus/dist/'

export class GoogleSheetIntegrationMessageBus {
    constructor(private connectionString: string, private topic: string) { }

    async produceMessage(message: GoogleSheetIntegrationMessage<GoogleSheetIntegrationDataModel>): Promise<void> {
        try {
            const messageBus = new MessageBus(this.connectionString);
            const result = await messageBus.send(this.topic, message);
        } catch (ex) {
            const ERROR_MESSAGE = `An error occurred while producing a message in the GoogleSheetIntegration producer: ${ex}`;
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);
        }
    }
}
