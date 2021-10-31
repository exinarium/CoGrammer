import { ILoggingProducer } from './ilogging-producer';
import { LoggingResponse } from '../../logging.dto/src/responses/logging-response';
import { LoggingAggregate } from './domain/aggregates/logging-aggregate';
import Configuration from './configuration.json';
import { LoggingMapping } from './domain/mapping/logging-mapping';
import { LoggingMessageBus } from './domain/messageBus/logging-message-bus';
import { LogPriority } from './domain/models/log-priority';

export class LoggingProducer implements ILoggingProducer {
    private aggregate: LoggingAggregate;

    constructor() {

        const mapping = new LoggingMapping();
        const messageBus = new LoggingMessageBus(Configuration.databaseConfig.connectionString, Configuration.databaseConfig.topic);
        this.aggregate = new LoggingAggregate(mapping, messageBus);
    }

    async logAsync(message: string, error: Error, priority: LogPriority): Promise<LoggingResponse> {
        try {
            const response = await this.aggregate.logAsync(message, error, priority);

            if (error) {
                const ERROR_MESSAGE = `An exception occurred while performing the operation: ${error}`;
                // tslint:disable-next-line:no-console
                console.log(ERROR_MESSAGE);
            }

            return response;
        } catch (ex) {
            const ERROR_MESSAGE = `An error occurred while producing a message in the logging producer: ${ex}`;
            // tslint:disable-next-line:no-console
            console.log(ERROR_MESSAGE);

            throw ex;
        }
    }
}
