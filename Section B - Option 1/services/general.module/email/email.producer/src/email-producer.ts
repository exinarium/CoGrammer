import { EmailEvent } from '../dist/email.dto/src/';
import { EmailResponse } from '../dist/email.dto/src/';
import { EmailAggregate } from './domain/aggregates/email-aggregate';
import { EmailDataModel } from './domain/models/email-datamodel';
import Configuration from './configuration.json';
import { EmailValidation } from './domain/validation/email-validation';
import { EmailMapping } from './domain/mapping/email-mapping';
import { EmailMessageBus } from './domain/messageBus/email-message-bus';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';

export class EmailProducer {
    private aggregate: EmailAggregate;

    constructor() {
        const validation = new EmailValidation();
        const mapping = new EmailMapping();
        const messageBus = new EmailMessageBus(Configuration.databaseConfig.connectionString, Configuration.databaseConfig.topic);
        this.aggregate = new EmailAggregate(mapping, messageBus, validation);
    }

    async produceAsync(event: EmailEvent<EmailDataModel>): Promise<EmailResponse> {
        try {
            const response = await this.aggregate.doAsync(event);
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while trying to produce a message for Email';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
