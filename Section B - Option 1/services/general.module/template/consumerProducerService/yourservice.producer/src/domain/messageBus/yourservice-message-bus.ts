import { YourServiceMessage, YourServiceResponse, ResponseStatus } from '../../../../yourservice.dto/src';
import { YourServiceDataModel } from '../../domain/models/yourservice-datamodel';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import MessageBus from 'covidscreener-messagebus/dist/'

export class YourServiceMessageBus {
    constructor(private connectionString: string, private topic: string) { }

    async produceMessage(message: YourServiceMessage<YourServiceDataModel>): Promise<void> {
        try {
            const messageBus = new MessageBus(this.connectionString);
            const result = await messageBus.send(this.topic, message);
        } catch (ex) {
            const ERROR_MESSAGE = `An error occurred while producing a message in the YourService producer: ${ex}`;
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);
        }
    }
}
