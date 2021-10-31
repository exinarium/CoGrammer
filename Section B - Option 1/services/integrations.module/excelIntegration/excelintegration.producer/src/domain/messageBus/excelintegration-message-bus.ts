import { ExcelIntegrationMessage, ExcelIntegrationResponse, ResponseStatus } from '../../../../excelintegration.dto/src';
import { ExcelIntegrationDataModel } from '../../domain/models/excelintegration-datamodel';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import MessageBus from 'covidscreener-messagebus/dist/'

export class ExcelIntegrationMessageBus {
    constructor(private connectionString: string, private topic: string) { }

    async produceMessage(message: ExcelIntegrationMessage<ExcelIntegrationDataModel>): Promise<void> {
        try {
            const messageBus = new MessageBus(this.connectionString);
            const result = await messageBus.send(this.topic, message);
        } catch (ex) {
            const ERROR_MESSAGE = `An error occurred while producing a message in the ExcelIntegration producer: ${ex}`;
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);
        }
    }
}
