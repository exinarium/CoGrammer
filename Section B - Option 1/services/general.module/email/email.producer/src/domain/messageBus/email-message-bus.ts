import { EmailMessage } from '../../../dist/email.dto/src';
import { EmailDataModel } from '../../domain/models/email-datamodel';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import MessageBus from 'covidscreener-messagebus';

export class EmailMessageBus {
    constructor(private connectionString: string, private topic: string) { }

    async produceMessage(message: EmailMessage<EmailDataModel>): Promise<void> {
        try {
            const messageBus = new MessageBus(this.connectionString);
            const result = await messageBus.send(this.topic, message);
        } catch (ex) {
            const ERROR_MESSAGE = `An error occurred while producing a message in the email producer: ${ex}`;
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);
        }
    }
}
