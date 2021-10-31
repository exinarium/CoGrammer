import { ILoggingMessageBus } from './ilogging-message-bus';
import { LoggingMessage } from '../../../../logging.dto/src';
import MessageBus from 'covidscreener-messagebus';
import { LoggingDataModel } from '../../domain/models/logging-datamodel';

export class LoggingMessageBus implements ILoggingMessageBus {

    constructor(private connectionString: string, private topic: string) {
    }

    async produceMessage(message: LoggingMessage<LoggingDataModel>): Promise<boolean> {
        try {

            const messageBus = new MessageBus(this.connectionString);
            const result = await messageBus.send(this.topic, message);
            return result;
        } catch (ex) {
            const ERROR_MESSAGE = `An error occurred while producing a message in the logging producer: ${ex}`;
            // tslint:disable-next-line:no-console
            console.log(ERROR_MESSAGE);
        }
    }
}
